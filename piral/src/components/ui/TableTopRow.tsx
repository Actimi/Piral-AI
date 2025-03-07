import { Group } from "@mantine/core"
import { ResourceType } from "@medplum/fhirtypes"
import React, { Dispatch, SetStateAction } from "react"
import TableSearchField from "./TableSearchField"

interface Props {
    setSearchTerm: Dispatch<SetStateAction<string>>
    checkedRows: string[]
    resourceType?: ResourceType
}

export default function TableTopRow({ setSearchTerm }: Props) {
    return (
        <Group justify="space-between" mx="lg">
            <TableSearchField setSearchTerm={setSearchTerm} />

            <Group gap={2}></Group>
        </Group>
    )
}
