import { Button, Group, Modal, Tooltip } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { ResourceType } from "@medplum/fhirtypes"
import { useMedplumNavigate } from "@medplum/react"
import { IconPlus } from "@tabler/icons-react"
import TaskForm from "../forms/TaskForm"
import React from "react"

interface Props {
    resourceType: ResourceType
    disabled?: boolean
    disabledTooltip?: string
}

export default function TableTitleRow({
    resourceType,
    disabled = false,
    disabledTooltip,
}: Props) {
    const navigate = useMedplumNavigate()
    const [opened, { open, close }] = useDisclosure()
    const title: string =
        resourceType === "DocumentReference" ? "Documents" : resourceType + "s"

    return (
        <Group justify="space-between" align="flex-end" mt="sm" mb="md">
            <Group align="flex-end" ml="auto">
                <Tooltip label={disabledTooltip} disabled={!disabled}>
                    <Button
                        leftSection={<IconPlus />}
                        disabled={disabled}
                        onClick={() => navigate(`/${resourceType}/new`)}
                    >
                        Add New
                    </Button>
                </Tooltip>
            </Group>
            <Modal
                opened={opened}
                onClose={close}
                centered
                withCloseButton={false}
            >
                <TaskForm close={close} />
            </Modal>
        </Group>
    )
}
