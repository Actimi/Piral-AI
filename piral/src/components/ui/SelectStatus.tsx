import { Appointment } from "@medplum/fhirtypes"
import { Dispatch, SetStateAction } from "react"
import { AppointmentStatus } from "../../types/enums"
import { ComboboxItem, MultiSelect } from "@mantine/core"
import { getStatusString } from "../../utils/helpers"
import React from "react"

interface Props {
    status: Appointment["status"][]
    setStatus: Dispatch<SetStateAction<Appointment["status"][]>>
}

const data: ComboboxItem[] = []
for (const key in AppointmentStatus) {
    data.push({
        label: getStatusString(AppointmentStatus[key]),
        value: AppointmentStatus[key],
    })
}

export default function SelectStatus({ status, setStatus }: Props) {
    return (
        <MultiSelect
            label="Select status of appointment"
            placeholder={status.length === 0 ? "Status" : ""}
            style={{ maxWidth: 250 }}
            data={data}
            value={status}
            onChange={(value) => setStatus(value as Appointment["status"][])}
        />
    )
}
