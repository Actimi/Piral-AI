import { Modal, Stack, Table } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { Patient } from "@medplum/fhirtypes"
import { MedplumLink } from "@medplum/react"
import React, { useContext, useState } from "react"
import { DataContext } from "../../contexts/data.context"
import { IDataContext } from "../../types/interfaces"
import { PatientType } from "../../types/types"
import { getIdFromReference } from "../../utils/helpers"
import { getName, getNextAppointmentDateAndId } from "../../utils/tables"
import AppointmentForm from "../forms/AppointmentForm"
import TaskForm from "../forms/TaskForm"
import ContactTableEntry from "../ui/ContactTableEntry"
import CustomTable from "../ui/CustomTable"
import { IconWithLabel } from "../ui/IconWithLabel"
import TableEmptyMessage from "../ui/TableEmptyMessage"
import TableMoreButton from "../ui/TableMoreButton"
import { TableNextAppointment } from "../ui/TableNextAppointment"

interface Props {
    patientType: PatientType
    searchTerm: string
}

export default function PatientsTable({}: Props) {
    const [opened, { open, close }] = useDisclosure(false)
    const { patients, groups, appointments } = useContext(
        DataContext
    ) as IDataContext
    const [currentPatient, setCurrentPatient] = useState<Patient>()
    const [formType, setFormType] = useState<"appointment" | "task">()

    const renderGroupNames = (patientId: string) => {
        return groups
            .filter((group) =>
                group.member?.find(
                    (m) => getIdFromReference(m.entity.reference!) === patientId
                )
            )
            .map((group) => {
                return (
                    <MedplumLink key={group.id} to={`/Group/${group.id}`}>
                        {group.name}
                    </MedplumLink>
                )
            })
    }

    const renderPatients = () => {
        return patients.slice(0, 10).map((patient) => {
            const { id: appointmentId, endTime } = getNextAppointmentDateAndId(
                appointments,
                patient.id!
            )
            return (
                <Table.Tr key={patient.id}>
                    <Table.Td>
                        <MedplumLink to={"/Patients/" + patient.id}>
                            <IconWithLabel
                                label={
                                    patient.name ? getName(patient) : "no name"
                                }
                            />
                        </MedplumLink>
                    </Table.Td>
                    <Table.Td>
                        <ContactTableEntry entry={patient} />
                    </Table.Td>

                    <Table.Td>
                        <TableNextAppointment
                            appointmentId={appointmentId || ""}
                            dateOfNextAppointment={endTime}
                        />
                    </Table.Td>
                    <Table.Td>
                        <Stack style={{ gap: "0px" }}>
                            {renderGroupNames(patient.id!)}
                        </Stack>
                    </Table.Td>
                    <Table.Td>
                        <TableMoreButton
                            resourceType="Patient"
                            id={patient.id!}
                            extraItems={[
                                {
                                    buttonText: "Make Appointment",
                                    handleClick: () => {
                                        setCurrentPatient(patient)
                                        setFormType("appointment")
                                        open()
                                    },
                                },
                                {
                                    buttonText: "Create Task",
                                    handleClick: () => {
                                        setCurrentPatient(patient)
                                        setFormType("task")
                                        open()
                                    },
                                },
                            ]}
                        />
                    </Table.Td>
                </Table.Tr>
            )
        })
    }

    return (
        <>
            {patients.length === 0 ? (
                <TableEmptyMessage resourceType="Patient" selected />
            ) : (
                <CustomTable>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Name</Table.Th>
                            <Table.Th>Contact</Table.Th>

                            <Table.Th pl={25}> Appointment</Table.Th>
                            <Table.Th>Patient Groups</Table.Th>
                            <Table.Th>Action</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{renderPatients()}</Table.Tbody>
                </CustomTable>
            )}

            <Modal
                opened={opened}
                onClose={close}
                centered
                withCloseButton={false}
            >
                {formType === "appointment" ? (
                    <AppointmentForm
                        close={close}
                        preSelectedPatient={currentPatient}
                    />
                ) : (
                    <TaskForm
                        close={close}
                        preSelectedPatient={currentPatient}
                    />
                )}
            </Modal>
        </>
    )
}
