'use client'

import { ArrowRight, Check } from 'lucide-react'
import { useSession, signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation";

export default function ConnectCalendarGoogle() {
    const session = useSession()

    const searchParams = useSearchParams()

    const hasAuthError = !!searchParams.get('error')
    const isSignedIn = session.status === 'authenticated'

    async function handleConnectCalendar() {
        await signIn('google')
    }

    const router = useRouter()

    function handleNavigateToNextStep() {
        router.push('/register/time-intervals')
    }

    return (

        <div className="mt-6 flex flex-col gap-3 bg-zinc-800 border border-zinc-700 p-6 rounded-md">
            <div className="flex items-center justify-between border border-zinc-700 py-4 px-6 rounded-md mb-2">
                <p className="font-medium">Google Calendar</p>
                {isSignedIn ? (
                    <button
                        type="submit"
                        className="rounded-md bg-transparent border-2 border-emerald-600 hover:bg-emerald-600 flex items-center justify-center text-sm gap-2 py-3 font-medium px-4 disabled:bg-zinc-400 cursor-not-allowed disabled:border-zinc-400"
                        onClick={() => signIn('google')}
                        disabled
                    >
                        Conectado
                        <Check size={16} />
                    </button>
                ) : (
                    <button
                        type="submit"
                        className="rounded-md bg-transparent border-2 border-emerald-600 hover:bg-emerald-600 flex items-center justify-center text-sm gap-2 py-3 font-medium px-4"
                        onClick={handleConnectCalendar}
                    >
                        Conectar
                        <ArrowRight size={16} />
                    </button>
                )}
            </div>

            {hasAuthError && (
                <p className="text-xs text-red-400 mb-2">
                    Falha ao se conectar ao Google, verifique se você habilitou as permissões de acesso ao Google Calendar.
                </p>
            )}

            <button
                type="submit"
                onClick={handleNavigateToNextStep}
                disabled={!isSignedIn}
                className="rounded-md bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center text-sm gap-2 py-3 font-medium disabled:bg-zinc-400 disabled:cursor-not-allowed"
            >
                Próximo passo
                <ArrowRight size={16} />
            </button>
        </div>
    )
}