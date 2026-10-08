import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { twilioClient, verifyServiceSid } from "@/lib/twilio";
import { connectDB } from "@/lib/mongodb";
import { OtpVerification } from "@/models/OtpVerification";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const mobile = String(body.mobile || "").trim();
    const code = String(body.code || "").trim();

    console.log("1. VERIFY REQUEST:", {
      mobile,
      codeLength: code.length,
      serviceConfigured: !!verifyServiceSid,
    });

    if (!/^\+[1-9]\d{9,14}$/.test(mobile) || !/^\d{6}$/.test(code)) {
      return NextResponse.json({ error: "Invalid OTP data" }, { status: 400 });
    }

    console.log("2. CALLING TWILIO...");

    const check = await twilioClient.verify.v2
      .services(verifyServiceSid)
      .verificationChecks.create({
        to: mobile,
        code,
      });

    console.log("3. TWILIO RESPONSE:", check.status);

    if (check.status !== "approved") {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 },
      );
    }

    console.log("4. CONNECTING MONGODB...");

    await connectDB();

    console.log("5. MONGODB CONNECTED");

    const token = randomBytes(32).toString("hex");

    await OtpVerification.findOneAndUpdate(
      { mobile },
      {
        mobile,
        token,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
      {
        upsert: true,
        new: true,
      },
    );

    console.log("6. TOKEN SAVED");

    return NextResponse.json({
      verified: true,
      verificationToken: token,
    });
  } catch (error: any) {
    console.error("========== OTP VERIFY ERROR ==========");
    console.error(error);
    console.error("Message:", error?.message);
    console.error("Code:", error?.code);
    console.error("Status:", error?.status);
    console.error("======================================");

    return NextResponse.json(
      {
        error: error?.message || "OTP verification failed",
        code: error?.code || null,
        status: error?.status || null,
      },
      { status: 500 },
    );
  }
}
