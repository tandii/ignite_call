import { MultiStep } from "@/components/MultiStep";
import { Metadata } from "next";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = {
    title: 'Crie uma conta | ignite Call'
}

export default function Register() {
    return (
        <div className="max-w-[572px] my-20 mx-auto mb-4 px-4">
            <div className="px-6">
                <strong className="leading-relaxed text-2xl">
                    Bem-vindo ao Ignite Call!
                </strong>

                <p className="text-zinc-400 mb-6">
                    Precisamos de algumas informações para criar seu perfil! Ah, você pode editar essas informações depois.
                </p>

                <MultiStep size={4} currentStep={1} />
            </div>

            <RegisterForm />
        </div>
    )
}