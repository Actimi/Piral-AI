import { ActionIcon, Menu, Modal, Stack, useMantineTheme } from "@mantine/core"
import { useMedplumContext, useMedplumNavigate } from "@medplum/react"
import { IconDotsVertical } from "@tabler/icons-react"
import { openConfirmModal } from "../../utils/openConfirmModal"
import { ResourceType } from "@medplum/fhirtypes"
import React, { MouseEvent, useState } from "react"
import { IExtraItem } from "../../types/interfaces"
import { useClickOutside, useDisclosure } from "@mantine/hooks"
import TaskForm from "../forms/TaskForm"
import { showErrorMessage, showSuccessMessage } from "../../utils/validation"

interface Props {
    resourceType: ResourceType
    id: string
    onUpdate?: (id: string) => void
    extraItems?: IExtraItem[]
}

export default function TableMoreButton({
    resourceType,
    id,
    onUpdate,
    extraItems,
}: Props) {
    const { medplum } = useMedplumContext()
    const navigate = useMedplumNavigate()
    const theme = useMantineTheme()
    const [opened, { open, close }] = useDisclosure()
    const [menuOpened, setMenuOpened] = useState<boolean>(false)
    const ref = useClickOutside(() => setMenuOpened(false))

    const renderExtraItems = () => {
        return extraItems?.map((item) => {
            return (
                <Menu.Item
                    key={item.buttonText}
                    onClick={(e) => {
                        setMenuOpened(false)
                        item.handleClick(e)
                    }}
                >
                    {item.buttonText}
                </Menu.Item>
            )
        })
    }

    const deleteResource = () => {
        medplum
            .deleteResource(resourceType, id)
            .then(() => {
                showSuccessMessage(
                    `${resourceType === "DocumentReference" ? "Document" : resourceType} deleted.`
                )
                navigate(`/${resourceType}`)
            })
            .catch((err) => {
                console.error(
                    `Error while deleting ${resourceType.toLowerCase()}: `,
                    err
                )
                showErrorMessage(
                    `Failed to delete ${resourceType === "DocumentReference" ? "document" : resourceType.toLowerCase()}.`
                )
            })
    }

    const deletePractitioner = () => {
        medplum
            .deleteResource("Practitioner", id)
            // .then(() => {
            //   practitionerRoles
            //     .filter(role => role.practitioner?.id === id)
            //     .forEach(role => medplum.deleteResource('PractitionerRole', role.id!));
            // })
            .then(() => {
                showSuccessMessage("Practitioner deleted.")
                navigate("Practitioner")
            })
            .catch((err) => {
                console.error("Error while deleting practitioners: ", err)
                showErrorMessage("Failed to delete practitioner.")
            })
    }

    const handleIconClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        setMenuOpened(true)
    }

    return (
        <Menu withArrow opened={menuOpened}>
            <Menu.Target>
                <ActionIcon onClick={handleIconClick}>
                    <IconDotsVertical color={theme.colors.gray[9]} size={18} />
                </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown ref={ref}>
                <Stack>
                    {extraItems && renderExtraItems()}
                    <Menu.Item
                        onClick={(e) => {
                            e.stopPropagation()
                            setMenuOpened(false)
                            onUpdate
                                ? onUpdate(id)
                                : navigate(`/${resourceType}/${id}/edit`)
                        }}
                    >
                        Update{" "}
                        {resourceType === "DocumentReference"
                            ? "Document"
                            : resourceType}
                    </Menu.Item>
                    <Menu.Item
                        onClick={(e) => {
                            e.stopPropagation()
                            setMenuOpened(false)
                            openConfirmModal({
                                modalText: `Do you really want to delete the ${resourceType === "DocumentReference" ? "document" : resourceType.toLowerCase()}? This action cannot be undone.`,
                                confirmButtonText: "Yes",
                                cancelButtonText: "No",
                                onConfirm:
                                    resourceType === "Practitioner"
                                        ? deletePractitioner
                                        : deleteResource,
                            })
                        }}
                    >
                        Delete{" "}
                        {resourceType === "DocumentReference"
                            ? "Document"
                            : resourceType}
                    </Menu.Item>
                </Stack>
            </Menu.Dropdown>
            <Modal
                opened={opened}
                onClose={close}
                centered
                withCloseButton={false}
            >
                <TaskForm close={close} taskId={id} />
            </Modal>
        </Menu>
    )
}
