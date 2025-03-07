import { ButtonGroup } from "@mantine/core"
import { IconCircleCheck, IconUserPlus } from "@tabler/icons-react"
import React, { Dispatch, SetStateAction } from "react"
import { Studies } from "../../types/enums"

interface Props {
    setActiveTab: Dispatch<SetStateAction<Studies>>
    studyId: string | null
    setSelectedStudyId: Dispatch<SetStateAction<string | null>>
}

const buttonStyle = {
    opacity: 0.5,
    cursor: "pointer",
}

export default function TrialsEligibilityButtons({
    setActiveTab,
    studyId,
    setSelectedStudyId,
}: Props) {
    return (
        <ButtonGroup style={{ gap: 5 }}>
            <IconCircleCheck
                style={buttonStyle}
                onClick={() => {
                    setActiveTab(Studies.Eligibility)
                    setSelectedStudyId(studyId)
                }}
            />
            <IconUserPlus
                style={buttonStyle}
                onClick={() => {
                    setActiveTab(Studies.Qualified)
                    setSelectedStudyId(studyId)
                }}
            />
        </ButtonGroup>
    )
}
