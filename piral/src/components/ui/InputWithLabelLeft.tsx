import { Group, Text, Title } from "@mantine/core"
import React from "react"
import { PropsWithChildren } from "react"

interface Props extends PropsWithChildren {
    label: string
    required?: boolean
}

export default function InputWithLabelLeft({
    children,
    label,
    required = false,
}: Props) {
    return (
        <Group w="100%" justify="space-between" align="flex-start">
            <Group gap={5}>
                <Title order={6} fw={500}>
                    {label}
                </Title>
                {required && <Text c="red">*</Text>}
            </Group>
            <Group w="60%">{children}</Group>
        </Group>
    )
}
