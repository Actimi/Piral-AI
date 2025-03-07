import React, { useState } from "react"
import { Button, Input, Card, Flex, useMantineTheme } from "@mantine/core"
import { IconSearch, IconPlus } from "@tabler/icons-react"
import { useMediaQuery } from "@mantine/hooks"

interface TableActionsProps {
    type: string
    onSearch: (value: string) => void
    onAdd: () => void
    enableAdd?: boolean
}

export const TableActions: React.FC<TableActionsProps> = ({
    type,
    onSearch,
    onAdd,
}) => {
    const [searchText, setSearchText] = useState("")
    const isMobile = useMediaQuery("(max-width: 768px)")
    const theme = useMantineTheme()

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value)
        onSearch(event.target.value)
    }

    return (
        <Card
            shadow="xs"
            radius="xs"
            my="lg"
            px="md"
            py="sm"
            bg={theme.colors.brand[11]}
        >
            <Flex
                direction={{ xs: "column", sm: "row" }}
                w={"100%"}
                justify="space-between"
                align="center"
            >
                <Input
                    size="md"
                    w={{ xs: "80%", sm: "30%" }}
                    radius={8}
                    leftSection={<IconSearch size={18} />}
                    placeholder={`Search for ${type}`}
                    value={searchText}
                    onChange={handleSearchChange}
                />
                <Button
                    bg={theme.colors.brand[0]}
                    onClick={onAdd}
                    leftSection={<IconPlus size={18} />}
                >
                    {isMobile ? null : ` Add New `}
                </Button>
            </Flex>
        </Card>
    )
}
