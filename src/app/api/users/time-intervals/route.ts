import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { z } from "zod";

const timeIntervalsBodySchema = z.object({
    intervals: z.array(
        z.object({
            weekDay: z.number(),
            startTimeInMinutes: z.number(),
            endTimeInMinutes: z.number(),
        }),
    ),
})

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ message : 'Unauthorized'}, { status: 401 })
    }

    const body = await req.json()

    const { intervals } = timeIntervalsBodySchema.parse(body)

    await Promise.all(intervals.map(interval => {
        return prisma.userTimeInterval.create({
            data: {
                user_id: session.user.id,
                week_day: interval.weekDay,
                time_start_in_minutes: interval.startTimeInMinutes,
                time_end_in_minutes: interval.endTimeInMinutes
            }
        })
    }))

    return NextResponse.json({ message: 'Created' }, {
        status: 201
    })
}