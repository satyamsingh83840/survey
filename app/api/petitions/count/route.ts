import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Petition } from "@/models/Petition";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectDB();

    const count = await Petition.countDocuments();

    return NextResponse.json({
      count,
    });
  } catch (error) {
    console.error("PETITION COUNT ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch petition count",
      },
      { status: 500 },
    );
  }
}
