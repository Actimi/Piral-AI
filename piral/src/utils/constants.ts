/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComboboxItem } from "@mantine/core"
import { Composition, Consent, Task } from "@medplum/fhirtypes"
import { Status } from "../types/types"

export const NOW = new Date().valueOf()
export const MINUTE_IN_MILISECONDS = 60 * 1000
export const WEEK_IN_MILISECONDS = 7 * 24 * 60 * 60 * 1000

export const STATUS_COLORS: Record<Status, string> = {
    accepted: "#32CD32",
    active: "#84F384",
    "administratively-completed": "#4d88D6",
    amended: "#4BE4CF",
    approved: "#4d88D6",
    arrived: "#4BE4CF",
    balanced: "#32CD32",
    booked: "#D41AB4",
    cancelled: "#DFE44B",
    "checked-in": "#84F384",
    "closed-to-accrual": "#FF6347",
    "closed-to-accrual-and-intervention": "#FF6347",
    completed: "#4d88D6",
    current: "#4BE4CF",
    disapproved: "#DFE44B",
    draft: "#FFA500",
    "entered-in-error": "#FF6347",
    failed: "#D44B1A",
    final: "#D41AB4",
    fulfilled: "#32CD32",
    inactive: "#A9A9A9",
    incomplete: "#D44B1A",
    "in-progress": "#1A72D4",
    "in-review": "#F1AB18",
    issued: "#D41AB4",
    noshow: "#D44B1A",
    "not-done": "#D44B1A",
    "on-hold": "#F1AB18",
    pending: "#F1AB18",
    preliminary: "#F1AB18",
    preparation: "#F1AB18",
    proposed: "#87CEEB",
    ready: "#44EFBF",
    received: "#44EFE9",
    rejected: "#FF4500",
    requested: "#EF44D1",
    stopped: "#D44B1A",
    superseded: "#D41AB4",
    "temporarily-closed-to-accrual": "#FF6347",
    "temporarily-closed-to-accrual-and-intervention": "#FF6347",
    unknown: "#A9A9A9",
    waitlist: "#F1AB18",
    withdrawn: "#D44B1A",
} as const

export const TASK_STATUS_DATALIST: { label: string; value: Task["status"] }[] =
    [
        { label: "Accepted", value: "accepted" },
        { label: "Cancelled", value: "cancelled" },
        { label: "Completed", value: "completed" },
        { label: "Draft", value: "draft" },
        { label: "Entered in error", value: "entered-in-error" },
        { label: "Failed", value: "failed" },
        { label: "In progress", value: "in-progress" },
        { label: "On hold", value: "on-hold" },
        { label: "Ready", value: "ready" },
        { label: "Received", value: "received" },
        { label: "Rejected", value: "rejected" },
        { label: "Requested", value: "requested" },
    ]

export const NUM_ITEMS_ON_PAGE: number = 10

export const resources = [
    { value: "MedicationRequest", label: "Medications" },
    { value: "Appointment", label: "Appointments" },
    { value: "Encounter", label: "Encounters" },
    { value: "Condition", label: "Conditions" },
    { value: "Immunization", label: "Immunizations" },
    { value: "DiagnosticReport", label: "Diagnostic Reports" },
    { value: "Observation", label: "Observations" },
    { value: "Procedure", label: "Procedures" },
    { value: "AllergyIntolerance", label: "Allergies" },
    { value: "CareTeam", label: "Care Teams" },
    { value: "CarePlan", label: "Care Plans" },
    { value: "FamilyMemberHistory", label: "Family Member History" },
    { value: "Coverage", label: "Coverage" },
]

export interface organisationFormFieldProps {
    organizationName: string
    street: string
    city: string
    pincode: string
    state: string
    phoneNo: string
    countryCode: string
    image: string
    language: string
    plan: string
    licenses: string
    firstName: string
    lastName: string
    email: string
    contactNo: string
    contactCountryCode: string
    ehr: string
    ehrFields: Array<any>
    accountId: string
    locationId: string
    domainName: string
    title: string
    backgroundColor: string
    textColor: string
    buttonColor: string
    brandFavicon: string
    brandLogo: string
    primaryColor: string
    secondaryColor: string
    sidebarColor: string
    defaultTextColor: string
    iconColor: string
}

export const COMPOSITION_STATUS: Composition["status"][] = [
    "preliminary",
    "final",
    "amended",
    "entered-in-error",
]
export const CONSENT_STATUS: Consent["status"][] = [
    "active",
    "draft",
    "entered-in-error",
    "inactive",
    "proposed",
    "rejected",
]

// export const CONSENT_CATEGORY: { label: string; value: ConsentCode }[] = [
// 	{ label: "Privacy Consent", value: ConsentCode.Privacy },
// 	{ label: "Medical Treatment Consent", value: ConsentCode.Treatment },
// 	{ label: "Research Consent", value: ConsentCode.Research },
// 	{ label: "Advance Care Consent", value: ConsentCode.Care },
// ];

export const GENDER: ComboboxItem[] = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
    { label: "Unknown", value: "unknown" },
]

export const CONSENT_CATEGORIES: ComboboxItem[] = [
    { label: "Privacy Policy Acknowledgment Document", value: "57016-8" },
    { label: "Privacy Policy Organization Document", value: "57017-6" },
    { label: "Patient Consent", value: "59284-0" },
    { label: "Release of Information Consent", value: "64292-6" },
]

export const CONSENT_SCOPE: { label: string; value: string }[] = [
    { label: "Advanced Care Directive", value: "adr" },
    { label: "Research", value: "research" },
    { label: "Privacy Consent", value: "patient-privacy" },
    { label: "Treatment", value: "treatment" },
]

export const CONSENT_POLICY_RULE: { label: string; value: string }[] = [
    { label: "Common Rule Informed Consent", value: "cric" },
    {
        label: "Illinois Consent by Minors to Medical Procedures",
        value: "illinois-minor-procedure",
    },
    { label: "HIPAA Authorization", value: "hipaa-auth" },
    { label: "HIPAA Notice of Privacy Practices", value: "hipaa-npp" },
    { label: "HIPAA Restrictions", value: "hipaa-restrictions" },
    { label: "HIPAA Research Authorization", value: "hipaa-research" },
    { label: "HIPAA Self-Pay Restriction", value: "hipaa-self-pay" },
    {
        label: "Michigan MDHHS-5515 Consent to Share Behavioral Health Information for Care Coordination Purposes",
        value: "mdhhs-5515",
    },
    {
        label: "New York State Surgical and Invasive Procedure Protocol",
        value: "nyssipp",
    },
    { label: "VA Form 10-0484", value: "va-10-0484" },
    { label: "VA Form 10-0485", value: "va-10-0485" },
    { label: "VA Form 10-5345", value: "va-10-5345" },
    { label: "VA Form 10-5345a", value: "va-10-5345a" },
    { label: "VA Form 10-5345a-MHV", value: "va-10-5345a-mhv" },
    { label: "VA Form 10-10116", value: "va-10-10116" },
    { label: "VA Form 21-4142", value: "va-21-4142" },
    { label: "SSA Authorization to Disclose", value: "ssa-827" },
    { label: "Michigan Behavior and Mental Health Consent", value: "dch-3927" },
    {
        label: "Squaxin Indian Behavioral Health and HIPAA Consent",
        value: "squaxin",
    },
    { label: "NL LSP Permission", value: "nl-lsp" },
    { label: "AT ELGA Opt-in Consent", value: "at-elga" },
    { label: "HHS NIH HIPAA Research Authorization", value: "nih-hipaa" },
    { label: "NCI Cancer Clinical Trial Consent", value: "nci" },
    {
        label: "NIH Global Rare Disease Patient Registry and Data Repository Consent",
        value: "nih-grdr",
    },
    {
        label: "NIH Authorization for the Release of Medical Information",
        value: "nih-527",
    },
    {
        label: "Population Origins and Ancestry Research Consent",
        value: "ga4gh",
    },
    { label: "CH EPR Consent", value: "ch-epr" },
]

export const CONSENT_TEMPLATE: ComboboxItem[] = [
    {
        label: "Privacy Consent",
        value: "57016-8",
    },
    {
        label: "Release of Information Consent",
        value: "64292-6",
    },
]
