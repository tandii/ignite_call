'use client'

import { ConfirmStep } from "./ConfirmStep";
import { CalendarStep } from "./CalendarStep";
import { useState } from "react";

export function ScheduleForm() {
    const [selectdDateTime, setSelectedDateTime] = useState<Date | null>()

    function handleClearSelectedDateTime() {
        setSelectedDateTime(null)
    }

    if (selectdDateTime) {
        return <ConfirmStep schedulingDate={selectdDateTime} onCancelConfirmation={handleClearSelectedDateTime} />
    }

    return (
        <CalendarStep onSelectDateTime={setSelectedDateTime} />
    )
}