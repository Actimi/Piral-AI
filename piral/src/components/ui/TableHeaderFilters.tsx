import React from "react"
import {
    Flex,
    Select,
    Group,
    Checkbox,
    Title,
    SelectProps,
} from "@mantine/core"
import { IconChevronDown } from "@tabler/icons-react"
import classes from "../../styles.module.css"

interface TableHeaderFilterProps {
    title: string
    filterOptions: { label: string; value: string }[]
    defaultValue: string
    onFilterChange: (value: string) => void
    count: number
    filterType: string[]
}

export const TableHeaderFilters: React.FC<TableHeaderFilterProps> = ({
    title,
    filterOptions,
    defaultValue,
    onFilterChange,
    count,
    filterType,
}) => {
    const renderSelectOption: SelectProps["renderOption"] = ({
        option,
        checked,
    }) => {
        return (
            <Group align="center">
                <Checkbox
                    checked={checked}
                    readOnly
                    style={{ marginInlineStart: "auto" }}
                />
                {option.label}
            </Group>
        )
    }

    return (
        <Flex
            my="lg"
            direction={{
                xs: "column",
                sm: "row",
                md: "row",
                lg: "row",
            }}
            w={"100%"}
            justify="space-between"
            align="center"
        >
            <Title size="18" ml={4} fw="600">
                {title} ({count})
            </Title>
            <Group>
                {filterType.includes("sort") && (
                    <Select
                        w="auto"
                        data={filterOptions}
                        defaultValue={defaultValue}
                        allowDeselect={false}
                        rightSection={<IconChevronDown />}
                        onChange={(value: any) => onFilterChange(value)}
                        className={classes.select}
                        renderOption={renderSelectOption}
                    />
                )}

                {filterType.includes("type") && (
                    <Select
                        w="auto"
                        data={filterOptions}
                        defaultValue={defaultValue}
                        allowDeselect={false}
                        rightSection={<IconChevronDown />}
                        onChange={(value: any) => onFilterChange(value)}
                        className={classes.select}
                        renderOption={renderSelectOption}
                    />
                )}
            </Group>
        </Flex>
    )
}
