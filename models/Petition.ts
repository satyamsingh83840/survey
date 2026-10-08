import mongoose, { Schema, Model } from 'mongoose';

export interface PetitionDoc extends mongoose.Document {
  petitionId: string;
  name: string;
  mobile: string;
  state: string;
  district: string;
  address: string;
  photoUrl: string;
  photoPublicId: string;
  idType?: string;
  idLast4?: string;
  createdAt: Date;
}

const PetitionSchema = new Schema<PetitionDoc>({
  petitionId: { type: String, unique: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 120 },
  mobile: { type: String, required: true, unique: true, index: true },
  state: { type: String, required: true, trim: true, maxlength: 80 },
  district: { type: String, required: true, trim: true, maxlength: 80 },
  address: { type: String, required: true, trim: true, maxlength: 500 },
  photoUrl: { type: String, required: true },
  photoPublicId: { type: String, required: true },
  idType: { type: String, trim: true, maxlength: 40 },
  idLast4: { type: String, trim: true, match: /^$|^\d{4}$/ },
}, { timestamps: { createdAt: true, updatedAt: false } });

export const Petition: Model<PetitionDoc> = mongoose.models.Petition || mongoose.model<PetitionDoc>('Petition', PetitionSchema);
