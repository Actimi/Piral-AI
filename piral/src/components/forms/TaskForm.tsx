import {
    Button,
    Group,
    Select,
    Stack,
    Text,
    TextInput,
    Tooltip,
} from "@mantine/core"
import { useForm } from "@mantine/form"
import { useMedplum } from "@medplum/react"
import { showErrorMessage, showSuccessMessage } from "../../utils/validation"
import { useCallback, useEffect, useState } from "react"
import { Patient, Practitioner, ResourceType, Task } from "@medplum/fhirtypes"
import SearchableDropdown from "../ui/SearchableDropdown"
import { getName } from "../../utils/tables"
import { TASK_STATUS_DATALIST } from "../../utils/constants"
import { openConfirmModal } from "../../utils/openConfirmModal"
import { getIdFromReference } from "../../utils/helpers"
import { useReadyToFetch } from "../../hooks/useCheckReadyToFetch"
import React from "react"

interface Props {
    close: () => void
    taskId?: string
    preSelectedPractitioner?: Practitioner | undefined
    preSelectedPatient?: Patient | undefined
}

export default function TaskForm({
    close,
    taskId,
    preSelectedPractitioner,
    preSelectedPatient,
}: Props) {
    const medplum = useMedplum()
    const readyToFetch = useReadyToFetch()
    const [patients, setPatients] = useState<Patient[]>([])
    const [practitioners, setPractitioners] = useState<Practitioner[]>([])
    const [tasks, setTasks] = useState<Task[]>([])
    const [code, setCode] = useState<string>("")
    const [status, setStatus] = useState<Task["status"]>("accepted")
    const [practitioner, setPractitioner] = useState<Practitioner | undefined>(
        preSelectedPractitioner
    )
    const [patient, setPatient] = useState<Patient | undefined>(
        preSelectedPatient
    )
    const [notes, setNotes] = useState<string>("")

    const currentTask: Task | undefined = tasks.find(
        (task) => task.id === taskId
    )

    const fetchData = useCallback(
        (resourceType: ResourceType) => {
            if (!readyToFetch) return
            switch (resourceType) {
                case "Patient":
                    medplum
                        .searchResources("Patient", { _count: 200 })
                        .then((data) => setPatients(data))
                        .catch((err) =>
                            console.error(
                                "Error while fetching data of all patients: ",
                                err
                            )
                        )
                    break
                case "Practitioner":
                    medplum
                        .searchResources("Practitioner", { _count: 200 })
                        .then((data) => setPractitioners(data))
                        .catch((err) =>
                            console.error(
                                "Error while fetching data of all practitioners: ",
                                err
                            )
                        )
                    break
                case "Task":
                    medplum
                        .searchResources("Task", { _count: 200 })
                        .then((data) => setTasks(data))
                        .catch((err) =>
                            console.error("Error while fetching tasks: ", err)
                        )
                    break
            }
        },
        [medplum, readyToFetch]
    )

    useEffect(() => {
        fetchData("Patient")
        fetchData("Practitioner")
        fetchData("Task")
    }, [fetchData])

    const form = useForm({
        mode: "uncontrolled",
    })

    const handleSubmit = async () => {
        if (!practitioner) {
            showErrorMessage("Please select a practitioner.")
        } else if (!patient) {
            showErrorMessage("Please select a patient.")
        } else if (!code) {
            showErrorMessage("Please select a code.")
        } else if (!notes) {
            showErrorMessage("Please enter a note.")
        } else {
            try {
                if (!currentTask) {
                    const newTask: Task = await medplum.createResource<Task>({
                        resourceType: "Task",
                        status,
                        intent: "proposal",
                        for: {
                            reference: `Patient/${patient?.id}`,
                            display: getName(patient),
                        },
                        owner: {
                            reference: `Practitioner/${practitioner?.id}`,
                            display: getName(practitioner),
                        },
                        code: {
                            text: code,
                        },
                        note: [{ text: notes }],
                    })
                } else {
                    const updatedTask: Task =
                        await medplum.updateResource<Task>({
                            ...currentTask,
                            status,
                            for: {
                                reference: `Patient/${patient?.id}`,
                                display: getName(patient),
                            },
                            owner: {
                                reference: `Practitioner/${practitioner?.id}`,
                                display: getName(practitioner),
                            },
                            code: {
                                text: code,
                            },
                            note: [{ text: notes }],
                        })
                }
                fetchData("Task")
                showSuccessMessage(
                    `Task ${currentTask ? "updated" : "created"}.`
                )
                close()
            } catch (err) {
                console.error(err)
                showErrorMessage(
                    `Error while ${currentTask ? "updating" : "creating"} task.`
                )
            }
        }
    }

    const deleteTask = () => {
        taskId &&
            medplum
                .deleteResource("Task", taskId)
                .then(() => {
                    fetchData("Task")
                    showSuccessMessage("Task deleted.")
                    close()
                })
                .catch((err) => {
                    console.error(
                        `Error while deleting task with id ${taskId}: `,
                        err
                    )
                    showErrorMessage("Failed to delete task.")
                })
    }

    useEffect(() => {
        if (!currentTask || practitioners.length === 0 || patients.length === 0)
            return
        const foundPractitioner: Practitioner | undefined = practitioners.find(
            (pr) =>
                pr.id === getIdFromReference(currentTask.owner?.reference || "")
        )
        setPractitioner(foundPractitioner)
        const foundPatient: Patient | undefined = patients.find(
            (p) => p.id === getIdFromReference(currentTask.for?.reference || "")
        )
        setPatient(foundPatient)
        setCode(currentTask.code?.text || "")
        setNotes(currentTask.note?.[0]?.text || "")
        setStatus(currentTask.status)
    }, [currentTask, patients, practitioners])

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
                <Tooltip label="Set a task.">
                    <Group>
                        <Text size="xl">Task</Text>
                    </Group>
                </Tooltip>
                <Group>
                    <TextInput
                        label="Title"
                        placeholder="What is the task?"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        w="100%"
                    />
                    <SearchableDropdown
                        resourceType="Practitioner"
                        selectedPractitioner={practitioner}
                        setSelectedPractitioner={setPractitioner}
                        allowAll={false}
                        required
                    />
                    <SearchableDropdown
                        resourceType="Patient"
                        selectedPatient={patient}
                        setSelectedPatient={setPatient}
                        allowAll={false}
                        required
                    />
                    <Select
                        label="Status"
                        placeholder="Status of the task"
                        searchable
                        allowDeselect={false}
                        data={TASK_STATUS_DATALIST}
                        value={status}
                        onChange={(value) => setStatus(value as Task["status"])}
                        w="100%"
                        required
                    />
                    <TextInput
                        label="Notes"
                        placeholder="Some notes to add..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        w="100%"
                        required
                    />
                </Group>
                <Group>
                    <Button type="submit" disabled={!practitioner}>
                        {taskId ? "Update" : "Add"}
                    </Button>
                    {taskId && (
                        <Button
                            type="button"
                            color="red"
                            onClick={() => {
                                openConfirmModal({
                                    modalText:
                                        "Do you really want to delete this task?",
                                    confirmButtonText: "Yes",
                                    cancelButtonText: "No",
                                    onConfirm: deleteTask,
                                })
                            }}
                        >
                            Delete
                        </Button>
                    )}
                </Group>
            </Stack>
        </form>
    )
}
