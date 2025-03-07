import {
    Box,
    Card,
    Center,
    Group,
    Menu,
    rem,
    Text,
    Title,
    UnstyledButton,
    useMantineColorScheme,
} from "@mantine/core"
import { createStyles } from "@mantine/emotion"
import { useMedplum } from "@medplum/react"
import { IconChevronDown } from "@tabler/icons-react"
import React, { useEffect, useState } from "react"
import { ehrList } from "./fhirApi"

interface TitleProps {
    title: string
    EhrFilter?: boolean
    organizationFilter?: boolean
    selectedLabel?: string
    onEhrTypeSelect?: (selectedItem: any) => void
}

const TitleComponent: React.FC<TitleProps> = ({
    title,
    EhrFilter,
    organizationFilter,
    selectedLabel,
    onEhrTypeSelect,
}) => {
    const medplum = useMedplum()
    const { colorScheme } = useMantineColorScheme()
    const [opened, setOpened] = useState(false)
    const [selected, setSelected] = React.useState({ id: "all", label: "All" })
    const [ehrTypes, setEhrTypes] = useState([])

    const [organization, setOrganization] = React.useState<any | null>()

    const useStyles = createStyles(
        (theme, { opened }: { opened: boolean }) => ({
            card: {
                backgroundColor:
                    colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
                height: "100%",
            },

            title: {
                lineHeight: "16px",
            },

            control: {
                width: "max-content",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: `6px ${theme.spacing.xs}`,
                marginRight: `${theme.spacing.lg}`,
                borderRadius: theme.radius.sm,
                border: `${rem(1)} solid ${
                    colorScheme === "dark"
                        ? theme.colors.dark[6]
                        : theme.colors.gray[2]
                }`,
                transition: "background-color 150ms ease",
                backgroundColor:
                    colorScheme === "dark"
                        ? theme.colors.dark[opened ? 5 : 6]
                        : opened
                          ? theme.colors.gray[0]
                          : theme.white,

                "&:hover": {
                    backgroundColor:
                        colorScheme === "dark"
                            ? theme.colors.dark[5]
                            : theme.colors.gray[0],
                },
            },

            label: {
                fontWeight: 400,
                fontSize: theme.fontSizes.sm,
                marginRight: theme.spacing.sm,
            },

            activeLabel: {
                fontWeight: 700,
                fontSize: theme.fontSizes.md,
            },

            activeBullet: {
                width: "20px",
                height: "20px",
            },

            filterChip: {
                "& label": {
                    backgroundColor: "#E9F3FF",
                    color: "#5D6874",
                    "&[data-checked]": {
                        backgroundColor: "#C7E0FF !important",
                        color: "#444444 !important",
                        fontWeight: 700,
                    },
                    "& span": {
                        display: "none",
                    },
                },
            },
        })
    )

    const { classes } = useStyles({ opened })

    useEffect(() => {
        if (EhrFilter) {
            ehrList(medplum)
                .then((response) => {
                    const updatedResponse = response?.data.map((item: any) => ({
                        ...item,
                    }))
                    setEhrTypes(updatedResponse)
                })
                .catch((error: any) => {
                    console.error("Error fetching data:", error)
                })
        }
    }, [EhrFilter])
    const items = [
        <Menu.Item
            onClick={() => handleEhrTypeSelect({ id: "all", label: "All" })}
            key="all"
        >
            All
        </Menu.Item>,
        ...ehrTypes?.map((item: any) => (
            <Menu.Item onClick={() => handleEhrTypeSelect(item)} key={item.id}>
                {item.label}
            </Menu.Item>
        )),
    ]

    const handleEhrTypeSelect = (item: any) => {
        if (onEhrTypeSelect) {
            setSelected(item)
            onEhrTypeSelect(item)
        }
    }

    return (
        <>
            <Card
                mx="lg"
                my="sm"
                display="flex"
                shadow="xs"
                radius="sm"
                p="sm"
                sx={{
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    flexDirection: "row",
                }}
                className="bg-main-light"
            >
                {/* <Center>{<Breadcrumb />}</Center> */}
                <Center>
                    <Text
                        className={classes.title}
                        variant="sm"
                        size="16px"
                        fw="bold"
                    >
                        {title}
                    </Text>
                </Center>
            </Card>

            {(EhrFilter || organizationFilter) && (
                <Box
                    mx="lg"
                    mb="md"
                    mt="lg"
                    px="sm"
                    sx={{
                        display: "flex",
                        alignItems: "baseline",
                        flexDirection: "row",
                    }}
                >
                    <Center>
                        <Text variant="sm" size="16px" fw="bold">
                            {"Filters : "}
                        </Text>
                        {EhrFilter && (
                            <Menu
                                onOpen={() => setOpened(true)}
                                onClose={() => setOpened(false)}
                                radius="md"
                                width="200px"
                                withinPortal
                            >
                                <Center
                                    style={{ justifyContent: "flex-start" }}
                                >
                                    <Title
                                        variant="h6"
                                        size={14}
                                        ml="lg"
                                        mr="xs"
                                    >
                                        EHR Type :
                                    </Title>
                                    <Menu.Target>
                                        <UnstyledButton
                                            className={classes.control}
                                        >
                                            <Group gap="xs">
                                                <span className={classes.label}>
                                                    {selectedLabel}
                                                </span>
                                            </Group>
                                            <IconChevronDown size="1rem" />
                                        </UnstyledButton>
                                    </Menu.Target>
                                    <Menu.Dropdown>{items}</Menu.Dropdown>
                                </Center>

                                {EhrFilter && organizationFilter && (
                                    <Text variant="sm" size="16px" fw="bold">
                                        {"|"}
                                    </Text>
                                )}
                            </Menu>
                        )}

                        {organizationFilter && (
                            <Menu
                                onOpen={() => setOpened(true)}
                                onClose={() => setOpened(false)}
                                radius="md"
                                width="target"
                                withinPortal
                            >
                                <Center
                                    style={{ justifyContent: "flex-start" }}
                                >
                                    <Title
                                        variant="h6"
                                        size={14}
                                        ml="lg"
                                        mr="xs"
                                    >
                                        Organizations :
                                    </Title>
                                    <Menu.Target>
                                        <UnstyledButton
                                            className={classes.control}
                                        >
                                            <Group gap="xs">
                                                <span className={classes.label}>
                                                    {organization?.name}
                                                </span>
                                            </Group>
                                            <IconChevronDown size="1rem" />
                                        </UnstyledButton>
                                    </Menu.Target>
                                </Center>
                            </Menu>
                        )}
                    </Center>
                </Box>
            )}
        </>
    )
}

export default TitleComponent
