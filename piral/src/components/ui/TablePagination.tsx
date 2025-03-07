import { Button, Group, Pagination, Text, useMantineTheme } from "@mantine/core"
import classes from "../../styles.module.css"
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react"
import { useMediaQuery } from "@mantine/hooks"
import React, { Dispatch, SetStateAction } from "react"
import { NUM_ITEMS_ON_PAGE } from "../../utils/helpers"

interface Props {
    total: number
    page: number
    setPage: Dispatch<SetStateAction<number>>
}

const TablePagination = ({ total, page, setPage }: Props) => {
    const theme = useMantineTheme()
    const isMobile = useMediaQuery("(max-width: 768px)")

    const maxPageNumber: number = Math.ceil(total / NUM_ITEMS_ON_PAGE)
    const leftButtonDisabled: boolean = page === 1
    const rightButtonDisabled: boolean = page === maxPageNumber

    const getButtonStyle = (buttonType: "previous" | "next") => {
        const disabled: boolean =
            (buttonType === "previous" && leftButtonDisabled) ||
            (buttonType === "next" && rightButtonDisabled)
        return {
            border: "1px solid #D0D5DD",
            opacity: disabled ? 0.55 : "inherit",
            cursor: disabled ? "not-allowed" : "pointer",
        }
    }

    const goToNextPage = () => {
        setPage((prev) => {
            if (prev < maxPageNumber) {
                return prev + 1
            }
            return prev
        })
    }

    const goToPreviousPage = () => {
        setPage((prev) => {
            if (prev > 1) {
                return prev - 1
            }
            return prev
        })
    }

    return (
        <Pagination.Root
            value={page}
            onChange={(pageNumber) => setPage(pageNumber)}
            total={maxPageNumber}
            className={classes.pagination}
            color="#F9FAFB"
            size={isMobile ? "xs" : "md"}
            siblings={2}
            boundaries={3}
        >
            <Group
                gap={5}
                mt="xl"
                w="100%"
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Button
                    variant="outline"
                    size={isMobile ? "xs" : "sm"}
                    style={getButtonStyle("previous")}
                    disabled={leftButtonDisabled}
                    onClick={goToPreviousPage}
                >
                    <IconArrowLeft size={20} />
                    {!isMobile && (
                        <Text
                            size="14"
                            fw={600}
                            c={theme.colors.fontColors[6]}
                            ml="xs"
                        >
                            Previous
                        </Text>
                    )}
                </Button>
                <Group>
                    <Pagination.Items />
                </Group>
                <Button
                    variant="outline"
                    size={isMobile ? "xs" : "sm"}
                    style={getButtonStyle("next")}
                    disabled={rightButtonDisabled}
                    onClick={goToNextPage}
                >
                    {!isMobile && (
                        <Text
                            size="14"
                            fw={600}
                            c={theme.colors.fontColors[6]}
                            mr="xs"
                        >
                            Next
                        </Text>
                    )}
                    <IconArrowRight size={20} />
                </Button>
            </Group>
        </Pagination.Root>
    )
}

export default TablePagination
