'use client'

import dayjs from "dayjs";

import 'dayjs/locale/pt-br'

dayjs.locale('pt-br')

export function DayjsConfig({ children }: {
    children: React.ReactNode
}) {
    return (
        <>
            {children}
        </>
    )
}