import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { z } from "zod";

const updateProfileBodySchema = z.object({
    bio: z.string()
})

export async function PUT(req: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json(null, { status: 401 })
    }

    const body = await req.json()

    const { bio } = updateProfileBodySchema.parse(body)

    await prisma.user.update({
        where: {
            id: session.user.id
        },
        data: {
            bio
        }
    })


    return new Response(null, {
        status: 204
    })
}