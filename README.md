# जनता का न्याय — Next.js Survey

Next.js App Router survey form with MongoDB storage and a live total submissions count. Original Hindi campaign content and logo are retained.

## Fields
- Name
- Phone number
- Email
- Address

No OTP, no required-field validation, no phone/email format validation, and no duplicate-phone check. Empty submissions are allowed.

## Run locally
1. Install Node.js 20.9 or later.
2. Run `npm install`.
3. Create `.env.local` in the project root:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@YOUR-CLUSTER.mongodb.net/janta_ka_nyay?retryWrites=true&w=majority
```

4. Replace placeholders with your MongoDB Atlas connection details. Create a database user and allow your deployment IP in Atlas Network Access. Keep `.env.local` private.
5. Run `npm run dev` and open http://localhost:3000.

## API
- `POST /api/surveys` stores the four fields and returns the updated count and record ID.
- `GET /api/surveys` returns the count from MongoDB.

Set `MONGODB_URI` in your hosting environment before deployment. Empty and duplicate submissions count separately by design. Consider rate limiting before making the form public.
