import mongoose, { Schema, Model } from "mongoose";

interface OtpVerificationDoc extends mongoose.Document {
  mobile: string;
  token: string;
  expiresAt: Date;
}

const schema = new Schema<OtpVerificationDoc>(
  {
    mobile: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    token: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Automatically delete the document when expiresAt is reached
schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OtpVerification: Model<OtpVerificationDoc> =
  mongoose.models.OtpVerification ||
  mongoose.model<OtpVerificationDoc>("OtpVerification", schema);
