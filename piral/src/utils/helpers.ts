import { formatDate, MedplumClient } from "@medplum/core"
import {
    Appointment,
    CareTeam,
    CodeableConcept,
    Composition,
    HumanName,
    Observation,
    Resource,
} from "@medplum/fhirtypes"
import { getName, Person } from "./tables"

export const NUM_ITEMS_ON_PAGE: number = 10

export function capitalize(word: string): string {
    return word[0]?.toUpperCase() + word.slice(1)
}

export function getIdFromReference(reference: string) {
    return reference.split("/")[1]
}

export function stringToDateValue(dateString: string): number {
    return new Date(dateString).valueOf()
}

export function format(
    dateInput: Date | string,
    options: Intl.DateTimeFormatOptions = {
        month: "short",
        day: "2-digit",
        year: "numeric",
    }
): string {
    let dateString: string

    if (dateInput instanceof Date) {
        dateString = dateInput.toISOString()
    } else if (typeof dateInput === "string") {
        dateString = dateInput
    } else {
        return ""
    }

    return formatDate(dateString, "en-US", options)
}

export function getFullName(name: HumanName): string {
    if (!name) {
        return ""
    }
    return `${name.given?.join(" ") || ""} ${name.family || ""}`.trim()
}

export function getPersonItems(persons: Person[]) {
    return persons.map((p) => ({ label: getName(p), value: p.id! }))
}

export function checkIsVideoCall(appointment: Appointment): boolean {
    const isVideoCall: boolean = !!appointment?.extension?.find(
        (entry) => entry.url === "video-call-join-url"
    )
    return isVideoCall
}

export function checkContainsSearchTerm(
    value: string,
    searchTerm: string
): boolean {
    return value.toLowerCase().includes(searchTerm.toLowerCase())
}

export function getNamesOfCallParticipants(appointment: Appointment) {
    const names = appointment.participant
        ?.map((p) => p.actor?.display)
        .filter((name) => name)
    return names
}

export function getDateAndTime(dateString: string): string {
    const date: Date = new Date(dateString)
    return date.toString()
}

export function getAuthHeaders(medplum: MedplumClient) {
    const authHeaders = {
        Authorization: "Bearer " + medplum.getAccessToken(),
    }
    return authHeaders
}

export function getCodeFromCodeableConcept(
    codeableConcept?: CodeableConcept
): string | undefined {
    return codeableConcept?.coding?.[0]?.code
}

export function getStatusString(status: string): string {
    const arr = status.split("-")
    arr.splice(0, 1, capitalize(arr[0]))
    return arr.join(" ")
}

export function getPaginationSlice<T>(arr: T[], page: number): T[] {
    return arr.slice((page - 1) * NUM_ITEMS_ON_PAGE, page * NUM_ITEMS_ON_PAGE)
}

export function convertDateIntoDay(date: Date) {
    const dateObject = new Date(date)
    return dateObject
        .toLocaleDateString("en-US", { weekday: "long" })
        .slice(0, 3)
}

export function getPage(offset: number): number {
    return Math.floor((offset ?? 0) / 10) + 1
}

export function getTotalPages(offset: number, lastResult: Resource[]): number {
    const pageSize = 10
    const total = getTotal(lastResult)
    return Math.ceil(total / pageSize)
}

export function getTotal(lastResult: Resource[]): number {
    const total: number = lastResult.length
    return total
}

export const mapEntry = (
    item: Resource,
    fields: Record<string, (item: Resource) => unknown>
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mappedItem: Record<string, any> = { id: item.id! }
    for (const [key, fn] of Object.entries(fields)) {
        mappedItem[key] = fn(item) || "-"
    }
    return mappedItem
}

export function getObservationValue(observation: Observation): string {
    if (observation.valueString) {
        return observation.valueString
    } else if (typeof observation.valueBoolean === "boolean") {
        return observation.valueBoolean ? "Yes" : "No"
    } else if (observation.valueCodeableConcept) {
        return (
            observation.valueCodeableConcept.text ||
            observation.valueCodeableConcept.coding?.[0]?.display ||
            "-"
        )
    } else if (observation.valueQuantity) {
        return [
            observation.valueQuantity.value,
            observation.valueQuantity.unit,
        ].join(" ")
    } else {
        return "-"
    }
}

export function getCareTeamMembers(
    careTeam: CareTeam,
    memberType: "Patient" | "Practitioner"
): string {
    const teamMembers: string =
        careTeam.participant
            ?.filter((p) => p.member?.reference?.split("/")[0] === memberType)
            .map((p) => p.member?.display)
            .join(", ") || "-"
    return teamMembers
}

export function getAge(birthdayString: string): number {
    let age: number = 0
    const today: Date = new Date()
    const birthday: Date = new Date(birthdayString)
    const yearDiff: number = today.getFullYear() - birthday.getFullYear()
    if (today.getMonth() < birthday.getMonth()) {
        age = yearDiff - 1
    } else if (today.getMonth() > birthday.getMonth()) {
        age = yearDiff
    } else if (today.getMonth() === birthday.getMonth()) {
        if (today.getDate() < birthday.getDate()) {
            age = yearDiff - 1
        } else if (today.getDate() >= birthday.getDate()) {
            age = yearDiff
        }
    }
    return age
}

export function getCompositionStatusLabel(status: Composition["status"]) {
    switch (status) {
        case "preliminary":
            return "Inactive"
        case "final":
            return "Active"
        case "amended":
            return "Draft"
        case "entered-in-error":
            return "Entered in Error"
    }
}
