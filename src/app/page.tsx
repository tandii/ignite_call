import Image from 'next/image'

import previewImage from '../assets/app-preview.png'
import { ClaimUsernameForm } from '@/app/ClaimUsernameForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Descomplique sua agenda | ignite Call',
  description: 'Conecte  seu calendário e permita que as pessoas marquem agendamentos no seu tempo livre.',
}

export default function Home() {
  return (
    <div className='flex items-center gap-20 ml-auto max-w-[calc(100vw-(100vw-1160px)/2)] h-screen'>
      <div className='max-w-[480px] px-10'>
        <h1 className='text-5xl sm:text-6xl font-extrabold'>
          Agendamento descomplicado
        </h1>

        <p className='mt-2 text-zinc-400 text-xl'>
          Conecte seu calendário e permita que as pessoas marquem agendamentos no seu tempo livre.
        </p>

        <ClaimUsernameForm />
      </div>

      <div className='pr-8 overflow-hidden sm:visible invisible'>
        <Image
          src={previewImage}
          height={400}
          quality={100}
          priority
          alt='Calendário simbolizando aplicação em funcionamento'
        />
      </div>
    </div>
  )
}
