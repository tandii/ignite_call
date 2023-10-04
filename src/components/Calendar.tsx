'use client'

import { api } from "@/lib/axios";
import { getWeekDays } from "@/utils/get-week-days";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

interface CalendarWeek {
    week: number
    days: Array<{
        date: dayjs.Dayjs
        disabled: boolean
    }>
}

type CalendarWeeks = CalendarWeek[]

interface BlockedDates {
    blockedWeekDays: number[]
    blockedDates: number[]
}

interface CalendarProps {
    selectedDate?: Date | null
    onDateSelected: (date: Date) => void
}

export function Calendar({ selectedDate, onDateSelected }: CalendarProps) {
    const [currentDate, setCurrentDate] = useState(() => {
        return dayjs().set('date', 1)
    })

    function handlePreviousMonth() {
        const previousMonthDate = currentDate.subtract(1, 'month')

        setCurrentDate(previousMonthDate)
    }

    function handleNextMonth() {
        const nextMonthDate = currentDate.add(1, 'month')

        setCurrentDate(nextMonthDate)
    }

    const { username } = useParams()

    const shortWeekDays = getWeekDays({ short: true })

    const currentMonth = currentDate.format('MMMM')
    const currentYear = currentDate.format('YYYY')

    const { data: blockedDates } = useQuery<BlockedDates>(['blocked-dates', currentDate.get('year'), currentDate.get('month')], async () => {
        const response = await api.get(`/users/${username}/blocked-dates`, {
            params: {
                year: currentDate.get('year'),
                month: currentDate.get('month') + 1
            }
        })

        return response.data
    })

    const calendarWeeks = useMemo(() => {
        if (!blockedDates) {
            return []
        }

        const daysInMonthArray = Array.from({
            length: currentDate.daysInMonth()
        }).map((_, i) => {
            return currentDate.set('date', i + 1)
        })

        const firstWeekDay = currentDate.get('day')

        const previousMonthFillArray = Array.from({
            length: firstWeekDay
        }).map((_, i) => {
            return currentDate.subtract(i + 1, 'day')
        }).reverse()

        const lastDayInCurrentMonth = currentDate.set('date', currentDate.daysInMonth())
        const lastWeekDay = lastDayInCurrentMonth.get('day')

        const nextMonthFillArray = Array.from({
            length: 7 - (lastWeekDay + 1)
        }).map((_, i) => {
            return lastDayInCurrentMonth.add(i + 1, 'day')
        })

        const calendarDays = [
            ...previousMonthFillArray.map((date) => {
                return { date, disabled: true }
            }),
            ...daysInMonthArray.map((date) => {
                return {
                    date, disabled: date.endOf('day').isBefore(new Date()) ||
                        blockedDates.blockedWeekDays.includes(date.get('day')) ||
                        blockedDates.blockedDates.includes(date.get('date'))
                }
            }),
            ...nextMonthFillArray.map((date) => {
                return { date, disabled: true }
            })
        ]

        const calendarWeeks = calendarDays.reduce<CalendarWeeks>((weeks, _, i, original) => {
            const isNewWeek = i % 7 === 0

            if (isNewWeek) {
                weeks.push({
                    week: i / 7 + 1,
                    days: original.slice(i, i + 7)
                })
            }

            return weeks
        }, [])

        return calendarWeeks
    }, [blockedDates, currentDate])

    return (
        <div className={`flex flex-col bg-zinc-800 border border-zinc-700 p-6 gap-6 ${selectedDate ? 'rounded-s-md border-r-0' : 'rounded-md'}`}>
            <div className="flex items-center justify-between">
                <p className="font-medium capitalize">
                    {currentMonth} <span className="text-gray-400">{currentYear}</span>
                </p>

                <div className="flex gap-2">
                    <button
                        className="text-zinc-400 cursor-pointer rounded-sm hover:text-zinc-100"
                        onClick={handlePreviousMonth}
                        title="Previous month"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        className="text-zinc-400 cursor-pointer rounded-sm hover:text-zinc-100"
                        onClick={handleNextMonth}
                        title="Next month"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <table className="w-full border-spacing-1 border-separate table-fixed">
                <thead className="text-gray-200 font-medium text-sm">
                    <tr>
                        {shortWeekDays.map(weekDay => (
                            <th className="text-gray-200 font-medium text-sm" key={weekDay}>{weekDay}.</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="before:content-['.'] before:leading-3 before:block before:text-zinc-800 box-border">
                    {calendarWeeks.map(({ week, days }) => {
                        return (
                            <tr key={week}>
                                {days.map(({ date, disabled }) => {
                                    return (
                                        <td key={date.toString()}>
                                            <button
                                                onClick={() => onDateSelected(date.toDate())}
                                                disabled={disabled}
                                                className="w-full bg-zinc-700 aspect-square rounded-md text-center cursor-pointer disabled:bg-none disabled:cursor-default disabled:opacity-40 hover:bg-zinc-600 focus:ring-2 focus:ring-zinc-200 focus:outline-none"
                                            >
                                                {date.get('date')}
                                            </button>
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}