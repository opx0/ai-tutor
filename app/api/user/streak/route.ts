import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { calculateUserStreak } from "@/lib/streak"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ streak: 0 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ streak: 0 })
    }

    const streak = await calculateUserStreak(user.id)
    return NextResponse.json({ streak })
  } catch (error) {
    console.error("Error fetching streak:", error)
    return NextResponse.json({ streak: 0 }, { status: 500 })
  }
}
