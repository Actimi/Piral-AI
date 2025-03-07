import { Button, MantineStyleProp } from "@mantine/core"
import React from "react"
import { PropsWithChildren, useState } from "react"

interface Props extends PropsWithChildren {
    onClick: () => void
    isLastButton?: boolean
}

export default function TabButton({ children, onClick, isLastButton }: Props) {
    const [hover, setHover] = useState(false)

    const style: MantineStyleProp = {
        color: "black",
        border: "#999 1px solid",
        borderRightWidth: isLastButton ? 1 : 0,
        backgroundColor: hover ? "#eee" : "inherit",
    }

    return (
        <Button
            color="white"
            style={style}
            onClick={onClick}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            {children}
        </Button>
    )
}
