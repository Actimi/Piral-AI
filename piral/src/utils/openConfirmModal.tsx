import { Text } from "@mantine/core"
import { modals } from "@mantine/modals"
import React from "react"

interface IOpenConfirmModal {
    modalText: string
    confirmButtonText: string
    cancelButtonText: string
    onConfirm: () => void
    onCancel?: () => void
    modalTitle?: string
    withCloseButton?: boolean
}

export function openConfirmModal({
    modalText,
    confirmButtonText,
    cancelButtonText,
    onConfirm,
    onCancel,
    modalTitle,
    withCloseButton = false,
}: IOpenConfirmModal) {
    modals.openConfirmModal({
        title: modalTitle,
        children: <Text size="sm">{modalText}</Text>,
        withCloseButton,
        labels: { confirm: confirmButtonText, cancel: cancelButtonText },
        onConfirm,
        onCancel,
    })
}
