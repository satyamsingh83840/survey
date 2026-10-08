import twilio from 'twilio';

const sid = process.env.TWILIO_ACCOUNT_SID;
const token = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
if (!sid || !token || !serviceSid) throw new Error('Twilio environment variables are not configured');

export const twilioClient = twilio(sid, token);
export const verifyServiceSid = serviceSid;
