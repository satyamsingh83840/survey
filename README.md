# जनता का न्याय — Next.js + MongoDB + Cloudinary + Multer + Twilio

This project converts the supplied Hindi prototype into a full-stack Next.js application.

## Stack
- Next.js App Router + TypeScript
- MongoDB + Mongoose
- Twilio Verify for SMS OTP
- Multer memory storage for multipart photo uploads
- Cloudinary for image storage/transformation

## Setup
1. Install Node.js 20+.
2. Copy `.env.example` to `.env.local` and fill in all values.
3. Create a Twilio Verify Service and use its `VA...` SID.
4. Create a Cloudinary account and API credentials.
5. Create a MongoDB database/cluster and set `MONGODB_URI`.
6. Run:

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## OTP
The UI sends the phone number to `/api/otp/send`. Twilio Verify sends the SMS. `/api/otp/verify` verifies it and creates a short-lived MongoDB verification token. The submission API requires that token, so the UI's verification state cannot simply be bypassed.

## Upload
The petition endpoint is a Node Pages API route because Multer expects Node's IncomingMessage/ServerResponse interfaces. Multer stores the image in memory, then the server streams it to Cloudinary. Only the Cloudinary URL/public ID are stored in MongoDB.

## Production checklist
- Add rate limiting for OTP send/verify and petition submission.
- Add CAPTCHA/abuse protection.
- Restrict CORS if you split frontend/backend.
- Configure Cloudinary signed/admin access appropriately.
- Add an admin authentication layer before exposing submission exports.
- Add privacy notice, retention/deletion policy, access controls and audit logging.
- Consider encrypting especially sensitive fields at rest and minimize collection of identity data.
- Do not collect full Aadhaar numbers or Aadhaar copies unless there is a reviewed legal basis and secure workflow.
