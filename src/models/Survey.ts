import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
const SurveySchema = new Schema({
  name: { type: String, default: "" },
  phoneNumber: { type: String, default: "" },
  email: { type: String, default: "" },
  address: { type: String, default: "" },
  idType: { type: String, default: "" },
  idLast4: { type: String, default: "" },
  c1: { type: Boolean, default: false },
  c2: { type: Boolean, default: false },
  c3: { type: Boolean, default: false },
}, { timestamps: true });
export type SurveyDocument = InferSchemaType<typeof SurveySchema>;
const Survey: Model<SurveyDocument> = (mongoose.models.Survey as Model<SurveyDocument>) || mongoose.model<SurveyDocument>("Survey", SurveySchema);
export default Survey;
