import {
    Appointment,
    AppointmentParticipant,
    Group,
    Patient,
    Practitioner,
    Schedule,
    Slot,
} from "@medplum/fhirtypes"

import { MedplumLink } from "@medplum/react"
import React from "react"

export type Person = Patient | Practitioner
export type AppointmentType = "regular" | "video-call"
export function getName(person: Person): string {
    const firstName: string = person.name?.[0]?.given?.join(" ") || ""
    const lastName: string = person.name?.[0]?.family || ""
    return (firstName + " " + lastName).trim()
}
export interface INextDate {
    endTime: string
    id: string | undefined
    diffToNow?: number
}

export function checkIsVideoCall(appointment: Appointment): boolean {
    const isVideoCall: boolean = !!appointment?.extension?.find(
        (entry) => entry.url === "video-call-join-url"
    )
    return isVideoCall
}
export function getIdFromReference(reference: string) {
    return reference.split("/")[1]
}

export function getEmail(person: Person): string | undefined {
    return person.telecom?.find((el) => el.system === "email")?.value
}

export function getPhone(person: Person): string | undefined {
    return person.telecom?.find((el) => el.system === "phone")?.value
}

export function searchPersons(persons: Person[], searchTerm: string) {
    return persons.filter((p) => {
        if (!p.name) return false
        return getName(p).toLowerCase().includes(searchTerm.toLowerCase())
    })
}

export function getPatientFromAppointment(
    appointment: Appointment,
    patients: Patient[]
): Patient | undefined {
    const participant: AppointmentParticipant | undefined =
        appointment?.participant?.find(
            (p) => p.actor?.reference?.split("/")[0] === "Patient"
        )
    if (!participant) return
    const patientId: string = participant.actor?.reference?.split("/")[1] || ""
    const patient: Patient = patients.find((p) => p.id! === patientId)!
    return patient
}

export function getPractitionerFromAppointment(
    appointment: Appointment,
    practitioners: Practitioner[]
): Practitioner | undefined {
    const participant: AppointmentParticipant | undefined =
        appointment?.participant?.find(
            (p) => p.actor?.reference?.split("/")[0] === "Practitioner"
        )
    if (!participant) return
    const practitionerId: string =
        participant.actor?.reference?.split("/")[1] || ""
    const practitioner: Practitioner = practitioners.find(
        (p) => p.id! === practitionerId
    )!
    return practitioner
}

export function getNextDate(dateObjects: INextDate[]): INextDate | undefined {
    const getDiffToNow = (endTime: string): number => {
        return new Date(endTime).valueOf() - new Date().valueOf()
    }
    if (dateObjects.length === 0) {
        return
    }
    const futureDates: INextDate[] = dateObjects
        .map((entry) => ({
            endTime: new Date(entry.endTime).toDateString(),
            diffToNow: getDiffToNow(entry.endTime),
            id: entry.id,
        }))
        .filter((obj) => obj.diffToNow >= 0)
    const smallestDiffToNow: number = Math.min(
        ...futureDates.map((obj) => obj.diffToNow!)
    )
    const nextDateArr: INextDate[] = futureDates.filter(
        (obj) => obj.diffToNow === smallestDiffToNow
    )
    return nextDateArr.length > 0 ? nextDateArr[0] : undefined
}

export function getNextAppointmentDateAndId(
    appointments: Appointment[],
    personId: string
): INextDate {
    const appointmentsOfPerson: Appointment[] = getAppointmentsOfPerson(
        personId,
        appointments
    )
    const dateObjects: INextDate[] = appointmentsOfPerson.map(
        (appointment) => ({
            endTime: appointment.end || "",
            id: appointment.id,
        })
    )
    const nextDate: INextDate = getNextDate(dateObjects) || ({} as INextDate)
    return nextDate
}

// export function getPractitionerIdsOfOrganization(
//   practitionerRoles: PractitionerRole[],
//   organizationId: string,
// ): string[] | null {
//   if (!organizationId) return null;
//   const practitionerIds: (string|undefined)[] = practitionerRoles
//     .filter(role => role.organization?.reference?.split('/')[1] === organizationId)
//     .map(role => role.practitioner?.reference?.split('/')[1])
//     .filter(id => id);
//   return practitionerIds as string[];
// }

// export function filterPatientsByOrganization(patients: Patient[], selectedOrganization: Organization | null): Patient[] {
//   return patients.filter(p => {
//     if (!selectedOrganization) return true;
//     const orgIds: (string|undefined)[] | undefined = p.generalPractitioner
//     ?.map(pr => pr?.reference?.split('/')?.[1]);
//     if (!orgIds || orgIds.length === 0) {
//       return false;
//     } else {
//       return orgIds.find(orgId => orgId === selectedOrganization?.id);
//     }
//   });
// }

// export function getOrganizationFromPractitionerRole(
//   practitionerRole: PractitionerRole,
//   organizations: Organization[],
// ): Organization | undefined {
//   const orgId: string | undefined = getIdFromReference(practitionerRole ? practitionerRole.organization!.reference! : '');
//   const organization: Organization | undefined = organizations.find(org => org.id === orgId);
//   return organization;
// }

// export function getPractitionerFromPractitionerRole(
//   practitionerRole: PractitionerRole,
//   practitioners: Practitioner[],
// ): Practitioner | undefined {
//   const practitionerId: string | undefined = getIdFromReference(practitionerRole ? practitionerRole.practitioner!.reference! : '');
//   const practitioner: Practitioner | undefined = practitioners.find(org => org.id === practitionerId);
//   return practitioner;
// }

// export function getOrganizationFromPractitioner(
//   practitioner: Practitioner,
//   practitionerRoles: PractitionerRole[],
//   organizations: Organization[]
// ): Organization | null {
//   const practitionerRole: PractitionerRole = practitionerRoles
//     .find(role => getIdFromReference(role.practitioner!.reference!) === practitioner.id)!;
//   const organization: Organization | null = getOrganizationFromPractitionerRole(practitionerRole, organizations) || null;
//   return organization;
// }

// export function getPractitionerRoleFromOrganizationAndPractitioner(
//   practitionerRoles: PractitionerRole[],
//   selectedOrganization: Organization | null,
//   selectedPractitioner: Practitioner | undefined,
// ): PractitionerRole | undefined {
//   if (!selectedOrganization || !selectedPractitioner) return;
//   return practitionerRoles.find(role => {
//     const matchesPractitioner: boolean = getIdFromReference(role.practitioner!.reference!) === selectedPractitioner.id;
//     const matchesOrganization: boolean = getIdFromReference(role.organization!.reference!) === selectedOrganization.id;
//     return matchesPractitioner && matchesOrganization;
//   });
// }

export function getScheduleFromPractitioner(
    practitioner: Practitioner | undefined,
    schedules: Schedule[]
): Schedule | undefined {
    if (!practitioner) return
    const selectedSchedule: Schedule | undefined = schedules.find(
        (schedule) => {
            return schedule.actor
                .find((entity) => {
                    if (entity.type !== "Practitioner") return
                    return (
                        getIdFromReference(entity.reference!) ===
                        practitioner.id
                    )
                })
                ?.reference!.split("/")[1]
        }
    )
    return selectedSchedule
}

// export function getScheduleFromOrganizationAndPractitioner(
//   practitionerRoles: PractitionerRole[],
//   schedules: Schedule[],
//   selectedPractitioner: Practitioner | undefined,
// ): Schedule | undefined {
//   // const selectedPractitionerRole: PractitionerRole | undefined = getPractitionerRoleFromOrganizationAndPractitioner(
//   //   practitionerRoles,
//   //   selectedOrganization,
//   //   selectedPractitioner,
//   // );
//   const selectedSchedule: Schedule | undefined = getScheduleFromPractitioner(selectedPractitioner, schedules);
//   return selectedSchedule;
// }

export function getSlotsFromPractitioner(
    practitioner: Practitioner,
    schedules: Schedule[],
    slots: Slot[]
): Slot[] {
    const schedule: Schedule | undefined = getScheduleFromPractitioner(
        practitioner,
        schedules
    )
    if (!schedule) return []
    const filteredSlots: Slot[] = slots.filter(
        (slot) => getIdFromReference(slot.schedule.reference!) === schedule.id
    )
    return filteredSlots
}

export function getAppointmentsOfPerson(
    personId: string,
    appointments: Appointment[]
) {
    const appointmentsOfPerson: Appointment[] = appointments.filter(
        (appointment) => {
            const participantIds: string[] = appointment.participant
                ?.map((p) => p.actor?.reference?.split("/")[1])
                .filter((id) => id)
            return participantIds.includes(personId)
        }
    )
    return appointmentsOfPerson
}

export function filterAppointmentsOfCalendar(
    appointments: Appointment[],
    status: Appointment["status"][],
    appointmentType: AppointmentType | null,
    practitionerId?: string,
    patientId?: string
): Appointment[] {
    // const practitionerIdsOfOrganization: string[] | null = organizationId
    //   ? getPractitionerIdsOfOrganization(practitionerRoles, organizationId)
    //   : null;
    // const filteredAppointments: Appointment[] = [];
    // if (organizationId) {
    //   practitionerIdsOfOrganization!.forEach(practitionerId => {
    //     const appointmentsOfPractitioner: Appointment[] = getAppointmentsOfPerson(practitionerId, appointments);
    //     appointmentsOfPractitioner.forEach(a => {
    //       if (!filteredAppointments.map(entry => entry.id).includes(a.id)) {
    //         filteredAppointments.push(a);
    //       }
    //     });
    //   });
    // }
    // const appointmentsFilteredByOrganization: Appointment[] = organizationId ? filteredAppointments : appointments;
    const appointmentsFilteredByPractitioner: Appointment[] = practitionerId
        ? getAppointmentsOfPerson(practitionerId, appointments)
        : appointments
    const appointmentsFilteredByPatient: Appointment[] = patientId
        ? getAppointmentsOfPerson(patientId, appointmentsFilteredByPractitioner)
        : appointmentsFilteredByPractitioner
    return appointmentsFilteredByPatient
        .filter((a) => (status.length > 0 ? status.includes(a.status) : true))
        .filter((a) => {
            if (!appointmentType) return true
            const isVideoCall: boolean = checkIsVideoCall(a)
            return appointmentType === "video-call" ? isVideoCall : !isVideoCall
        })
}

// export function filterPractitionersByOrganization(
//   practitioners: Practitioner[],
//   practitionerRoles: PractitionerRole[],
//   organizationId: string,
// ): Practitioner[] {
//   if (!organizationId) return practitioners;
//   const practitionerIds: (string|undefined)[] = practitionerRoles
//     .filter(role => role.organization?.reference?.split('/')[1] === organizationId)
//     .map(role => role.practitioner?.reference?.split('/')[1]);
//   return practitioners
//     .filter(pr => practitionerIds.includes(pr.id));
// }

export function getPractitionerFromSlot(
    slot: Slot,
    schedules: Schedule[],
    practitioners: Practitioner[]
): Practitioner | undefined {
    const schedule: Schedule = schedules.find(
        (s) => s.id! === getIdFromReference(slot.schedule.reference!)
    )!
    const practitioner: Practitioner | undefined = practitioners.find((pr) => {
        const practitionerId: string | undefined = schedule?.actor
            ?.find((entry) => entry.type === "Practitioner")
            ?.reference?.split("/")[1]
        return pr.id! === practitionerId
    })
    return practitioner
}

export function renderGroupNames(groups: Group[], patientId: string) {
    return groups
        .filter(
            (group) =>
                group.actual &&
                group.member?.find(
                    (m) => getIdFromReference(m.entity.reference!) === patientId
                )
        )
        .map((group) => {
            return (
                <div>
                    <MedplumLink key={group.id} to={`/Group/${group.id}`}>
                        {group.name}
                    </MedplumLink>
                </div>
            )
        })
}
