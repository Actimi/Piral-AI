import {
    AllergyIntolerance,
    Appointment,
    Condition,
    Coverage,
    DocumentReference,
    MedicationRequest,
    Patient,
    Practitioner,
    Procedure,
    QuestionnaireResponse,
    ResourceType,
} from "@medplum/fhirtypes"

export type PatientType = "active" | "archived" | "group"
export type Person = Patient | Practitioner
export type AppointmentType = "regular" | "video-call"
export type ResourceWithStatus =
    | Appointment
    | DocumentReference
    | Procedure
    | MedicationRequest

export type PatientMedicalHistoryResource =
    | Appointment
    | DocumentReference
    | Procedure
    | Condition
    | AllergyIntolerance
    | MedicationRequest
    | QuestionnaireResponse
    | Coverage

export type PatientMedicalHistoryResourceType =
    | "Appointment"
    | "DocumentReference"
    | "Procedure"
    | "Condition"
    | "AllergyIntolerance"
    | "MedicationRequest"
    | "QuestionnaireResponse"
    | "Coverage"

export type Status =
    | "accepted"
    | "active"
    | "administratively-completed"
    | "amended"
    | "approved"
    | "arrived"
    | "balanced"
    | "booked"
    | "cancelled"
    | "checked-in"
    | "closed-to-accrual"
    | "closed-to-accrual-and-intervention"
    | "completed"
    | "current"
    | "disapproved"
    | "draft"
    | "entered-in-error"
    | "failed"
    | "final"
    | "fulfilled"
    | "inactive"
    | "incomplete"
    | "in-progress"
    | "in-review"
    | "issued"
    | "noshow"
    | "not-done"
    | "on-hold"
    | "pending"
    | "preliminary"
    | "preparation"
    | "proposed"
    | "ready"
    | "received"
    | "rejected"
    | "requested"
    | "stopped"
    | "superseded"
    | "temporarily-closed-to-accrual"
    | "temporarily-closed-to-accrual-and-intervention"
    | "unknown"
    | "waitlist"
    | "withdrawn"

export const RESOURCE_TYPE_CREATION_PATHS: Partial<
    Record<ResourceType, string>
> = {
    Bot: "/admin/bots/new",
    ClientApplication: "/admin/clients/new",
}

export type ContentType =
    | "blog"
    | "video"
    | "audio"
    | "template"
    | "translation"
export type Language = "de" | "en" | "tr"
