import React, {
    createContext,
    PropsWithChildren,
    useCallback,
    useEffect,
    useState,
} from "react"
import { IDataContext } from "../types/interfaces"
import {
    Appointment,
    Composition,
    Consent,
    DocumentReference,
    Group,
    Invoice,
    Observation,
    Patient,
    Practitioner,
    Procedure,
    ResearchStudy,
    ResearchSubject,
    Schedule,
    Slot,
    Task,
} from "@medplum/fhirtypes"
import { useMedplumContext } from "@medplum/react"

export const DataContext = createContext<IDataContext | null>(null)

export function DataProviderWrapper({ children }: PropsWithChildren) {
    const { medplum, profile } = useMedplumContext()

    const [patients, setPatients] = useState<Patient[]>([])
    const [practitioners, setPractitioners] = useState<Practitioner[]>([])
    const [schedules, setSchedules] = useState<Schedule[]>([])
    const [groups, setGroups] = useState<Group[]>([])
    const [slots, setSlots] = useState<Slot[]>([])
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [invoices, setInvoices] = useState<Invoice[]>([])
    const [documentReferences, setDocumentReferences] = useState<
        DocumentReference[]
    >([])
    const [tasks, setTasks] = useState<Task[]>([])
    const [procedures, setProcedures] = useState<Procedure[]>([])
    const [compositions, setCompositions] = useState<Composition[]>([])
    const [researchStudies, setResearchStudies] = useState<ResearchStudy[]>([])
    const [researchSubjects, setResearchSubjects] = useState<ResearchSubject[]>(
        []
    )
    const [observations, setObservations] = useState<Observation[]>([])
    const [consents, setConsents] = useState<Consent[]>([])

    const checkReadyToFetch = useCallback(() => {
        return medplum && profile
    }, [medplum, profile])

    useEffect(() => {
        if (!checkReadyToFetch()) return
        medplum
            .searchResources("Patient", { _count: 200 })
            .then((data) => setPatients(data))
            .catch((err) =>
                console.error(
                    "Error while fetching data of all patients: ",
                    err
                )
            )
    }, [checkReadyToFetch, medplum])

    useEffect(() => {
        if (!checkReadyToFetch()) return
        medplum
            .searchResources("Practitioner", { _count: 200 })
            .then((data) => setPractitioners(data))
            .catch((err) =>
                console.error(
                    "Error while fetching data of all practitioners: ",
                    err
                )
            )
    }, [checkReadyToFetch, medplum])

    useEffect(() => {
        if (!checkReadyToFetch()) return
        medplum
            .searchResources("Schedule", { _count: 200 })
            .then((data) => setSchedules(data))
            .catch((err) =>
                console.error("Error while fetching schedules: ", err)
            )
    }, [checkReadyToFetch, medplum])

    useEffect(() => {
        if (!checkReadyToFetch()) return
        medplum
            .searchResources("Group", { _count: 200 })
            .then((data) => setGroups(data))
            .catch((err) => console.error("Error while fetching groups: ", err))
    }, [checkReadyToFetch, medplum])

    useEffect(() => {
        if (!checkReadyToFetch()) return
        medplum
            .searchResources("Slot", { _count: 200 })
            .then((data) => setSlots(data))
            .catch((err) => console.error("Error while fetching slots: ", err))
    }, [checkReadyToFetch, medplum])

    useEffect(() => {
        if (!checkReadyToFetch()) return
        medplum
            .searchResources("Appointment", { _count: 200 })
            .then((data) => setAppointments(data))
            .catch((err) =>
                console.error("Error while fetching appointments: ", err)
            )
    }, [checkReadyToFetch, medplum])

    useEffect(() => {
        if (!checkReadyToFetch()) return
        medplum
            .searchResources("Invoice", { _count: 200 })
            .then((data) => setInvoices(data))
            .catch((err) =>
                console.error("Error while fetching invoices: ", err)
            )
    }, [checkReadyToFetch, medplum])

    useEffect(() => {
        if (!checkReadyToFetch()) return
        medplum
            .searchResources("DocumentReference", {
                _sort: "-date",
                _count: 200,
            })
            .then((data) => setDocumentReferences(data))
            .catch((err) =>
                console.error("Error while fetching document references: ", err)
            )
    }, [checkReadyToFetch, medplum])

    useEffect(() => {
        if (!checkReadyToFetch()) return
        medplum
            .searchResources("Task", { _count: 200 })
            .then((data) => setTasks(data))
            .catch((err) => console.error("Error while fetching tasks: ", err))
    }, [checkReadyToFetch, medplum])

    useEffect(() => {
        if (!checkReadyToFetch()) return
        medplum
            .searchResources("Procedure", { _count: 200 })
            .then((data) => setProcedures(data))
            .catch((err) =>
                console.error("Error while fetching procedure: ", err)
            )
    }, [checkReadyToFetch, medplum])

    useEffect(() => {
        if (!checkReadyToFetch()) return
        medplum
            .searchResources("Composition", { _count: 200 })
            .then((data) => setCompositions(data))
            .catch((err) =>
                console.error("Error while fetching compositions: ", err)
            )
    }, [checkReadyToFetch, medplum])

    useEffect(() => {
        if (!checkReadyToFetch()) return
        medplum
            .searchResources("ResearchStudy", { _count: 200 })
            .then((data) => setResearchStudies(data))
            .catch((err) =>
                console.error("Error while fetching research studies: ", err)
            )
    }, [checkReadyToFetch, medplum])

    useEffect(() => {
        if (!checkReadyToFetch()) return
        medplum
            .searchResources("ResearchSubject", { _count: 200 })
            .then((data) => setResearchSubjects(data))
            .catch((err) =>
                console.error("Error while fetching research subjects: ", err)
            )
    }, [checkReadyToFetch, medplum])

    useEffect(() => {
        if (!checkReadyToFetch()) return
        medplum
            .searchResources("Observation", { _count: 200 })
            .then((data) => setObservations(data))
            .catch((err) =>
                console.error("Error while fetching observations: ", err)
            )
    }, [checkReadyToFetch, medplum])

    useEffect(() => {
        if (!checkReadyToFetch()) return
        medplum
            .searchResources("Consent", { _count: 200 })
            .then((data) => setConsents(data))
            .catch((err) =>
                console.error("Error while fetching consents: ", err)
            )
    }, [checkReadyToFetch, medplum])

    return (
        <DataContext.Provider
            value={{
                patients,
                setPatients,
                practitioners,
                setPractitioners,
                schedules,
                setSchedules,
                groups,
                setGroups,
                slots,
                setSlots,
                appointments,
                setAppointments,
                invoices,
                setInvoices,
                documentReferences,
                setDocumentReferences,
                tasks,
                setTasks,
                procedures,
                setProcedures,
                compositions,
                setCompositions,
                researchStudies,
                setResearchStudies,
                researchSubjects,
                setResearchSubjects,
                observations,
                setObservations,
                consents,
                setConsents,
            }}
        >
            {children}
        </DataContext.Provider>
    )
}
