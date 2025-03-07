import { Dispatch, SetStateAction } from "react"
import { AppointmentType } from "../../types/types"
import { ComboboxItem, Select } from "@mantine/core"
import React from "react"

interface Props {
    appointmentType: AppointmentType | null
    setAppointmentType: Dispatch<SetStateAction<AppointmentType | null>>
}

export default function SelectAppointmentType({
    appointmentType,
    setAppointmentType,
}: Props) {
    const data: ComboboxItem[] = [
        { label: "Regular", value: "regular" },
        { label: "Video Call", value: "video-call" },
    ]

    return (
        <Select
            label="Select type of appointment"
            placeholder="Appointment type"
            data={data}
            value={appointmentType}
            onChange={(newValue) =>
                setAppointmentType(newValue as AppointmentType | null)
            }
        />
    )
}
