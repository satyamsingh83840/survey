import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Survey from "@/models/Survey";
export const runtime = "nodejs";
export async function GET() {
  try {
    await connectToDatabase();
    return NextResponse.json({ success: true, count: await Survey.countDocuments() });
  } catch (error) {
    console.error("Unable to fetch survey count:", error);
    return NextResponse.json({ success: false, message: "Unable to fetch survey count" }, { status: 500 });
  }
}
export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectToDatabase();
    const survey = await Survey.create({
      name: body.name ?? "", phoneNumber: body.phoneNumber ?? "", email: body.email ?? "", address: body.address ?? "",
      idType: body.idType ?? "", idLast4: body.idLast4 ?? "",
      c1: Boolean(body.c1), c2: Boolean(body.c2), c3: Boolean(body.c3),
    });
    const count = await Survey.countDocuments();
    return NextResponse.json({ success: true, id: survey._id.toString(), count }, { status: 201 });
  } catch (error) {
    console.error("Unable to save survey:", error);
    return NextResponse.json({ success: false, message: "Unable to save survey" }, { status: 500 });
  }
}
