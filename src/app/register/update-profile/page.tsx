import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth/next"

import { MultiStep } from "@/components/MultiStep";
import UpdateProfileForm from "./update-profile-form";
import { Metadata } from "next";

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: 'Atualize seu perfil | ignite Call',
    robots: {
        index: false
    }
}

export default async function UpdateProfile() {
    const session = await getServerSession(authOptions)

    return (
        <div className="max-w-[572px] my-20 mx-auto mb-4 px-4">
            <div className="px-6">
                <strong className="leading-relaxed text-2xl">
                    Bem-vindo ao Ignite Call!
                </strong>

                <p className="text-zinc-400 mb-6">
                    Precisamos de algumas informações para criar seu perfil! Ah, você pode editar essas informações depois.
                </p>

                <MultiStep size={4} currentStep={4} />
            </div>

            <UpdateProfileForm session={session} />
        </div>
    )
}
