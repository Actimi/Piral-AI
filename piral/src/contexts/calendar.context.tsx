import React, {
    createContext,
    PropsWithChildren,
    useCallback,
    useEffect,
    useState,
} from "react"
import { ICalendarContext } from "../types/interfaces"
import {
    Appointment,
    Patient,
    Practitioner,
    ResourceType,
    Schedule,
    Slot,
} from "@medplum/fhirtypes"
import { useMedplum } from "@medplum/react"
import { useReadyToFetch } from "../hooks/useCheckReadyToFetch"

export const CalendarContext = createContext<ICalendarContext | null>(null)

export function CalendarProviderWrapper({ children }: PropsWithChildren) {
    const [selectedPractitioner, setSelectedPractitioner] =
        useState<Practitioner>()
    const [selectedPatient, setSelectedPatient] = useState<Patient>()
    const medplum = useMedplum()
    const readyToFetch = useReadyToFetch()
    const [patients, setPatients] = useState<Patient[]>([])
    const [practitioners, setPractitioners] = useState<Practitioner[]>([])
    const [schedules, setSchedules] = useState<Schedule[]>([])
    const [slots, setSlots] = useState<Slot[]>([])
    const [appointments, setAppointments] = useState<Appointment[]>([])

    const fetchCalendarData = useCallback(
        (resourceType: ResourceType) => {
            if (!readyToFetch) return
            switch (resourceType) {
                case "Patient":
                    medplum
                        .searchResources("Patient", { _count: 200 })
                        .then((data) => setPatients(data))
                        .catch((err) =>
                            console.error(
                                "Error while fetching data of all patients: ",
                                err
                            )
                        )
                    break
                case "Practitioner":
                    medplum
                        .searchResources("Practitioner", { _count: 200 })
                        .then((data) => setPractitioners(data))
                        .catch((err) =>
                            console.error(
                                "Error while fetching data of all practitioners: ",
                                err
                            )
                        )
                    break
                case "Schedule":
                    medplum
                        .searchResources("Schedule", { _count: 200 })
                        .then((data) => setSchedules(data))
                        .catch((err) =>
                            console.error(
                                "Error while fetching schedules: ",
                                err
                            )
                        )
                    break
                case "Slot":
                    medplum
                        .searchResources("Slot", { _count: 200 })
                        .then((data) => setSlots(data))
                        .catch((err) =>
                            console.error("Error while fetching slots: ", err)
                        )
                    break
                case "Appointment":
                    medplum
                        .searchResources("Appointment", { _count: 200 })
                        .then((data) => setAppointments(data))
                        .catch((err) =>
                            console.error(
                                "Error while fetching appointments: ",
                                err
                            )
                        )
                    break
            }
        },
        [medplum, readyToFetch]
    )

    useEffect(() => {
        fetchCalendarData("Patient")
        fetchCalendarData("Practitioner")
        fetchCalendarData("Schedule")
        fetchCalendarData("Slot")
        fetchCalendarData("Appointment")
    }, [fetchCalendarData])

    return (
        <CalendarContext.Provider
            value={{
                selectedPractitioner,
                selectedPatient,
                setSelectedPractitioner,
                setSelectedPatient,
                patients,
                setPatients,
                practitioners,
                setPractitioners,
                slots,
                setSlots,
                schedules,
                setSchedules,
                appointments,
                setAppointments,
                fetchCalendarData,
            }}
        >
            {children}
        </CalendarContext.Provider>
    )
}
