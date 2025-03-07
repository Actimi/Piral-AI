import "@mantine/dates/styles.css"

import "@mantine/charts/styles.css"
import "@mantine/core/styles.css"
import "@mantine/notifications/styles.css"
import "@medplum/react/styles.css"

import React from "react"
import "./App.css"

import DaikoLogo from "./components/ui/DaikoLogo"

import { Dashboard } from "./components/dashboard/Dashboard"

import { IconHome } from "@tabler/icons-react"
import { AppShell } from "./components/appshell/AppShell"

export function App({ children }): JSX.Element | null {
    return (
        <AppShell
            logo={<DaikoLogo width={50} />}
            resourceTypeSearchDisabled
            pathname={location.pathname}
            menus={[
                {
                    links: [
                        { icon: <IconHome />, label: "Dashboard", href: "/" },
                    ],
                },
            ]}
        >
            {location.pathname === "/" && <Dashboard />}
            {children}
        </AppShell>
    )
}
