'use client'

import { api } from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { Calendar, Clock3 } from "lucide-react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const confirmFormSchema = z.object({
    name: z.string().min(3, { message: 'O nome precisa no mínimo de 3 caracteres' }),
    email: z.string().email({ message: 'Digite um email válido' }),
    observations: z.string().nullable()
})

type ConfirmStepData = z.infer<typeof confirmFormSchema>

interface ConfirmStepProps {
    schedulingDate: Date
    onCancelConfirmation: () => void
}

export function ConfirmStep({ schedulingDate, onCancelConfirmation }: ConfirmStepProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<ConfirmStepData>({
        resolver: zodResolver(confirmFormSchema)
    })

    const { username } = useParams()

    async function handleConfirmSchedule(data: ConfirmStepData) {
        const { name, email, observations } = data

        await api.post(`/users/${username}/schedule`, {
            name,
            email,
            observations,
            date: schedulingDate
        })

        onCancelConfirmation()
    }

    const describedDate = dayjs(schedulingDate).format('DD[ de ]MMMM[ de ]YYYY')
    const describedTime = dayjs(schedulingDate).format('HH:mm[h]')

    return (
        <form onSubmit={handleSubmit(handleConfirmSchedule)} className="mt-6 flex flex-col gap-4 bg-zinc-800 max-w-[540px] mx-auto p-6 rounded-md border border-zinc-700">
            <div className="flex gap-4 pb-6 mb-2 border-b border-zinc-700">
                <p className="flex items-center gap-2 ">
                    <Calendar size={20} className="text-zinc-400" />
                    {describedDate}
                </p>
                <p className="flex items-center gap-2 ">
                    <Clock3 size={20} className="text-zinc-400" />
                    {describedTime}
                </p>
            </div>

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

            <label className="flex flex-col gap-2">
                <p className="text-sm">Endereço de email</p>
                <input
                    {...register('email')}
                    className="px-4 py-3 bg-zinc-900 text-sm text-white outline-none rounded-md focus:ring-1 ring-emerald-500"
                    type="email"
                    placeholder="johndoe@example.com"
                />
                {errors.email && (
                    <p className="text-xs text-red-400">{errors.email.message}</p>
                )}
            </label>

            <label className="flex flex-col gap-2">
                <p className="text-sm">Observações</p>
                <textarea
                    {...register('observations')}
                    className="px-4 py-3 bg-zinc-900 text-sm min-h-[80px] text-white outline-none rounded-md focus:ring-1 ring-emerald-500"
                />
            </label>

            <div className="flex justify-end gap-2 mt-2">
                <button
                    type="button"
                    onClick={onCancelConfirmation}
                    disabled={isSubmitting}
                    className="font-medium py-3 px-6 rounded-md text-sm disabled:cursor-not-allowed"
                >
                    Cancelar
                </button>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-md bg-emerald-600 hover:bg-emerald-500 text-sm py-3 px-6 font-medium disabled:bg-zinc-400 disabled:cursor-not-allowed"
                >
                    Confirmar
                </button>
            </div>
        </form>

    )
}