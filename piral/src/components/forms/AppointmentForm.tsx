import {
    Button,
    Center,
    Checkbox,
    Group,
    Stack,
    Text,
    Textarea,
    Tooltip,
} from "@mantine/core"
import { useForm } from "@mantine/form"
import { DateTimeInput, useMedplumContext } from "@medplum/react"
import { useContext, useEffect, useState } from "react"
import { Appointment, Patient, Practitioner, Slot } from "@medplum/fhirtypes"
import {
    checkAppointmentInsideSlot,
    checkNoConflictingAppointment,
    showErrorMessage,
    showSuccessMessage,
} from "../../utils/validation"
import { stringToDateValue } from "../../utils/helpers"
import {
    getAppointmentsOfPerson,
    getPatientFromAppointment,
    getPractitionerFromAppointment,
    getSlotsFromPractitioner,
} from "../../utils/tables"
import { ICalendarContext } from "../../types/interfaces"
import SearchableDropdown from "../ui/SearchableDropdown"
import DeleteAppointmentButton from "../ui/DeleteAppointmentButton"
import { CalendarContext } from "../../contexts/calendar.context"
import React from "react"

interface Props {
    close: () => void
    appointmentId?: string
    preSelectedPractitioner?: Practitioner
    preSelectedPatient?: Patient
}

interface IAppointmentFormValues {
    start: string
    end: string
}

export default function AppointmentForm({
    close,
    appointmentId,
    preSelectedPractitioner,
    preSelectedPatient,
}: Props) {
    const { medplum } = useMedplumContext()
    const {
        patients,
        practitioners,
        slots,
        schedules,
        appointments,
        fetchCalendarData,
    } = useContext(CalendarContext) as ICalendarContext
    const currentAppointment: Appointment | undefined = appointmentId
        ? appointments?.find((s) => s.id === appointmentId)
        : undefined
    const [practitioner, setPractitioner] = useState<Practitioner | undefined>(
        preSelectedPractitioner
    )
    const [patient, setPatient] = useState<Patient | undefined>(
        preSelectedPatient
    )
    const [description, setDescription] = useState<string>("")
    const [checkSchedule, setCheckSchedule] = useState<boolean>(false)

    const form = useForm<IAppointmentFormValues>({
        mode: "uncontrolled",
        initialValues: {
            start: currentAppointment?.start || "",
            end: currentAppointment?.end || "",
        },
    })

    const createAppointment = async (
        values: IAppointmentFormValues
    ): Promise<Appointment> => {
        const newAppointment: Appointment =
            await medplum.createResource<Appointment>({
                resourceType: "Appointment",
                start: values.start,
                end: values.end,
                status: "booked",
                description,
                participant: [
                    {
                        status: "accepted",
                        actor: {
                            reference: "Patient/" + patient?.id,
                        },
                    },
                    {
                        status: "accepted",
                        actor: {
                            reference: `Practitioner/${practitioner?.id}`,
                        },
                    },
                ],
            })
        return newAppointment
    }

    const handleSubmit = (values: IAppointmentFormValues) => {
        if (!patient) {
            showErrorMessage("Please select a patient.")
            return
        } else if (!practitioner) {
            showErrorMessage("Please select a practitioner.")
            return
        }

        const filteredSlots: Slot[] = checkSchedule
            ? getSlotsFromPractitioner(practitioner, schedules, slots)
            : []
        const appointmentsOfPractitioner: Appointment[] =
            getAppointmentsOfPerson(practitioner.id!, appointments)
        const appointmentsOfPatient: Appointment[] = getAppointmentsOfPerson(
            patient.id!,
            appointments
        )

        if (filteredSlots.length === 0 && checkSchedule) {
            showErrorMessage(
                "There are no time slots to which you could assign an appointment for the selected practitioner. Please create a slot first."
            )
        } else if (!values.start) {
            showErrorMessage("Please select a start date")
        } else if (!values.end) {
            showErrorMessage("Please select an end date")
        } else if (stringToDateValue(values.start) < new Date().valueOf()) {
            showErrorMessage("The start date cannot be in the past.")
        } else if (stringToDateValue(values.end) < new Date().valueOf()) {
            showErrorMessage("The end date cannot be in the past.")
        } else if (
            stringToDateValue(values.start) >= stringToDateValue(values.end)
        ) {
            showErrorMessage("The start time must be before the end time.")
        } else if (
            !checkNoConflictingAppointment(
                appointmentsOfPractitioner,
                values,
                currentAppointment?.id
            )
        ) {
            showErrorMessage(
                "The appointment conflicts with another appointment of the selected practitioner. Please change the start or end time."
            )
        } else if (
            !checkNoConflictingAppointment(
                appointmentsOfPatient,
                values,
                currentAppointment?.id
            )
        ) {
            showErrorMessage(
                "The appointment conflicts with another appointment of the selected patient. Please change the start or end time."
            )
        } else if (
            checkSchedule &&
            !checkAppointmentInsideSlot(filteredSlots, values)
        ) {
            showErrorMessage(
                "The appointment is not inside an available time slot. Please change the start or end time."
            )
        } else if (appointmentId && currentAppointment) {
            medplum
                .updateResource<Appointment>({
                    ...currentAppointment,
                    start: values.start,
                    end: values.end,
                    description,
                    status: "booked",
                    participant: [
                        {
                            status: "accepted",
                            actor: {
                                reference: `Patient/${patient.id}`,
                            },
                        },
                        {
                            status: "accepted",
                            actor: {
                                reference: `Practitioner/${practitioner.id}`,
                            },
                        },
                    ],
                })
                .then(() => {
                    fetchCalendarData("Appointment")
                    showSuccessMessage("Appointment updated.")
                    close()
                })
                .catch((err) => {
                    console.error(
                        `Error while updating appointment with id ${appointmentId}: `,
                        err
                    )
                    showErrorMessage("Failed to update appointment.")
                })
        } else {
            createAppointment({ ...values })
                .then(() => {
                    fetchCalendarData("Appointment")
                    showSuccessMessage("Appointment added.")
                    close()
                })
                .catch((err) => {
                    console.error("Error while creating new appointment: ", err)
                    showErrorMessage("Failed to add appointment.")
                })
        }
    }

    useEffect(() => {
        if (
            !currentAppointment ||
            patients.length === 0 ||
            practitioners.length === 0
        )
            return
        setDescription(currentAppointment.description || "")
        setPatient(getPatientFromAppointment(currentAppointment, patients))
        const foundPractitioner: Practitioner | undefined =
            getPractitionerFromAppointment(currentAppointment, practitioners)
        setPractitioner(foundPractitioner)
    }, [currentAppointment, patients, practitioners])

    if (patients.length === 0) {
        return (
            <Center>
                <Text>
                    There are currently no patients for which you could book an
                    appointment.
                </Text>
            </Center>
        )
    }
    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
                <Tooltip label="Make an appointment with a patient. Appointments can only be booked within time slots.">
                    <Group>
                        <Text size="xl">Appointment</Text>
                    </Group>
                </Tooltip>
                <Group>
                    <SearchableDropdown
                        resourceType="Patient"
                        patients={patients}
                        selectedPatient={patient}
                        setSelectedPatient={setPatient}
                        allowAll={false}
                        required
                    />
                    <SearchableDropdown
                        resourceType="Practitioner"
                        practitioners={practitioners}
                        selectedPractitioner={practitioner}
                        setSelectedPractitioner={setPractitioner}
                        allowAll={false}
                        required
                    />
                </Group>
                <Group>
                    <DateTimeInput
                        label="Start"
                        key={form.key("start")}
                        name="start"
                        {...form.getInputProps("start")}
                        required
                    />
                    <DateTimeInput
                        label="End"
                        key={form.key("end")}
                        name="end"
                        {...form.getInputProps("end")}
                        required
                    />
                </Group>
                <Group>
                    <Textarea
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Group>
                <Group>
                    <Tooltip
                        position="right"
                        label="Make appointment only if it fits to the schedule of the practitioner."
                    >
                        <Checkbox
                            label="Check schedule of practitioner"
                            labelPosition="right"
                            checked={checkSchedule}
                            onChange={() => setCheckSchedule((prev) => !prev)}
                        />
                    </Tooltip>
                </Group>
                <Group>
                    <Button type="submit">
                        {appointmentId ? "Update" : "Add"}
                    </Button>
                    {appointmentId && (
                        <DeleteAppointmentButton
                            appointmentId={appointmentId}
                            close={close}
                        />
                    )}
                </Group>
            </Stack>
        </form>
    )
}
