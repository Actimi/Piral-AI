import {
    ActionIcon,
    Box,
    Button,
    Checkbox,
    Group,
    ScrollArea,
    Stack,
    Table,
    Text,
    Title,
    useMantineTheme,
} from "@mantine/core"
import { ResourceType } from "@medplum/fhirtypes"
import React, { ReactElement, useEffect, useMemo, useState } from "react"
import classes from "../../styles.module.css"
import { useMedplumNavigate } from "@medplum/react"
import {
    checkContainsSearchTerm,
    getPaginationSlice,
} from "../../utils/helpers"
import TablePagination from "../ui/TablePagination"
import { IExtraItem, ITableColumn, ITableRow } from "../../types/interfaces"
import TableMoreButton from "../ui/TableMoreButton"
import TableTopRow from "../ui/TableTopRow"
import { IconChevronDown, IconChevronUp, IconPlus } from "@tabler/icons-react"

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

export default function TableWithControls({
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
                        <Text fz={14.5} fw={500}>
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
        <Box p="lg" ml={showTop ? "md" : 0}>
            <ScrollArea style={{ overflow: "unset" }}>
                <Group justify="space-between">
                    <Group>
                        <Title
                            mt={12}
                            fw={showTop ? 600 : 500}
                            size={showTop ? 24 : 16}
                            mb="md"
                        >
                            {title}
                        </Title>
                        {titleLabel && (
                            <Box
                                size="sm"
                                color="Gray"
                                p={6}
                                style={{
                                    borderRadius: "6px",
                                    border: "1px solid rgba(208, 213, 221, 1)",
                                    background: "rgba(255, 255, 255, 1)",
                                    boxShadow:
                                        "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
                                    marginLeft: "8px",
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: "Inter",
                                        fontSize: "12px",
                                        fontWeight: 500,
                                        lineHeight: "18px",
                                        textAlign: "center",
                                        textUnderlinePosition: "from-font",
                                        textDecorationSkipInk: "none",
                                    }}
                                >
                                    {titleLabel}
                                </Text>
                            </Box>
                        )}
                    </Group>
                    {showTop && (
                        <Button
                            leftSection={<IconPlus />}
                            onClick={() =>
                                onAdd
                                    ? onAdd()
                                    : navigate(`/${resourceType}/new`)
                            }
                        >
                            Add New
                        </Button>
                    )}
                </Group>
                {showTop && (
                    <TableTopRow
                        setSearchTerm={setSearchTerm}
                        checkedRows={checkedRows}
                        resourceType={resourceType}
                    />
                )}
                <Table
                    highlightOnHover
                    horizontalSpacing="md"
                    verticalSpacing="md"
                    className={classes.table}
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
            </ScrollArea>
            <TablePagination
                page={page}
                setPage={setPage}
                total={selectedRows.length}
            />
            {modals}
        </Box>
    )
}
