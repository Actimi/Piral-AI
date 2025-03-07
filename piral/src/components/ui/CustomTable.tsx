import { Paper, ScrollArea, Table } from "@mantine/core"
import { PropsWithChildren, ReactElement } from "react"
import classes from "../../styles.module.css"
import React from "react"

interface Props extends PropsWithChildren {
    extraItems?: ReactElement | null
}

export default function CustomTable({ children, extraItems }: Props) {
    return (
        <Paper>
            <ScrollArea style={{ overflow: "unset" }}>
                <Table
                    highlightOnHover
                    horizontalSpacing="md"
                    verticalSpacing="md"
                    className={classes.table}
                >
                    {children}
                </Table>
            </ScrollArea>
            {extraItems}
        </Paper>
    )
}
