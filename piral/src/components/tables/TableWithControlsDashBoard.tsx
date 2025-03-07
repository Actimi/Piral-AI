import {
    ActionIcon,
    Box,
    Checkbox,
    Group,
    ScrollArea,
    Stack,
    Table,
    Text,
    useMantineTheme,
} from "@mantine/core"
import { ResourceType } from "@medplum/fhirtypes"
import { useMedplumNavigate } from "@medplum/react"
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react"
import React, { ReactElement, useEffect, useMemo, useState } from "react"
import { IExtraItem, ITableColumn, ITableRow } from "../../types/interfaces"
import {
    checkContainsSearchTerm,
    getPaginationSlice,
} from "../../utils/helpers"
import TableMoreButton from "../ui/TableMoreButton"
import TablePagination from "../ui/TablePagination"
import classes from "./DashboardTableStyles.module.css"

interface Props {
    tableData: ITableColumn[]
    title?: string
    resourceType?: ResourceType
    onAdd?: () => void
    onUpdate?: (id: string) => void
    onRowClick?: (id: string) => void
    renderCustomMenu?: (id: string) => ReactElement
    modals?: ReactElement[]
    extraItems?: IExtraItem[]
    withCheckboxes?: boolean
    showTop?: boolean
    numTableUpdates?: number
    titleLabel?: string
}

export default function TableWithControlsDashBoard({
    tableData,
    title,
    resourceType,
    modals,
    onAdd,
    onUpdate,
    onRowClick,
    renderCustomMenu,
    extraItems,
    withCheckboxes = true,
    showTop = true,
    numTableUpdates,
    titleLabel,
}: Props) {
    const theme = useMantineTheme()
    const navigate = useMedplumNavigate()
    const [rows, setRows] = useState<ITableRow[]>([])
    const [checkedRows, setCheckedRows] = useState<string[]>([])
    const [page, setPage] = useState<number>(1)
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [allChecked, setAllChecked] = useState<boolean>(false)

    useEffect(() => {
        const rowsData: ITableRow[] = []
        for (let i = 0; i < tableData[0].columnValues.length; i++) {
            const newRow: ITableRow = {
                id: tableData[0].columnValues[i].id,
                values: [],
            }
            tableData.forEach((entry) => {
                newRow.values.push({
                    columnName: entry.columnName,
                    value: entry.columnValues[i].value,
                    searchValue: entry.columnValues[i].searchValue ?? null,
                    sortValue: entry.columnValues[i].sortValue ?? null,
                })
            })
            rowsData.push(newRow)
        }
        setRows(rowsData)
    }, [tableData, numTableUpdates])

    const selectedRows: ITableRow[] = useMemo(() => {
        return rows.filter((r) => {
            if (!searchTerm) {
                return true
            }
            const searchValue: string =
                r.values.find((v) => v.searchValue)?.searchValue ?? ""
            return checkContainsSearchTerm(searchValue, searchTerm)
        })
    }, [rows, searchTerm])

    const displayedRows: ITableRow[] = useMemo(() => {
        return getPaginationSlice(selectedRows, page)
    }, [selectedRows, page])

    const sortRows = (sortDirection: "up" | "down", col: ITableColumn) => {
        const sortedRows: ITableRow[] = [...rows]
        sortedRows.sort((a, b) => {
            const sortValueA: string =
                a.values.find((v) => v.columnName === col.columnName)
                    ?.sortValue || ""
            const sortValueB: string =
                b.values.find((v) => v.columnName === col.columnName)
                    ?.sortValue || ""
            if (sortDirection === "up") {
                return sortValueA > sortValueB ? 1 : -1
            } else {
                return sortValueB > sortValueA ? 1 : -1
            }
        })
        setRows(sortedRows)
    }

    const renderTableHeader = () => {
        return tableData.map((col) => {
            return (
                <Table.Th key={col.columnName}>
                    <Group justify="flex-start" wrap="nowrap" gap={30}>
                        <Text fz={12} fw={500}>
                            {col.columnName}
                        </Text>
                        {col.sortable && (
                            <Stack gap={0}>
                                <ActionIcon
                                    size="xs"
                                    onClick={() => sortRows("up", col)}
                                >
                                    <IconChevronUp size={16} />
                                </ActionIcon>
                                <ActionIcon
                                    size="xs"
                                    onClick={() => sortRows("down", col)}
                                >
                                    <IconChevronDown size={16} />
                                </ActionIcon>
                            </Stack>
                        )}
                    </Group>
                </Table.Th>
            )
        })
    }

    const renderTableBody = () => {
        return displayedRows.map((row) => {
            return (
                <Table.Tr
                    key={row.id}
                    onClick={() =>
                        onRowClick
                            ? onRowClick(row.id)
                            : navigate(`/${resourceType}/${row.id}`)
                    }
                    style={{
                        cursor: resourceType && "pointer",
                    }}
                >
                    {withCheckboxes && (
                        <Table.Td>
                            <Checkbox
                                checked={
                                    allChecked || checkedRows.includes(row.id)
                                }
                                onClick={(e) => e.stopPropagation()}
                                onChange={() => {
                                    setCheckedRows((prev) =>
                                        prev.includes(row.id)
                                            ? prev.filter((id) => id !== row.id)
                                            : [...prev, row.id]
                                    )
                                }}
                            />
                        </Table.Td>
                    )}
                    {row.values.map((entry) => {
                        return (
                            <Table.Td key={entry.columnName}>
                                {entry.value}
                            </Table.Td>
                        )
                    })}
                    {resourceType && showTop && (
                        <Table.Td>
                            {renderCustomMenu ? (
                                renderCustomMenu(row.id)
                            ) : (
                                <TableMoreButton
                                    resourceType={resourceType}
                                    id={row.id}
                                    onUpdate={onUpdate}
                                    extraItems={extraItems}
                                />
                            )}
                        </Table.Td>
                    )}
                </Table.Tr>
            )
        })
    }

    return (
        <Box p={0}>
            <ScrollArea style={{ overflow: "unset" }}>
                <Box>
                    <Box
                        style={{
                            width: "100%",
                            height: "75px",
                            padding: "12px 24px",
                            gap: "24px",
                            borderTop: "1px solid #EAECF0",
                            borderLeft: "1px solid #EAECF0",
                            borderRight: "1px solid #EAECF0",
                            borderRadius: "8px 8px 0px 0px",
                            marginBottom: "0px",
                            opacity: 1,
                            display: "flex",
                            alignItems: "center",
                            borderColor: "#EAECF0",
                            backgroundColor: "white",
                        }}
                    >
                        <Text c={"#9552E8"} fz={16} fw={550}>
                            {rows.length}{" "}
                            <span style={{ color: "black" }}>{titleLabel}</span>
                        </Text>
                    </Box>

                    <Table
                        highlightOnHover
                        horizontalSpacing="md"
                        verticalSpacing="md"
                        className={classes.table}
                        m={0}
                        mt={-10}
                    >
                        <Table.Thead>
                            <Table.Tr>
                                {withCheckboxes && (
                                    <Table.Th>
                                        <Checkbox
                                            checked={allChecked}
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={() => {
                                                if (allChecked) {
                                                    setAllChecked(false)
                                                    setCheckedRows([])
                                                } else {
                                                    setAllChecked(true)
                                                    const allIds: string[] =
                                                        rows.map((r) => r.id)
                                                    setCheckedRows(allIds)
                                                }
                                            }}
                                        />
                                    </Table.Th>
                                )}
                                {renderTableHeader()}
                                {showTop && <Table.Th>Actions</Table.Th>}
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{renderTableBody()}</Table.Tbody>
                    </Table>

                    <TablePagination
                        page={page}
                        setPage={setPage}
                        total={selectedRows.length}
                    />
                    {modals}
                </Box>
            </ScrollArea>
        </Box>
    )
}
