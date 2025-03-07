import { Text } from "@mantine/core"
import { ResourceType } from "@medplum/fhirtypes"
import React from "react"

interface Props {
    resourceType: ResourceType
    selected?: boolean
}

export default function TableEmptyMessage({
    resourceType,
    selected = false,
}: Props) {
    return (
        <Text mt={20}>
            There are currently no {selected && "selected "}{" "}
            {resourceType.toLowerCase()}s.
        </Text>
    )
}
