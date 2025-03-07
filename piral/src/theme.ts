"use client"

import {
    ActionIcon,
    Badge,
    Button,
    Modal,
    TextInput,
    createTheme,
} from "@mantine/core"

export const theme = createTheme({
    headings: {
        sizes: {
            h1: {
                fontSize: "2rem",
                lineHeight: "2.0",
                fontWeight: "bolder",
            },
            h2: {
                fontSize: "1.8rem",
                fontWeight: "900",
            },
            h3: {
                fontWeight: "900",
            },
        },
    },
    fontSizes: {
        xs: "0.6875rem",
        sm: "0.875rem",
        md: "0.950rem",
        lg: "1.0rem",
        xl: "1.125rem",
    },
    fontFamily: "Inter, sans-serif",
    colors: {
        brand: [
            "#7F56D9",
            "#97B7CC",
            "#6CA1BD",
            "#428BAE",
            "#2F738E",
            "#00658B",
            "#7F56D9",
            "#004161",
            "#00304C",
            "#001F37",
            "#FFFFFF",
            "#F9FAFB",
            "#F4EBFF",
            "#DCDCDC",
        ],
        fontColors: [
            "#FFFFFF",
            "#F8F9FA",
            "#D0D5DD",
            "#CFD4DC",
            "#475467",
            "#667085",
            "#344054",
            "#344054",
            "#344054",
            "#101828",
        ],
    },
    primaryColor: "brand",
    components: {
        Badge: Badge.extend({
            styles: {
                label: { textTransform: "capitalize", fontWeight: "normal" },
            },
        }),
        ActionIcon: ActionIcon.extend({
            defaultProps: {
                variant: "subtle",
                color: "#475467",
            },
        }),
        TextInput: TextInput.extend({
            styles: {
                label: {
                    fontWeight: "normal",
                },
            },
        }),
        Modal: Modal.extend({
            styles: {
                title: {
                    fontWeight: "bold",
                },
            },
        }),
        Button: Button.extend({
            styles: {
                root: {
                    overflow: "visible",
                },
            },
        }),
        Card: {
            styles: {
                root: {
                    borderRadius: 8,
                    boxShadow: "none",
                },
            },
            defaultProps: {
                shadow: "xs",
                bg: "white",
                px: "md",
                py: "sm",
            },
        },
        Input: {
            styles: {
                root: {
                    borderRadius: 8,
                    border: "1px solid #D0D5DD",
                },
            },
        },
        Drawer: {
            styles: {
                root: {
                    borderRadius: 0,
                },
            },
        },
        Text: {
            styles: {
                root: {
                    color: "#475467",
                },
            },
        },
        Title: {
            styles: {
                root: {
                    color: "#101828",
                },
            },
        },
    },
})
