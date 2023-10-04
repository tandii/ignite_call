
import { MultiStep } from "@/components/MultiStep";
import { ArrowRight, Check } from 'lucide-react'
import { Metadata } from "next";
import { useSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation";
import ConnectCalendarGoogle from "./ConnectCalendarGoogle";

export const metadata: Metadata = {
    title: 'Conecte sua agenda do Google | ignite Call',
    robots: {
        index: false
    }
}

export default function ConnectCalendar() {
    return (
        <div className="max-w-[572px] my-20 mx-auto mb-4 px-4">
            <div className="px-6">
                <strong className="leading-relaxed text-2xl">
                    Conecte sua agenda!
                </strong>

                <p className="text-zinc-400 mb-6">
                    Conecte o seu calendário para verificar automaticamente as horas ocupadas e os novos eventos à medida em que são agendados.
                </p>

                <MultiStep size={4} currentStep={2} />
            </div>

            <ConnectCalendarGoogle />
        </div>
    )
}