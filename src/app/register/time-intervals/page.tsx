import { MultiStep } from "@/components/MultiStep";
import { Metadata } from "next";
import TimeIntervalsForm from "./TimeIntervalsForm";

export const metadata: Metadata = {
    title: 'Selecione sua disponibilidade | ignite Call',
    robots: {
        index: false
    }
}

export default function TimeIntervals() {
    return (
        <div className="max-w-[572px] my-20 mx-auto mb-4 px-4">
            <div className="px-6">
                <strong className="leading-relaxed text-2xl">
                    Quase lá
                </strong>

                <p className="text-zinc-400 mb-6">
                    Defina o intervalo de horários que você está disponível em cada dia da semana.
                </p>

                <MultiStep size={4} currentStep={3} />
            </div>

            <TimeIntervalsForm />
        </div>
    )
}