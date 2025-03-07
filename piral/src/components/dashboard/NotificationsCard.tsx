import { Card, Text, Group, useMantineColorScheme } from "@mantine/core"
import { createStyles } from "@mantine/emotion"
import { IconArrowRight } from "@tabler/icons-react"
import { Link } from "react-router-dom"
import { format } from "date-fns"
import React from "react"

export interface notificationCardProps {
    notificationList: any
}

const NotificationsCard: React.FC<notificationCardProps> = ({
    notificationList,
}) => {
    const { colorScheme } = useMantineColorScheme()
    const useStyles = createStyles((theme) => ({
        card: {
            backgroundColor:
                colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
        },

        section: {
            padding: theme.spacing.xs,
            borderBottom: `1px solid #EEF1F6 !important`,
        },

        footer: {
            padding: theme.spacing.md,
            borderTop: `1px solid #EEF1F6 !important`,
        },

        icon: {
            padding: theme.spacing.xs,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#EDF5FF",
            height: "40px",
            width: "40px",
            borderRadius: "25px",
            color:
                colorScheme === "dark"
                    ? theme.colors.dark[2]
                    : theme.colors.gray[5],
        },

        scrollbar: {
            overflow: "hidden",
            "&:hover": {
                overflowY: "auto",
                scrollbarWidth: "thin",
                scrollbarColor: "#ccc #f3f3f3",
                "&::-webkit-scrollbar": {
                    width: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                    background: "#ccc",
                    borderRadius: "8px",
                    "&:hover": {
                        background: "#aaa",
                    },
                },
            },
        },
    }))

    const { classes } = useStyles()

    let displayedNotificationsCount = 0
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString)
        return format(date, "MM/DD/YYYY hh:mm A")
    }
    const organisationDetails = notificationList?.map((details: any) => {
        try {
            const outcomeDesc = details.resource?.outcomeDesc

            if (
                !outcomeDesc ||
                outcomeDesc.toLowerCase() === "{}" ||
                outcomeDesc.toLowerCase().includes("error")
            ) {
                return null
            }

            if (displayedNotificationsCount >= 5) {
                return null
            }

            displayedNotificationsCount++

            return (
                <Card.Section
                    key={details.resource.id}
                    display="flex"
                    className={classes.section}
                >
                    <Group style={{ justifyContent: "flex-start", flex: 1 }}>
                        <div className={classes.icon}>
                            <img
                                src="/assets/images/dashboard-assets/notifications.svg"
                                height="15px"
                                alt="Notification Icon"
                            />
                        </div>
                    </Group>
                    <Group
                        style={{
                            display: "block",
                            flex: 6,
                            padding: "0 6px",
                            gap: "0.5rem",
                        }}
                    >
                        <Text
                            className="lightText"
                            fw={400}
                            sx={{ lineHeight: "1.4", fontSize: "13px" }}
                        >
                            {outcomeDesc}
                        </Text>
                        <Text
                            className="lightText"
                            fw={500}
                            sx={{
                                lineHeight: "1.4",
                                fontSize: "12px",
                                width: "100%",
                                textAlign: "end",
                                marginTop: "5px",
                            }}
                        >
                            {formatDate(details.resource.recorded)}
                        </Text>
                    </Group>
                </Card.Section>
            )
        } catch (error) {
            console.error("Error:", error)
            return null
        }
    })

    return (
        <Card withBorder radius="md" className={classes.card}>
            <Card.Section className={classes.section} p="lg">
                <Text className="darkText" fw={700}>
                    Notifications & Alerts
                </Text>
            </Card.Section>

            <Group
                px="xs"
                display="block"
                className={classes.scrollbar}
                style={{ height: "407px", overflowX: "hidden" }}
            >
                {organisationDetails}
            </Group>

            <Card.Section className={classes.footer}>
                <Group style={{ alignItems: "flex-end" }} gap={30}>
                    <div
                        style={{
                            textDecoration: "none",
                            alignItems: "flex-end",
                            flex: 2,
                        }}
                    ></div>
                    <Link
                        style={{
                            textDecoration: "none",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            flex: 1,
                            color: "#222",
                            display: "flex",
                        }}
                        to={"/all-notifications"}
                    >
                        <Text fw={700} mr="5px">
                            View All
                        </Text>
                        <IconArrowRight size="16px" />
                    </Link>
                </Group>
            </Card.Section>
        </Card>
    )
}

export default NotificationsCard
