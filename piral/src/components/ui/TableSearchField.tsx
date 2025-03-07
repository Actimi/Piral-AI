import { Group, TextInput } from "@mantine/core"
import { ResourceType } from "@medplum/fhirtypes"
import { IconSearch } from "@tabler/icons-react"
import React, { Dispatch, SetStateAction } from "react"

interface Props {
    setSearchTerm: Dispatch<SetStateAction<string>>
}

export default function TableSearchField({ setSearchTerm }: Props) {
    return (
        <Group style={{ alignSelf: "flex-end" }}>
            <TextInput
                leftSection={<IconSearch size={20} />}
                placeholder="Search"
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </Group>
    )
}
