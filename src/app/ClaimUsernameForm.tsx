'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const claimUsernameFormSchema = z.object({
    username: z.string()
        .min(3, { message: 'O usuário precisa ter pelo menos 3 letras.' })
        .regex(/^([a-z\\-]+)$/i, {
            message: 'O usuário pode ter apenas letras e hifens.'
        })
        .transform(username => username.toLowerCase())
})

type ClaimUsernameFormData = z.infer<typeof claimUsernameFormSchema>

export function ClaimUsernameForm() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ClaimUsernameFormData>({
        resolver: zodResolver(claimUsernameFormSchema)
    })

    const router = useRouter()

    function handleClaimUsername(data: ClaimUsernameFormData) {
        const { username } = data

        router.push(`/register?username=${username}`)
    }

    const prefix = 'prefix-'

    return (
        <>
            <form onSubmit={handleSubmit(handleClaimUsername)} className='grid grid-cols-1 sm:grid-cols-layout bg-zinc-800 p-4 rounded-md gap-2 mt-4'>
                <input
                    {...register('username')}
                    type="text"
                    // prefix={"ignite.com/"}
                    placeholder="seu-usuario"
                    className="px-4 py-3 bg-zinc-900 text-sm text-white outline-none rounded-md focus:ring-1 ring-emerald-500"
                />

                <button
                    disabled={isSubmitting}
                    type="submit"
                    className="rounded-md bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center text-sm gap-2 py-3 font-medium p-6"
                >
                    Reservar
                    <ArrowRight size={16} />
                </button>

            </form>

            <div className='mt-2 text-zinc-500 text-xs'>
                {errors.username
                    ? errors.username.message
                    : 'Digite o nome do usuário desejado.'}
            </div>
        </>
    )
}