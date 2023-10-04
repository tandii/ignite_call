'use client'

import { MultiStep } from "@/components/MultiStep";
import { api } from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { ArrowRight } from 'lucide-react'
import { Metadata } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// export const metadata: Metadata = {
//     title: 'Crie uma conta | ignite Call'
// }

const registerFormSchema = z.object({
    username: z.string()
        .min(3, { message: 'O usuário precisa ter pelo menos 3 letras.' })
        .regex(/^([a-z\\-]+)$/i, {
            message: 'O usuário pode ter apenas letras e hifens.'
        })
        .transform(username => username.toLowerCase()),
    name: z.string()
        .min(3, { message: 'O nome precisa ter pelo menos 3 letras.' })
})

type RegisterFormData = z.infer<typeof registerFormSchema>

export default function RegisterForm() {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerFormSchema)
    })

    const router = useRouter()

    const searchParams = useSearchParams()

    useEffect(() => {
        if (searchParams) {
            setValue('username', String(searchParams.get('username')))
        }
    }, [searchParams, setValue])

    async function handleRegister(data: RegisterFormData) {
        try {
            await api.post('/users', {
                name: data.name,
                username: data.username
            })

            router.push('/register/connect-calendar')
        } catch (error) {
            if (error instanceof AxiosError && error?.response?.data?.message) {
                alert(error?.response?.data?.message)
                return
            }

            console.error(error)
        }
    }

    return (

        <form onSubmit={handleSubmit(handleRegister)} className="mt-6 flex flex-col gap-4 bg-zinc-800 p-6 rounded-md border border-zinc-700">
            <label className="flex flex-col gap-2">
                <p className="text-sm">Nome de usuário</p>
                <input
                    {...register('username')}
                    className="px-4 py-3 bg-zinc-900 text-sm text-white outline-none rounded-md focus:ring-1 ring-emerald-500"
                    type="text"
                    // prefix="ignite.com/"
                    placeholder="seu-usuario"
                />

                {errors.username && (
                    <p className="text-xs text-red-400">{errors.username.message}</p>
                )}
            </label>

            <label className="flex flex-col gap-2">
                <p className="text-sm">Nome completo</p>
                <input
                    {...register('name')}
                    className="px-4 py-3 bg-zinc-900 text-sm text-white outline-none rounded-md focus:ring-1 ring-emerald-500"
                    type="text"
                    placeholder="Seu nome"
                />

                {errors.name && (
                    <p className="text-xs text-red-400">{errors.name.message}</p>
                )}
            </label>

            <button
                disabled={isSubmitting}
                type="submit"
                className="rounded-md bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center text-sm gap-2 py-3 font-medium disabled:bg-zinc-400 disabled:cursor-not-allowed"
            >
                Próximo passo
                <ArrowRight size={16} />
            </button>
        </form>
    )
}