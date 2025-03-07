import { Box, Card, Grid, Group, Text } from "@mantine/core"
import { formatDate, formatDateTime } from "@medplum/core"
import {
    Appointment,
    Consent,
    Patient,
    Group as PatientGroup,
    Practitioner,
    ResourceType,
    Task,
} from "@medplum/fhirtypes"
import { useMedplum, useMedplumNavigate } from "@medplum/react"
import { useCallback, useEffect, useState } from "react"
import { useReadyToFetch } from "../../hooks/useCheckReadyToFetch"
import { ICards, ITableColumn } from "../../types/interfaces"
import { getName, getPatientFromAppointment } from "../../utils/tables"
import TableWithControlsDashBoard from "../tables/TableWithControlsDashBoard"
import FeaturedCards from "./FeaturedCards"
import React from "react"
import practitionerImage from "../../assets/images/dashboard-practitioners.svg"
import patientImage from "../../assets/images/dashboard-patients.svg"
import consentImage from "../../assets/images/dashboard-consents.svg"
import appointmentImage from "../../assets/images/dashboard-appointments.svg"

export function Dashboard(): JSX.Element {
    const medplum = useMedplum()
    const readyToFetch = useReadyToFetch()
    const [patients, setPatients] = useState<Patient[]>([])
    const [tasks, setTasks] = useState<Task[]>([])
    const [practitioners, setPractitioners] = useState<Practitioner[]>([])
    const [groups, setGroups] = useState<PatientGroup[]>([])
    const [consents, setConsents] = useState<Consent[]>([])
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [cardiology, setCardiologist] = useState<number>(0)
    const [dermatology, setDermatology] = useState<number>(0)
    const navigate = useMedplumNavigate()

    const cardsData: ICards[] = [
        {
            ImageSrc: practitionerImage,
            text: "Practitioners",
            subText: "Practitioners",
            counts: practitioners.length,
            routeTo: "/Practitioner",
            bg: "", //"rgba(128,0,128,0.1)",
            progressHighlight: "#9581D4",
            progressBg: "#E2DAFD",
            isCheckCard: true,
            comparisonPercentage: (() => {
                const now = new Date()
                const startOfWeek = new Date(
                    now.setDate(now.getDate() - now.getDay())
                )
                const startOfLastWeek = new Date(startOfWeek)
                startOfLastWeek.setDate(startOfLastWeek.getDate() - 7)

                const practitionersThisWeek = practitioners.filter(
                    (p) => new Date(p.meta?.lastUpdated || "") >= startOfWeek
                ).length
                const practitionersLastWeek = practitioners.filter(
                    (p) =>
                        new Date(p.meta?.lastUpdated || "") >=
                            startOfLastWeek &&
                        new Date(p.meta?.lastUpdated || "") < startOfWeek
                ).length

                if (practitionersLastWeek === 0) return 79
                return Math.round(
                    ((practitionersThisWeek - practitionersLastWeek) /
                        practitionersLastWeek) *
                        100
                )
            })(),
            featuredValues: [
                `${cardiology} Cardiologist`,
                `${dermatology} Oncology`,
                // practitioners.filter((c) => c.gender === "male").length + " Male",
                // practitioners.filter((c) => c.gender === "female").length + " Female",
            ],
        },
        {
            ImageSrc: patientImage,
            text: "Patients",
            subText: "Patients",
            counts: patients.length,
            routeTo: "/Patient",
            bg: "", //"rgba(0,0,255,0.1)",
            progressHighlight: "#82A4D4",
            progressBg: "#D7E6FB",
            isCheckCard: true,
            comparisonPercentage: (() => {
                const now = new Date()
                const startOfWeek = new Date(
                    now.setDate(now.getDate() - now.getDay())
                )
                const startOfLastWeek = new Date(startOfWeek)
                startOfLastWeek.setDate(startOfLastWeek.getDate() - 7)

                const patientsThisWeek = patients.filter(
                    (p) => new Date(p.meta?.lastUpdated || "") >= startOfWeek
                ).length
                const patientsLastWeek = patients.filter(
                    (p) =>
                        new Date(p.meta?.lastUpdated || "") >=
                            startOfLastWeek &&
                        new Date(p.meta?.lastUpdated || "") < startOfWeek
                ).length

                if (patientsLastWeek === 0) return 84
                if (patientsThisWeek === 0) return -24
                return Math.round(
                    ((patientsThisWeek - patientsLastWeek) / patientsLastWeek) *
                        100
                )
            })(),
            featuredValues: [
                patients.filter((c) => c.gender === "male").length + " Male",
                patients.filter((c) => c.gender === "female").length +
                    " Female",
                // patients.filter((c) => c.gender === "other").length + " Child",
            ],
        },
        {
            ImageSrc: consentImage,
            text: "Consents",
            subText: "Consents",
            counts: consents.length,
            routeTo: "/Consent",
            bg: "", //"rgba(0,128,0,0.1)",
            progressHighlight: "#8AD8C7",
            progressBg: "#D3FAF2",
            isCheckCard: true,
            comparisonPercentage: (() => {
                const now = new Date()
                const startOfWeek = new Date(
                    now.setDate(now.getDate() - now.getDay())
                )
                const startOfLastWeek = new Date(startOfWeek)
                startOfLastWeek.setDate(startOfLastWeek.getDate() - 7)

                const consentsThisWeek = consents.filter(
                    (c) => new Date(c.meta?.lastUpdated || "") >= startOfWeek
                ).length
                const consentsLastWeek = consents.filter(
                    (c) =>
                        new Date(c.meta?.lastUpdated || "") >=
                            startOfLastWeek &&
                        new Date(c.meta?.lastUpdated || "") < startOfWeek
                ).length

                if (consentsLastWeek === 0) return 90
                if (consentsThisWeek === 0) return -30
                return Math.round(
                    ((consentsThisWeek - consentsLastWeek) / consentsLastWeek) *
                        100
                )
            })(),
            featuredValues: [
                consents.filter((c) => c.status === "active").length +
                    " Approved",
                consents.filter((c) => c.status === "draft").length +
                    " Pending",
                // consents.filter((c) => c.status === "rejected").length + " Rejected",
            ],
        },
        {
            ImageSrc: appointmentImage,
            text: "Appointments",
            subText: "Appointments",
            counts: appointments.length,
            routeTo: "/Calendar",
            bg: "", //"rgba(0,128,0,0.1)",
            progressHighlight: "#8AD8C7",
            progressBg: "#D3FAF2",
            isCheckCard: true,
            comparisonPercentage: (() => {
                const now = new Date()
                const startOfWeek = new Date(
                    now.setDate(now.getDate() - now.getDay())
                )
                const startOfLastWeek = new Date(startOfWeek)
                startOfLastWeek.setDate(startOfLastWeek.getDate() - 7)

                const appointmentsThisWeek = appointments.filter(
                    (a) => new Date(a.meta?.lastUpdated || "") >= startOfWeek
                ).length
                const appointmentsLastWeek = appointments.filter(
                    (a) =>
                        new Date(a.meta?.lastUpdated || "") >=
                            startOfLastWeek &&
                        new Date(a.meta?.lastUpdated || "") < startOfWeek
                ).length

                if (appointmentsLastWeek === 0) return 90
                if (appointmentsThisWeek === 0) return -14

                return Math.round(
                    ((appointmentsThisWeek - appointmentsLastWeek) /
                        appointmentsLastWeek) *
                        100
                )
            })(),
            featuredValues: [
                appointments.filter(
                    (a) =>
                        a.start &&
                        new Date(a.start).toDateString() ===
                            new Date().toDateString()
                ).length + " today",
                appointments.filter(
                    (a) =>
                        a.start &&
                        new Date(a.start) > new Date() &&
                        new Date(a.start) <=
                            new Date(
                                new Date().setDate(new Date().getDate() + 7)
                            )
                ).length + " next week",
            ],
        },
        // {
        // 	ImageSrc: "/assets/images/dashboard-assets/square-plus.svg",
        // 	text: "Clinical Trials",
        // 	subText: "Clinical Trials",
        // 	counts: researchStudies.length,
        // 	routeTo: "/Trials",
        // 	bg: "rgba(255,255,0,0.1)",
        // 	progressHighlight: "#E1CEA8",
        // 	progressBg: "#F4E9D3",
        // 	isCheckCard: true,
        // },
        // {
        // 	ImageSrc: "/assets/images/dashboard-assets/procedures.svg",
        // 	text: "Procedures",
        // 	subText: "Procedures",
        // 	counts: procedures.length,
        // 	routeTo: "#",
        // 	bg: "rgba(128,128,128,0.1)",
        // 	progressHighlight: "#ADADAD",
        // 	progressBg: "#DBDBDB",
        // 	isCheckCard: false,
        // },
    ]

    const fetchData = useCallback(
        (resourceType: ResourceType) => {
            if (!readyToFetch) return
            switch (resourceType) {
                case "Patient":
                    medplum
                        .searchResources("Patient", { _count: 30 })
                        .then((data) => setPatients(data))
                        .catch((err) =>
                            console.error(
                                "Error while fetching data of all patients: ",
                                err
                            )
                        )
                    break

                case "Task":
                    medplum
                        .searchResources("Task", { _count: 10 })
                        .then((data) => setTasks(data))
                        .catch((err) =>
                            console.error(
                                "Error while fetching data of all patients: ",
                                err
                            )
                        )
                    break
                case "Practitioner":
                    medplum
                        .searchResources("Practitioner", {
                            _count: 30,
                        })
                        .then((data) => setPractitioners(data))
                        .catch((err) =>
                            console.error(
                                "Error while fetching data of all practitioners: ",
                                err
                            )
                        )
                    break
                case "Appointment":
                    medplum
                        .searchResources("Appointment", {
                            _count: 10,
                        })
                        .then((data) => setAppointments(data))
                        .catch((err) =>
                            console.error(
                                "Error while fetching appointments: ",
                                err
                            )
                        )
                    break
                case "Group":
                    medplum
                        .searchResources("Group", {
                            _count: 20,
                            _fields: "_lastUpdated",
                        })
                        .then((data) => setGroups(data))
                        .catch((err) =>
                            console.error("Error while fetching groups: ", err)
                        )
                    break
                case "Consent":
                    medplum
                        .searchResources("Consent", {
                            _count: 30,
                            _fields: "_lastUpdated",
                        })
                        .then((data) => setConsents(data))
                        .catch((err) =>
                            console.error(
                                "Error while fetching consents: ",
                                err
                            )
                        )
                    break

                case "PractitionerRole":
                    medplum
                        .searchResources("PractitionerRole", {
                            _summary: "count",

                            specialty: "Cardiology",
                        })

                        .then((data) => {
                            setCardiologist(data.bundle.total ?? 0)
                        })
                        .catch((err) =>
                            console.error(
                                "Error while fetching consents: ",
                                err
                            )
                        )

                    medplum
                        .searchResources("PractitionerRole", {
                            _summary: "count",

                            specialty: "Dermatology",
                        })
                        .then((data) => {
                            setDermatology(data.bundle.total ?? 0)
                        })

                        .catch((err) =>
                            console.error(
                                "Error while fetching consents: ",
                                err
                            )
                        )
                    break
            }
        },
        [medplum, readyToFetch]
    )

    useEffect(() => {
        fetchData("Patient")
        fetchData("Practitioner")
        // fetchData("Group");
        fetchData("Consent")
        fetchData("Appointment")
        fetchData("Task")
        fetchData("PractitionerRole")
    }, [fetchData])

    const taskTableData: ITableColumn[] = [
        {
            columnName: "Patient",
            columnValues: tasks.map((task) => {
                const patient: Patient | undefined = patients.find(
                    (p) => task.for?.reference?.split("/")[1] === p.id!
                )
                const fullName: string = patient ? getName(patient) : "-"
                const lastName: string = patient?.name?.[0]?.family || "-"
                return {
                    id: task.id!,
                    value: fullName,
                    sortValue: lastName,
                    searchValue: fullName,
                }
            }),
            sortable: true,
        },
        {
            columnName: "Description",
            columnValues: tasks.map((task) => {
                const description: string = task?.description || "-"
                return {
                    id: task.id!,
                    value: description,
                }
            }),
            sortable: false,
        },
        {
            columnName: "Created At",
            columnValues: tasks.map((task) => {
                const date: string = task?.authoredOn || "-"
                return {
                    id: task.id!,
                    value: formatDate(date),
                    sortValue: date,
                }
            }),
            sortable: true,
        },
        {
            columnName: "Created By",
            columnValues: tasks.map((task) => {
                const practitioner: Practitioner | undefined =
                    practitioners.find(
                        (pr) => task.owner?.reference?.split("/")[1] === pr.id!
                    )
                const fullName: string = practitioner
                    ? getName(practitioner)
                    : "-"
                const lastName: string = practitioner?.name?.[0]?.family || "-"
                return {
                    id: task.id!,
                    value: fullName,
                    sortValue: lastName,
                    searchValue: fullName,
                }
            }),
            sortable: true,
        },
    ]

    const appointmentTableData: ITableColumn[] = [
        {
            columnName: "Patient Name",
            columnValues: appointments.map((a) => ({
                id: a.id!,
                value: (
                    <Text fw={500}>
                        {getName(
                            getPatientFromAppointment(a, patients) ||
                                ({} as Patient)
                        )}
                    </Text>
                ),
                sortValue: getName(
                    getPatientFromAppointment(a, patients) || ({} as Patient)
                ),
            })),
            sortable: true,
        },
        {
            columnName: "Date",
            columnValues: appointments.map((a) => ({
                id: a.id!,
                value: formatDateTime(a.start, undefined, {
                    dateStyle: "short",
                    timeStyle: "short",
                }),
                sortValue: a.start,
            })),
            sortable: true,
        },
    ]

    return (
        <Card mt={10} mx={10}>
            <Box py={20}>
                <Grid>
                    <FeaturedCards cardsData={cardsData} />
                </Grid>
            </Box>
            <Group align="flex-start" sx={{ width: "100%" }}>
                <Box>
                    <TableWithControlsDashBoard
                        tableData={appointmentTableData}
                        onRowClick={() => {
                            navigate("/Calendar")
                        }}
                        titleLabel="Upcoming Appointments"
                        resourceType="Appointment"
                        title="Appointments"
                        withCheckboxes={false}
                        showTop={false}
                    />
                </Box>
                <Box sx={{ width: "61%" }}>
                    <TableWithControlsDashBoard
                        tableData={taskTableData}
                        onRowClick={() => {
                            navigate("/Task")
                        }}
                        titleLabel="Tasks"
                        resourceType="Task"
                        title="Task"
                        withCheckboxes={false}
                        showTop={false}
                    />
                </Box>
            </Group>
        </Card>
    )
}
