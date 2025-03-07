import React from "react"
import { Center, Group, Title } from "@mantine/core"

interface IconWithLabelProps {
    label: string
    IconComponent?: React.ElementType
}

export const IconWithLabel: React.FC<IconWithLabelProps> = ({
    label,
    IconComponent,
}) => {
    return (
        <Group display="inline-flex" align="center" gap={10}>
            {IconComponent && (
                <Center
                    color="#EAECF0"
                    bg="#F9FAFB"
                    p={5}
                    h={32}
                    w={32}
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        border: "1px solid #EAECF0",
                        borderRadius: "100%",
                    }}
                >
                    <IconComponent size={20} color="#475467" />
                </Center>
            )}
            <Title size="14" fw={500}>
                {label}
            </Title>
        </Group>
    )
}
