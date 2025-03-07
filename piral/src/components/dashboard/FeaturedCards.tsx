/* eslint-disable @typescript-eslint/explicit-function-return-type */
import styled from "@emotion/styled"
import { Box, Card, Group, Stack, Text, Title } from "@mantine/core"
import { useMedplumNavigate } from "@medplum/react"
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react"
import React from "react"
import { ICards } from "../../types/interfaces"

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const FeaturedCards = ({ cardsData }: { cardsData: ICards[] }) => {
    const navigate = useMedplumNavigate()

    return (
        <Box px="xs" py="lg">
            <Group>
                {cardsData.map((card: ICards, index: number) => (
                    // <Grid.Col key={index} span={{ base: 12, lg: 3, sm: 6 }}>
                    <Card
                        key={index}
                        radius="xl"
                        bg={card.bg}
                        w={242}
                        withBorder
                        style={{
                            boxShadow:
                                "0px 2.5px 0px 0px rgba(128,128,128,0.2)",
                            cursor: "pointer",
                        }}
                        onClick={() => navigate(card.routeTo)}
                    >
                        <Card.Section
                            display="flex"
                            pt={20}
                            p="xs"
                            sx={{
                                justifyContent: "space-between",
                                borderBottom: "1px solid #e2e2e2",
                                alignItems: "center",
                            }}
                        >
                            <IconAndText
                                ImageSrc={card.ImageSrc}
                                text={card.text}
                            />
                            {/* {card.isCheckCard && (
                  <Link to={card.routeTo} style={{ color: '#d3d3d3' }}>
                    <IconArrowRight />
                  </Link>
                )} */}
                        </Card.Section>
                        <Card.Section
                            display="flex"
                            p="xs"
                            sx={{
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Group justify="flex-end">
                                <HeadingAndDesc
                                    text={card.counts}
                                    subText={card.subText}
                                    comparisonPercentage={
                                        card.comparisonPercentage
                                    }
                                />
                                {/* <RingProgress
                    size={70}
                    thickness={9}
                    rootColor={card.progressBg}
                    sections={[{ value: 100, color: card.progressHighlight }]}
                  /> */}
                                <Stack gap={1} py={20}>
                                    {card.featuredValues.map((el, i) => (
                                        <Text key={i} fz={10}>
                                            {el}
                                        </Text>
                                    ))}
                                </Stack>
                            </Group>
                        </Card.Section>
                    </Card>
                    // </Grid.Col>
                ))}
            </Group>
        </Box>
    )
}

export const StyledTypographyDetail = styled(Title)({
    fontSize: "14px",
    fw: "500",
})

export const IconAndText: React.FC<{
    ImageSrc: string
    text?: React.ReactNode
}> = ({ ImageSrc, text }) => (
    <div
        style={{
            display: "flex",
            alignItems: "center",
        }}
    >
        <img src={ImageSrc} />
        <StyledTypographyDetail
            sx={{
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
            }}
            ml="xs"
            fw="600"
            fz={16}
            variant="lg"
        >
            {text}
        </StyledTypographyDetail>
    </div>
)

export const StyledTypographyMain = styled(Title)({
    fontSize: "28px",
    lineHeight: "32px",
    letterSpacing: "0.5px",
    color: "#0A1E28",
})

export const StyledTypographyText = styled(Title)({
    fontSize: "12px",
    lineHeight: "18px",
    letterSpacing: "0.5px",
    color: "#0A1E28",
})

export const HeadingAndDesc: React.FC<{
    text?: React.ReactNode
    subText?: React.ReactNode
    comparisonPercentage?: number
}> = ({ text, subText, comparisonPercentage }) => (
    <div
        style={{
            display: "block",
        }}
    >
        <Stack gap={5}>
            <StyledTypographyMain
                sx={{
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                }}
                fw="bold"
                variant="lg"
                fz={30}
                mb={6}
            >
                {text}
            </StyledTypographyMain>
            {/* <StyledTypographyText>{subText}</StyledTypographyText> */}
            <StyledTypographyText
                c={
                    comparisonPercentage && comparisonPercentage >= 0
                        ? "green"
                        : "red"
                }
            >
                <Group gap={5} mt={4}>
                    {comparisonPercentage && comparisonPercentage >= 0 ? (
                        <IconArrowUp color="green" size={14} />
                    ) : (
                        <IconArrowDown color="red" size={14} />
                    )}
                    <Text
                        fz={12}
                        c={
                            comparisonPercentage && comparisonPercentage >= 0
                                ? "green"
                                : "red"
                        }
                    >
                        {comparisonPercentage}%
                    </Text>
                    <Text
                        fz={12}
                        c={
                            comparisonPercentage && comparisonPercentage >= 0
                                ? "green"
                                : "red"
                        }
                    >
                        <Text fz={11} c={"#868686"}>
                            vs. last month
                        </Text>
                    </Text>
                </Group>
            </StyledTypographyText>
        </Stack>
    </div>
)

export default FeaturedCards
