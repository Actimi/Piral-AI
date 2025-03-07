import React, { PropsWithChildren } from "react"
import { Title } from "@mantine/core"

export default function TableTitle({ children }: PropsWithChildren) {
    return (
        <Title order={4} style={{ marginBottom: "10px", width: "100%" }}>
            {children}
        </Title>
    )
}
