'use client'

import { Calendar } from "@/components/Calendar";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useState } from "react";

interface Availability {
    possibleTimes: number[]
    availableTimes: number[]
}

interface CalendarStepProps {
    onSelectDateTime: (date: Date) => void
}

export function CalendarStep({ onSelectDateTime }: CalendarStepProps) {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)

    const isDateSelected = !!selectedDate

    const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null
    const describedDate = selectedDate ? dayjs(selectedDate).format('DD[ de ]MMMM') : null

    const { username } = useParams()

    const selectedDateWithoutTime = selectedDate ? dayjs(selectedDate).format('YYYY-MM-DD') : null

    const { data: availability } = useQuery<Availability>(['availability', selectedDateWithoutTime], async () => {
        const response = await api.get(`/users/${username}/availability`, {
            params: {
                date: selectedDateWithoutTime
            }
        })

        return response.data
    }, {
        enabled: !!selectedDate
    })

    function handleSelectTime(hour: number) {
        const dateWithTime = dayjs(selectedDate).set('hour', hour).startOf('hour').toDate()

        onSelectDateTime(dateWithTime)
    }

    return (
        <div className={`mt-6 mx-auto grid max-w-full relative ${isDateSelected ? 'lg:grid-cols-calendar-layout grid-cols-1' : 'w-[540px] grid-cols-1'}`}>
            <Calendar selectedDate={selectedDate} onDateSelected={setSelectedDate} />

            {isDateSelected && (
                <div className="bg-zinc-800 border border-zinc-700 pt-6 px-6 overflow-y-scroll absolute top-0 bottom-0 right-0 w-[280px]">
                    <p className="font-medium ">
                        {weekDay} <span className="text-zinc-400">{describedDate}</span>
                    </p>

                    <div className="mt-3 grid lg:grid-cols-1 gap-2 grid-cols-2 last:mb-6">
                        {availability?.possibleTimes.map(hour => {
                            return (
                                <button
                                    key={hour}
                                    onClick={() => handleSelectTime(hour)}
                                    disabled={!availability.availableTimes.includes(hour)}
                                    className="bg-zinc-700 py-2 cursor-pointer text-zinc-100 rounded-md text-sm disabled:bg-none disabled:cursor-not-allowed disabled:opacity-40 hover:enabled:bg-zinc-600"
                                >
                                    {String(hour).padStart(2, '0')}:00h
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}