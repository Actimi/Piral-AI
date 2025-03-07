import { Image } from "@mantine/core"
import React from "react"
import logoL from "../../assets/images/Logo-L.svg"
import logoL2 from "../../assets/images/Actimi-L2.png"
interface Props {
    width: number
    full?: boolean
}

export default function DaikoLogo({ width, full }: Props) {
    return full ? (
        <Image src={logoL} w={width} />
    ) : (
        <Image src={logoL2} w={width} />
    )
}
