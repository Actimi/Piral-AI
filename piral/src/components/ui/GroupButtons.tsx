import React, { useEffect } from "react"
import { Button, Group } from "@mantine/core"

interface GroupButtonsProps {
    value: { id: number; name: string }[]
    buttonHandleClick: (data: { id: number; name: string }) => void
    activeTab: number
}

const GroupButtons = (props: GroupButtonsProps) => {
    const [btnActive, setBtnActive] = React.useState(props?.activeTab)
    const handleClick = (data: { id: number; name: string }) => {
        setBtnActive(data.id)
        props.buttonHandleClick(data)
    }

    useEffect(() => {
        setBtnActive(props.activeTab)
    }, [props.activeTab])

    return (
        <Group>
            {props?.value.map((data) => (
                <Button
                    key={data.id}
                    onClick={() => handleClick(data)}
                    style={{
                        backgroundColor:
                            btnActive === data.id ? "#F9F5FF" : "#ffffff",
                        color: btnActive === data.id ? "#6941C6" : "#667085",
                    }}
                >
                    {data.name}
                </Button>
            ))}
        </Group>
    )
}

export default GroupButtons
