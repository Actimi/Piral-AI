import { Appointment, Slot } from "@medplum/fhirtypes"
import { notifications } from "@mantine/notifications"
import { getAppointmentsOfPerson } from "./tables"
import { IconCheck, IconExclamationCircleFilled } from "@tabler/icons-react"

import React from "react"

export function stringToDateValue(dateString: string): number {
    return new Date(dateString).valueOf()
}

export function showSuccessMessage(message: string, title?: string) {
    notifications.show({
        title,
        message,
        color: "#7958D2",
        icon: React.createElement(IconCheck),
        position: "top-right",
        autoClose: 2000,
    })
}

export function showErrorMessage(message: string) {
    notifications.show({
        message,
        color: "red",
        icon: React.createElement(IconExclamationCircleFilled),
        position: "top-right",
        autoClose: 2000,
    })
}

export function checkStartBeforeEnd(start: string, end: string): boolean {
    return stringToDateValue(start) < stringToDateValue(end)
}

export function checkNoConflictingSlot(
    slots: Slot[],
    newSlot: { start: string; end: string },
    currentSlotId?: string
): boolean {
    const noConflictingSlot = slots.every((s) => {
        // skips slot if the slot that is checked is the one to be updated
        if (s.id === currentSlotId) return true
        return (
            (stringToDateValue(s.start!) >= stringToDateValue(newSlot.start!) &&
                stringToDateValue(s.start!) >=
                    stringToDateValue(newSlot.end!)) ||
            (stringToDateValue(s.end!) <= stringToDateValue(newSlot.start!) &&
                stringToDateValue(s.end!) <= stringToDateValue(newSlot.end!))
        )
    })
    return noConflictingSlot
}

export function checkNoConflictingAppointment(
    appointments: Appointment[],
    newAppointment: { start: string; end: string },
    currentAppointmentId?: string
): boolean {
    const noConflictingAppointment = appointments.every((a) => {
        // skips appointment if the appointment that is checked is the one to be updated
        if (a.id === currentAppointmentId) return true
        return (
            (stringToDateValue(a.start!) >=
                stringToDateValue(newAppointment.start!) &&
                stringToDateValue(a.start!) >=
                    stringToDateValue(newAppointment.end!)) ||
            (stringToDateValue(a.end!) <=
                stringToDateValue(newAppointment.start!) &&
                stringToDateValue(a.end!) <=
                    stringToDateValue(newAppointment.end!))
        )
    })
    return noConflictingAppointment
}

export function checkAppointmentInsideSlot(
    slots: Slot[],
    newAppointment: { start: string; end: string }
) {
    const appointmentInsideSlot = slots.some((s) => {
        return (
            stringToDateValue(newAppointment.start!) >=
                stringToDateValue(s.start!) &&
            stringToDateValue(newAppointment.start!) <=
                stringToDateValue(s.end!) &&
            stringToDateValue(newAppointment.end!) >=
                stringToDateValue(s.start!) &&
            stringToDateValue(newAppointment.end!) <= stringToDateValue(s.end!)
        )
    })
    return appointmentInsideSlot
}

export function checkAppointmentsVideoCall(
    participantIds: string[],
    appointments: Appointment[],
    newAppointment: { start: string; end: string }
): boolean {
    return participantIds.every((id) => {
        const appointmentsOfPerson: Appointment[] = getAppointmentsOfPerson(
            id,
            appointments
        )
        return checkNoConflictingAppointment(
            appointmentsOfPerson,
            newAppointment
        )
    })
}
