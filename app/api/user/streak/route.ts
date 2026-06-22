import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { calculateUserStreak } from "@/lib/streak";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ streak: 0 });
    }

    const streak = await calculateUserStreak(session.user.id);
    return NextResponse.json({ streak });
  } catch (error) {
    console.error("Error fetching streak:", error);
    return NextResponse.json({ streak: 0 }, { status: 500 });
  }
}
