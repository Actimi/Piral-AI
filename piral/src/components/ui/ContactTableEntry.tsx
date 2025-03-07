import { ActionIconGroup, Group, HoverCard } from "@mantine/core"
import { IconMail, IconPhone } from "@tabler/icons-react"
import { getEmail, getPhone } from "../../utils/tables"
import { Person } from "../../types/types"
import React from "react"

interface Props {
    entry: Person
}

export default function ContactTableEntry({ entry }: Props) {
    return (
        <Group>
            <ActionIconGroup style={{ gap: 10 }}>
                <HoverCard>
                    <HoverCard.Target>
                        <IconMail size={18} />
                    </HoverCard.Target>
                    <HoverCard.Dropdown>
                        {getEmail(entry) || "no email"}
                    </HoverCard.Dropdown>
                </HoverCard>
                <HoverCard>
                    <HoverCard.Target>
                        <IconPhone size={18} />
                    </HoverCard.Target>
                    <HoverCard.Dropdown>
                        {getPhone(entry) || "no phone"}
                    </HoverCard.Dropdown>
                </HoverCard>
            </ActionIconGroup>
        </Group>
    )
}
