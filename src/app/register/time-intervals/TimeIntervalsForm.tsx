'use client'

import * as SelectPrimitive from '@radix-ui/react-select';
import { api } from "@/lib/axios";
import { convertTimeStringToMinutes } from "@/utils/convert-time-string-to-minutes";
import { getWeekDays } from "@/utils/get-week-days";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Checkbox from '@radix-ui/react-checkbox';
import { ArrowDown, ArrowRight, ArrowUp, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const timeIntervalsFormSchema = z.object({
    intervals: z.array(z.object({
        weekDay: z.number().min(0).max(6),
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string()
    }))
        .length(7)
        .transform(intervals => intervals.filter(interval => interval.enabled))
        .refine(intervals => intervals.length > 0, {
            message: 'Você precisa selecionar pelo menos um dia da semana.'
        })
        .transform(intervals => {
            return intervals.map(interval => {
                return {
                    weekDay: interval.weekDay,
                    startTimeInMinutes: convertTimeStringToMinutes(interval.startTime),
                    endTimeInMinutes: convertTimeStringToMinutes(interval.endTime),
                }
            })
        })
        .refine(intervals => {
            return intervals.every(interval => interval.endTimeInMinutes - 60 >= interval.startTimeInMinutes)
        }, {
            message: 'O horário de término deve ser pelo menos 1h distante do início.'
        })
})

type TimeIntervalsFormInput = z.input<typeof timeIntervalsFormSchema>
type TimeIntervalsFormOutput = z.output<typeof timeIntervalsFormSchema>

export default function TimeIntervalsForm() {
    const { register, handleSubmit, watch, control, formState: { errors, isSubmitting } } = useForm<TimeIntervalsFormInput, unknown, TimeIntervalsFormOutput>({
        resolver: zodResolver(timeIntervalsFormSchema),
        defaultValues: {
            intervals: [
                { weekDay: 0, enabled: false, startTime: '08:00', endTime: '18:00' },
                { weekDay: 1, enabled: true, startTime: '08:00', endTime: '18:00' },
                { weekDay: 2, enabled: true, startTime: '08:00', endTime: '18:00' },
                { weekDay: 3, enabled: true, startTime: '08:00', endTime: '18:00' },
                { weekDay: 4, enabled: true, startTime: '08:00', endTime: '18:00' },
                { weekDay: 5, enabled: true, startTime: '08:00', endTime: '18:00' },
                { weekDay: 6, enabled: false, startTime: '08:00', endTime: '18:00' },
            ]
        }
    })

    const weekDays = getWeekDays()

    const { fields } = useFieldArray({
        control,
        name: 'intervals'
    })

    const intervals = watch('intervals')

    const router = useRouter()

    async function handleSetTimeIntervals(data: TimeIntervalsFormOutput) {
        console.log(data)
        // const { intervals } = data
        // await api.post('/users/time-intervals', {
        //     intervals
        // })

        // router.push('/register/update-profile')
    }

    return (
        <form onSubmit={handleSubmit(handleSetTimeIntervals)} className="mt-6 flex flex-col bg-zinc-800 border border-zinc-700 p-6 rounded-md">
            <div className="border border-zinc-700 rounded-md mb-4 divide-y divide-zinc-700">
                {fields.map((field, index) => {
                    return (
                        <div key={field.id} className="flex items-center justify-between py-3 px-4 ">
                            <div className="flex items-center gap-3">
                                <Controller
                                    name={`intervals.${index}.enabled`}
                                    control={control}
                                    render={({ field }) => (
                                        <Checkbox.Root
                                            className="w-6 h-6 data-[state=checked]:bg-emerald-500 bg-zinc-900 rounded flex items-center justify-center"
                                            checked={field.value}
                                            onCheckedChange={(checked) => {
                                                field.onChange(checked === true)
                                            }}
                                        >
                                            <Checkbox.Indicator>
                                                <Check size={16} />
                                            </Checkbox.Indicator>
                                        </Checkbox.Root>
                                    )}
                                />
                                <p>
                                    {weekDays[field.weekDay]}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Controller
                                    name={`intervals.${index}.startTime`}
                                    control={control}
                                    defaultValue={`intervals.${index}.startTime`}
                                    render={({ field }) => (
                                        <SelectPrimitive.Root {...field} value={field.value} onValueChange={field.onChange} disabled={intervals[index].enabled === false}  >
                                            <SelectPrimitive.Trigger asChild >
                                                <button className="flex items-center w-fit pl-4 pr-3 py-[10px] text-sm rounded gap-3 bg-zinc-900 text-zinc-100 outline-none focus:ring-1 ring-emerald-500 disabled:bg-zinc-900/40 disabled:text-zinc-100/40 disabled:cursor-not-allowed">
                                                    <SelectPrimitive.Value />
                                                    <SelectPrimitive.Icon>
                                                        <ArrowDown size={18} className='stroke-[1.5]' />
                                                    </SelectPrimitive.Icon>
                                                </button>
                                            </SelectPrimitive.Trigger>
                                            <SelectPrimitive.Portal>
                                                <SelectPrimitive.Content>
                                                    <SelectPrimitive.ScrollUpButton className="flex items-center justify-center text-zinc-50 mb-1">
                                                        <ArrowUp size={18} className='stroke-[1.5]' />
                                                    </SelectPrimitive.ScrollUpButton>
                                                    <SelectPrimitive.Viewport className="bg-zinc-800 p-2 rounded-lg shadow-lg">
                                                        <SelectPrimitive.Group className='space-y-1'>
                                                            {["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"].map(
                                                                (hour, i) => (
                                                                    <SelectPrimitive.Item
                                                                        key={`${hour}-${i}`}
                                                                        value={hour}
                                                                        className="relative data-[disabled]:hover:bg-zinc-800 data-[disabled]:line-through flex items-center px-8 py-2 rounded-md text-sm text-zinc-100 bg-zinc-800 hover:bg-zinc-700 "
                                                                    >
                                                                        <SelectPrimitive.ItemText>{hour}</SelectPrimitive.ItemText>
                                                                        <SelectPrimitive.ItemIndicator className="absolute left-2 inline-flex items-center">
                                                                            <Check size={18} className='stroke-[1.5]' />
                                                                        </SelectPrimitive.ItemIndicator>
                                                                    </SelectPrimitive.Item>
                                                                )
                                                            )}
                                                        </SelectPrimitive.Group>
                                                    </SelectPrimitive.Viewport>
                                                    <SelectPrimitive.ScrollDownButton className="flex items-center justify-center text-zinc-50 mt-1">
                                                        <ArrowDown size={18} className='stroke-[1.5]' />
                                                    </SelectPrimitive.ScrollDownButton>
                                                </SelectPrimitive.Content>
                                            </SelectPrimitive.Portal>
                                        </SelectPrimitive.Root>
                                    )}
                                />
                                <Controller
                                    name={`intervals.${index}.endTime`}
                                    control={control}
                                    defaultValue={`intervals.${index}.endTime`}
                                    render={({ field }) => (
                                        <SelectPrimitive.Root {...field} value={field.value} onValueChange={field.onChange} disabled={intervals[index].enabled === false} >
                                            <SelectPrimitive.Trigger asChild >
                                                <button className="flex items-center w-fit pl-4 pr-3 py-[10px] text-sm rounded gap-3 bg-zinc-900 text-zinc-100 outline-none focus:ring-1 ring-emerald-500 disabled:bg-zinc-900/40 disabled:text-zinc-100/40 disabled:cursor-not-allowed">
                                                    <SelectPrimitive.Value />
                                                    <SelectPrimitive.Icon>
                                                        <ArrowDown size={18} className='stroke-[1.5]' />
                                                    </SelectPrimitive.Icon>
                                                </button>
                                            </SelectPrimitive.Trigger>
                                            <SelectPrimitive.Portal>
                                                <SelectPrimitive.Content>
                                                    <SelectPrimitive.ScrollUpButton className="flex items-center justify-center text-zinc-50 mb-1">
                                                        <ArrowUp size={18} className='stroke-[1.5]' />
                                                    </SelectPrimitive.ScrollUpButton>
                                                    <SelectPrimitive.Viewport className="bg-zinc-800 p-2 rounded-lg shadow-lg">
                                                        <SelectPrimitive.Group className='space-y-1'>
                                                            {["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"].map(
                                                                (hour, i) => (
                                                                    <SelectPrimitive.Item
                                                                        key={`${hour}-${i}`}
                                                                        value={hour}
                                                                        className="relative data-[disabled]:hover:bg-zinc-800 data-[disabled]:line-through flex items-center px-8 py-2 rounded-md text-sm text-zinc-100 bg-zinc-800 hover:bg-zinc-700"
                                                                    >
                                                                        <SelectPrimitive.ItemText>{hour}</SelectPrimitive.ItemText>
                                                                        <SelectPrimitive.ItemIndicator className="absolute left-2 inline-flex items-center">
                                                                            <Check size={18} className='stroke-[1.5]' />
                                                                        </SelectPrimitive.ItemIndicator>
                                                                    </SelectPrimitive.Item>
                                                                )
                                                            )}
                                                        </SelectPrimitive.Group>
                                                    </SelectPrimitive.Viewport>
                                                    <SelectPrimitive.ScrollDownButton className="flex items-center justify-center text-zinc-50 mt-1">
                                                        <ArrowDown size={18} className='stroke-[1.5]' />
                                                    </SelectPrimitive.ScrollDownButton>
                                                </SelectPrimitive.Content>
                                            </SelectPrimitive.Portal>
                                        </SelectPrimitive.Root>
                                    )}
                                />
                                {/* <input
                                    type="time"
                                    step="3600"
                                    disabled={intervals[index].enabled === false}
                                    className="bg-zinc-900 focus:outline-none rounded-md text-sm py-2 px-3 disabled:bg-zinc-900/40 disabled:text-zinc-100/40"
                                    {...register(`intervals.${index}.startTime`)}
                                />
                                <input
                                    type="time"
                                    step="3600"
                                    disabled={intervals[index].enabled === false}
                                    className="bg-zinc-900 focus:outline-none rounded-md text-sm py-2 px-3 disabled:bg-zinc-900/40 disabled:text-zinc-100/40"
                                    {...register(`intervals.${index}.endTime`)}
                                /> */}
                            </div>
                        </div>
                    )
                })}
            </div>

            {errors.intervals && (
                <p className="text-xs text-red-400 mb-4">
                    {errors.intervals.root?.message}
                </p>
            )}

            <button
                disabled={isSubmitting}
                type="submit"
                className="rounded-md bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center text-sm gap-2 py-3 font-medium disabled:bg-zinc-400 disabled:cursor-not-allowed"
            >
                Próximo passo
                <ArrowRight size={16} />
            </button>
        </form>
    )
}