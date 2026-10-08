import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { connectDB } from '../../lib/mongodb';
import { Petition } from '../../models/Petition';
import { OtpVerification } from '../../models/OtpVerification';
import { makePetitionId } from '../../lib/petition-id';
import { uploadPhoto } from '../../lib/cloudinary-upload';

export const config = { api: { bodyParser: false } };
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => cb(null, ['image/jpeg','image/png','image/webp'].includes(file.mimetype)),
});
const parse = upload.single('photo');

type ReqWithFile = NextApiRequest & { file?: Express.Multer.File };
function parseMultipart(req: ReqWithFile, res: NextApiResponse) { return new Promise<void>((resolve,reject)=>parse(req as any,res as any,(err)=>err?reject(err):resolve())); }

export default async function handler(req: ReqWithFile, res: NextApiResponse) {
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  try { await parseMultipart(req,res); } catch(e:any) { return res.status(400).json({error:e?.message||'Invalid upload'}); }
  try {
    const { name='', mobile='', state='', district='', address='', idType='', idLast4='', verificationToken='' } = req.body as Record<string,string>;
    if(!name.trim()||!/^\+[1-9]\d{9,14}$/.test(mobile)||!state.trim()||!district.trim()||!address.trim()) return res.status(400).json({error:'Required fields are missing'});
    if(!req.file) return res.status(400).json({error:'Photo is required'});
    if(!['','Voter ID','Driving Licence','Passport','अन्य'].includes(idType)||!/^$|^\d{4}$/.test(idLast4)) return res.status(400).json({error:'Invalid identity fields'});
    await connectDB();
    if(await Petition.exists({mobile})) return res.status(409).json({error:'इस मोबाइल नंबर से समर्थन पहले ही दर्ज है।'});
    const verification=await OtpVerification.findOne({mobile,token:verificationToken,expiresAt:{$gt:new Date()}});
    if(!verification) return res.status(400).json({error:'Mobile OTP verification is required or has expired.'});
    const photo=await uploadPhoto(req.file.buffer);
    let doc:any;
    for(let i=0;i<5;i++){try{doc=await Petition.create({petitionId:makePetitionId(),name:name.trim(),mobile,state:state.trim(),district:district.trim(),address:address.trim(),photoUrl:photo.secure_url,photoPublicId:photo.public_id,idType,idLast4});break}catch(err:any){if(err?.code!==11000)throw err;}}
    if(!doc) throw new Error('Could not create petition');
    await OtpVerification.deleteOne({_id:verification._id});
    return res.status(201).json({petitionId:doc.petitionId});
  } catch(e:any) { return res.status(500).json({error:e?.message||'Submission failed'}); }
}
