import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
    const { name, username } = await req.json()

    const userExists = await prisma.user.findUnique({
        where: {
            username
        }
    })

    if (userExists) {
        return NextResponse.json(null, {
            status: 400
        })
    }

    const user = await prisma.user.create({
        data: {
            name,
            username
        }
    })

    cookies().set('@ignitecall:userId', user.id, {
        maxAge: 60 * 60 * 24 * 7, // 7 dias
        path: '/'
    })

    return NextResponse.json(user, {
        status: 201
    })
}