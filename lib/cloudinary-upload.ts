import cloudinary from './cloudinary';

export function uploadPhoto(buffer: Buffer) {
  return new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({
      folder: 'janta-ka-nyay/petitions',
      resource_type: 'image',
      transformation: [{ width: 900, height: 900, crop: 'limit', quality: 'auto', fetch_format: 'auto' }],
    }, (error, result) => {
      if (error || !result) return reject(error || new Error('Cloudinary upload failed'));
      resolve({ secure_url: result.secure_url, public_id: result.public_id });
    });
    stream.end(buffer);
  });
}
