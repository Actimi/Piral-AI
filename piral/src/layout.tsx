import { MantineProvider } from "@mantine/core"
import { Loading, MedplumProvider } from "@medplum/react"
import { ComponentsState } from "piral"
import * as React from "react"

import "@medplum/react/styles.css"
import { App } from "./App"

import { emotionTransform, MantineEmotionProvider } from "@mantine/emotion"
import { ModalsProvider } from "@mantine/modals"
import { QueryClient, QueryClientProvider } from "react-query"
import { medplum } from "."
import NotFoundPage from "./components/404Page"
import { SignInPage } from "./components/SignInPage"
import { theme } from "./theme"

const queryClient = new QueryClient()

export const layout: Partial<ComponentsState> = {
    ErrorInfo: () => <NotFoundPage />,

    LoadingIndicator: () => (
        <MedplumProvider medplum={medplum}>
            <MantineProvider theme={theme} stylesTransform={emotionTransform}>
                <MantineEmotionProvider>
                    <Loading />
                </MantineEmotionProvider>
            </MantineProvider>
        </MedplumProvider>
    ),

    Layout: ({ children }) => {
        if (medplum.isLoading()) {
            return null
        }
        if (!medplum.isAuthenticated()) {
            return (
                <MedplumProvider medplum={medplum}>
                    <MantineProvider
                        theme={theme}
                        stylesTransform={emotionTransform}
                    >
                        <MantineEmotionProvider>
                            <SignInPage />
                        </MantineEmotionProvider>
                    </MantineProvider>
                </MedplumProvider>
            )
        }

        return (
            <React.StrictMode>
                <MedplumProvider medplum={medplum}>
                    <MantineProvider
                        theme={theme}
                        stylesTransform={emotionTransform}
                    >
                        <MantineEmotionProvider>
                            <ModalsProvider>
                                <QueryClientProvider client={queryClient}>
                                    <App children={children} />
                                </QueryClientProvider>
                            </ModalsProvider>
                        </MantineEmotionProvider>
                    </MantineProvider>
                </MedplumProvider>
            </React.StrictMode>
        )
    },
}
