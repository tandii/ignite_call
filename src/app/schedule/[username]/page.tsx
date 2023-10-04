import { prisma } from '@/lib/prisma'
import { User2 } from 'lucide-react'
import Image from 'next/image'
import { ScheduleForm } from './ScheduleForm'
import { Metadata } from 'next'

export async function generateMetadata(
    { params }: { params: { username: string } }
): Promise<Metadata> {
    const { username } = params

    return {
        title: `Agendar com ${username} | ignite Call`,
    }
}

export const revalidate = 60 * 60 * 24 // 1 dia

export default async function Schedule({ params }: { params: { username: string } }) {

    const user = await prisma.user.findUnique({
        where: {
            username: params.username
        }
    })

    if (!user) {
        return (
            <div className='w-screen h-screen flex items-center justify-center gap-10 text-sm'>
                <span className='font-bold text-2xl'>404</span> This page could not be found.
            </div>
        )
    }

    return (
        <div className='max-w-[852px] px-4 mt-20 mx-auto mb-4'>
            <div className='flex flex-col items-center'>
                {user?.avatar_url ? (
                    <Image
                        src={user.avatar_url}
                        className="w-16 h-16 rounded-full"
                        width={64}
                        height={64}
                        alt={user.name}
                    />
                ) : (
                    <div className="w-16 h-16 flex items-center justify-center bg-zinc-700 rounded-full">
                        <User2 size={28} className="text-zinc-900" />
                    </div>
                )}

                <h1 className='mt-2 text-2xl font-bold'>{user?.name}</h1>
                <p className='text-zinc-400'>{user?.bio}</p>
            </div>

            <ScheduleForm />
        </div>
    )
}