import { Table, useMantineTheme } from "@mantine/core"
import { Task } from "@medplum/fhirtypes"
import { useContext, useState } from "react"
import { DataContext } from "../../contexts/data.context"
import { IDataContext } from "../../types/interfaces"
import { STATUS_COLORS } from "../../utils/constants"
import {
    checkContainsSearchTerm,
    getPaginationSlice,
    getStatusString,
} from "../../utils/helpers"
import CustomTable from "../ui/CustomTable"
import { StatusBadge } from "../ui/StatusBadge"
import TableEmptyMessage from "../ui/TableEmptyMessage"
import TableMoreButton from "../ui/TableMoreButton"
import TablePagination from "../ui/TablePagination"
import TableSearchField from "../ui/TableSearchField"
import TableTitleRow from "../ui/TableTitleRow"
import React from "react"

export default function TasksTable() {
    const theme = useMantineTheme()
    const { tasks } = useContext(DataContext) as IDataContext
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [page, setPage] = useState<number>(1)

    const selectedTasks: Task[] = tasks.filter((t) =>
        checkContainsSearchTerm(t.for?.display || "", searchTerm)
    )
    const displayedTasks: Task[] = getPaginationSlice(selectedTasks, page)

    const renderTasks = () => {
        return displayedTasks.map((task) => {
            return (
                // <MedplumLink to={"/Task/" + task.id}>
                <Table.Tr key={task.id!}>
                    <Table.Td>{task?.code?.text}</Table.Td>
                    {/* <Table.Td>
            {task.note?.[0]?.text}
          </Table.Td> */}
                    <Table.Td>
                        <StatusBadge
                            statusLabel={getStatusString(task.status)}
                            statusColor={STATUS_COLORS[task.status]}
                            badgeColor={theme.colors.gray[4]}
                            textColor={theme.colors.gray[9]}
                        />
                    </Table.Td>
                    <Table.Td>
                        {task.meta?.lastUpdated
                            ? new Date(task.meta.lastUpdated).toLocaleString()
                            : ""}
                    </Table.Td>
                    <Table.Td>{task.meta?.author?.display}</Table.Td>
                    <Table.Td>{task.owner?.display}</Table.Td>
                    <Table.Td>
                        <TableMoreButton resourceType="Task" id={task.id!} />
                    </Table.Td>
                </Table.Tr>
                // </MedplumLink>
            )
        })
    }

    return (
        <>
            <TableTitleRow resourceType="Task" />
            {tasks.length === 0 ? (
                <TableEmptyMessage resourceType="Task" />
            ) : (
                <TableSearchField setSearchTerm={setSearchTerm} />
            )}
            {tasks.length > 0 && displayedTasks.length === 0 ? (
                <TableEmptyMessage resourceType="Task" selected />
            ) : (
                <CustomTable>
                    <Table.Thead>
                        <Table.Tr>
                            {/* <Table.Th>Patient</Table.Th> */}
                            <Table.Th>Reason</Table.Th>
                            {/* <Table.Th>Notes</Table.Th> */}
                            <Table.Th>Status</Table.Th>
                            <Table.Th>Created At</Table.Th>
                            <Table.Th>Created By</Table.Th>
                            <Table.Th>Assigned To</Table.Th>
                            <Table.Th>More</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{renderTasks()}</Table.Tbody>
                </CustomTable>
            )}
            <TablePagination
                page={page}
                setPage={setPage}
                total={selectedTasks.length}
            />
        </>
    )
}
