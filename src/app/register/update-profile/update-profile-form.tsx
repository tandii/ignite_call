'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, User2 } from 'lucide-react'
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Session } from "next-auth";
import Image from "next/image";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";

const updateProfileSchema = z.object({
    bio: z.string()
})

type UpdateProfileData = z.infer<typeof updateProfileSchema>

interface UpdateProfileFormProps {
    session: Session | null
}

export default function UpdateProfileForm({ session }: UpdateProfileFormProps) {
    const {
        register,
        handleSubmit,
        formState: { isSubmitting }
    } = useForm<UpdateProfileData>({
        resolver: zodResolver(updateProfileSchema)
    })

    const router = useRouter()

    async function handleUpdateProfile(data: UpdateProfileData) {
        await api.put('/users/profile', {
            bio: data.bio
        })

        router.push(`/schedule/${session?.user.username}`)
    }

    return (
        <form onSubmit={handleSubmit(handleUpdateProfile)} className="mt-6 flex flex-col gap-4 bg-zinc-800 p-6 rounded-md border border-zinc-700">
            <label className="flex flex-col gap-2">
                <p className="text-sm">Foto de perfil</p>
                {session?.user.avatar_url ? (
                    <Image
                        src={session.user.avatar_url}
                        className="w-16 h-16 rounded-full"
                        width={64}
                        height={64}
                        alt={session.user.name}
                    />
                ) : (
                    <div className="w-16 h-16 flex items-center justify-center bg-zinc-700 rounded-full">
                        <User2 size={28} className="text-zinc-900" />
                    </div>
                )}
            </label>

            <label className="flex flex-col gap-2">
                <p className="text-sm">Sobre você</p>
                <textarea
                    {...register('bio')}
                    className="px-4 py-3 h-32 resize-none bg-zinc-900 text-sm text-white outline-none rounded-md focus:ring-1 ring-emerald-500"
                />
                <p className="text-sm text-zinc-400">Fale um pouco sobre você. Isto será exibido em sua página pessoal.</p>
            </label>

            <button
                disabled={isSubmitting}
                type="submit"
                className="rounded-md bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center text-sm gap-2 py-3 font-medium disabled:bg-zinc-400 disabled:cursor-not-allowed"
            >
                Finalizar
                <ArrowRight size={16} />
            </button>
        </form>
    )
}
