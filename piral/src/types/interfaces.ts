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
    Questionnaire,
    QuestionnaireResponse,
    ResearchStudy,
    ResearchSubject,
    ResourceType,
    Schedule,
    Slot,
    Task,
} from "@medplum/fhirtypes"
import {
    Dispatch,
    MouseEventHandler,
    ReactElement,
    SetStateAction,
} from "react"

export interface IDataContext {
    patients: Patient[]
    setPatients: Dispatch<SetStateAction<Patient[]>>
    practitioners: Practitioner[]
    setPractitioners: Dispatch<SetStateAction<Practitioner[]>>
    schedules: Schedule[]
    setSchedules: Dispatch<SetStateAction<Schedule[]>>
    groups: Group[]
    setGroups: Dispatch<SetStateAction<Group[]>>
    slots: Slot[]
    setSlots: Dispatch<SetStateAction<Slot[]>>
    appointments: Appointment[]
    setAppointments: Dispatch<SetStateAction<Appointment[]>>
    invoices: Invoice[]
    setInvoices: Dispatch<SetStateAction<Invoice[]>>
    documentReferences: DocumentReference[]
    setDocumentReferences: Dispatch<SetStateAction<DocumentReference[]>>
    tasks: Task[]
    setTasks: Dispatch<SetStateAction<Task[]>>
    procedures: Procedure[]
    setProcedures: Dispatch<SetStateAction<Procedure[]>>
    compositions: Composition[]
    setCompositions: Dispatch<SetStateAction<Composition[]>>
    researchStudies: ResearchStudy[]
    setResearchStudies: Dispatch<SetStateAction<ResearchStudy[]>>
    researchSubjects: ResearchSubject[]
    setResearchSubjects: Dispatch<SetStateAction<ResearchSubject[]>>
    observations: Observation[]
    setObservations: Dispatch<SetStateAction<Observation[]>>
    consents: Consent[]
    setConsents: Dispatch<SetStateAction<Consent[]>>
}

export interface ICalendarContext {
    selectedPractitioner: Practitioner | undefined
    selectedPatient: Patient | undefined
    setSelectedPractitioner: Dispatch<SetStateAction<Practitioner | undefined>>
    setSelectedPatient: Dispatch<SetStateAction<Patient | undefined>>
    patients: Patient[]
    setPatients: Dispatch<SetStateAction<Patient[]>>
    practitioners: Practitioner[]
    setPractitioners: Dispatch<SetStateAction<Practitioner[]>>
    schedules: Schedule[]
    setSchedules: Dispatch<SetStateAction<Schedule[]>>
    slots: Slot[]
    setSlots: Dispatch<SetStateAction<Slot[]>>
    appointments: Appointment[]
    setAppointments: Dispatch<SetStateAction<Appointment[]>>
    fetchCalendarData: (resourceType: ResourceType) => void
}

export interface INextDate {
    endTime: string
    id: string | undefined
    diffToNow?: number
}

export interface ICombinedQuestionnaireData {
    response: QuestionnaireResponse
    questionnaire: Questionnaire | null
}

export interface ICriteriaResult {
    criteria: string
    type: "Inclusion" | "Exclusion"
    patientValue: string
    criteriaMet: boolean
    reasoning: string
}

export interface ICards {
    ImageSrc: string
    text: string
    subText: string
    counts: number
    routeTo: string
    bg: string
    progressHighlight: string
    progressBg: string
    isCheckCard: boolean
    comparisonPercentage: number
    featuredValues: string[]
}

export interface IEligibilityTableData {
    criteria: string
    requiredValue: string
    patientValue: string
    criteriaMet: boolean
}

export interface ITableValue {
    columnName: string
    value: string | ReactElement
    searchValue: string | null
    sortValue: string | null
}

export interface ITableColumn {
    columnName: string
    columnValues: {
        id: string
        value: string | ReactElement
        searchValue?: string
        sortValue?: string
    }[]
    sortable: boolean
}

export interface ITableRow {
    values: ITableValue[]
    id: string
}

export interface IExtraItem {
    buttonText: string
    handleClick: MouseEventHandler<HTMLButtonElement>
}
