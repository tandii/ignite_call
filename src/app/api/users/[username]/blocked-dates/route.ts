import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { username: string } }) {
    const { searchParams } = new URL(req.url)

    const username = params.username
    const year = searchParams.get('year')
    const month = searchParams.get('month')

    if (!year || !month) {
        return NextResponse.json({ message: 'Year or month not specified.' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
        where: {
            username
        }
    })

    if (!user) {
        return NextResponse.json({ message: 'User does not exist.' }, { status: 400 })
    }

    const availabilityWeekDays = await prisma.userTimeInterval.findMany({
        select: {
            week_day: true
        },
        where: {
            user_id: user.id
        }
    })

    const blockedWeekDays = [0, 1, 2, 3, 4, 5, 6].filter((weekDay) => {
        return !availabilityWeekDays.some(
            (availabilityWeekDay) => availabilityWeekDay.week_day === weekDay
        )
    })

    // const blockedDatesRaw: Array<{ date: string }> = await prisma.$queryRaw`
    //     SELECT
    //         EXTRACT(DAY FROM S.date) as date,
    //         COUNT(S.date) AS amount,
    //         ((UTI.time_end_in_minutes - UTI.time_start_in_minutes) / 60) AS size

    //     FROM schedulings S

    //     LEFT JOIN user_time_intervals UTI
    //         ON UTI.week_day = WEEKDAY(DATE_ADD(S.date, INTERVAL 1 DAY))

    //     WHERE S.user_id = ${user.id}
    //         AND DATE_FORMAT(S.date, "%Y-%m") = ${`${year}-${month}`}

    //     GROUP BY EXTRACT(DAY FROM S.date),
    //         ((UTI.time_end_in_minutes - UTI.time_start_in_minutes) / 60)

    //     HAVING amount >= size
    // `

    const blockedDatesRaw: Array<{ date: string }> = await prisma.$queryRaw`
        SELECT
            EXTRACT(DAY FROM S.date) as date,
            COUNT(S.date) AS amount,
            ((UTI.time_end_in_minutes - UTI.time_start_in_minutes) / 60) AS size
        FROM 
            schedulings S
        LEFT JOIN 
            user_time_intervals UTI ON UTI.week_day = EXTRACT(DOW FROM S.date)
        WHERE 
            S.user_id = ${user.id}
            AND TO_CHAR(S.date, 'YYYY-MM') = ${`${year}-${month}`}
        GROUP BY 
            EXTRACT(DAY FROM S.date),
            ((UTI.time_end_in_minutes - UTI.time_start_in_minutes) / 60)
        HAVING 
            COUNT(S.date) >= ((UTI.time_end_in_minutes - UTI.time_start_in_minutes) / 60)
    `

    const blockedDates = blockedDatesRaw.map((item) => Number(item.date))

    return NextResponse.json({ blockedWeekDays, blockedDates })
}