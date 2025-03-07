export enum TabName {
    MedicalHistory = "MedicalHistory",
    Observation = "Observation",
    Immunization = "Immunization",
    DiagnosticReport = "DiagnosticReport",
    CareTeam = "CareTeam",
    Insurance = "Insurance",
}

export enum AppointmentStatus {
    Arrived = "arrived",
    Booked = "booked",
    Cancelled = "cancelled",
    CheckedIn = "checked-in",
    EnteredInError = "entered-in-error",
    Fulfilled = "fulfilled",
    NoShow = "noshow",
    Pending = "pending",
    Proposed = "proposed",
    Waitlist = "waitlist",
}

export enum Studies {
    Studies = "studies",
    Eligibility = "eligibility-checker",
    Qualified = "qualified-patients",
}

export enum TrialsConsentStatus {
    Recruiting = "recruiting",
    NotYetRecruiting = "not-yet-recruiting",
    Completed = "completed",
}

export enum ConsentCode {
    Privacy = "57016-8",
    Treatment = "64293-4",
    Research = "77602-1",
    Care = "45473-6",
}

export enum Gender {
    Male = "male",
    Female = "female",
    Other = "other",
    Unknown = "unknown",
}
