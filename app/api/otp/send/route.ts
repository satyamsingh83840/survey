import { NextResponse } from 'next/server';
import { twilioClient, verifyServiceSid } from '@/lib/twilio';

export const runtime = 'nodejs';
export async function POST(req: Request) { try { const { mobile } = await req.json(); if (!/^\+[1-9]\d{9,14}$/.test(mobile)) return NextResponse.json({error:'Use E.164 phone format, e.g. +919876543210'},{status:400}); const verification = await twilioClient.verify.v2.services(verifyServiceSid).verifications.create({to:mobile, channel:'sms'}); return NextResponse.json({status:verification.status}); } catch { return NextResponse.json({error:'OTP could not be sent'},{status:500}); } }
