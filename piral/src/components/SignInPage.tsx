import { Title, useMantineTheme } from "@mantine/core"
import { SignInForm, useMedplumNavigate } from "@medplum/react"

import DaikoLogo from "../components/ui/DaikoLogo"
import React from "react"

export function SignInPage(): JSX.Element {
    const theme = useMantineTheme()
    const navigate = useMedplumNavigate()
    return (
        <SignInForm
            onSuccess={() => {
                navigate("/")
                window.location.reload()
            }}
        >
            <DaikoLogo width={50} />
            <Title fz={20} fw={500} mt={20} c={theme.colors.brand[0]}>
                Sign in to DAIKO
            </Title>
            <Title fz={18} fw={600} mb={10}>
                AI First Healthcare Information System
            </Title>
        </SignInForm>
    )
}
