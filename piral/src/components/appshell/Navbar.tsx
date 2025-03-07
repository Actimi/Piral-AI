import { AppShell as MantineAppShell, ScrollArea, Space } from "@mantine/core"
import { useMedplumNavigate } from "@medplum/react-hooks"
import React, {
    Fragment,
    MouseEventHandler,
    ReactNode,
    SyntheticEvent,
    useState,
} from "react"
import { BookmarkDialog } from "./BookmarkDialog"

import { ResourceTypeInput } from "./ResourceTypeInput"

import { MedplumLink } from "@medplum/react"
import { Menu } from "piral"

export interface NavbarLink {
    readonly icon?: JSX.Element
    readonly label?: string
    readonly href: string
}

export interface NavbarMenu {
    readonly title?: string
    readonly links?: NavbarLink[]
}

export interface NavbarProps {
    readonly pathname?: string
    readonly searchParams?: URLSearchParams
    readonly menus?: NavbarMenu[]
    readonly closeNavbar: () => void
    readonly displayAddBookmark?: boolean
    readonly resourceTypeSearchDisabled?: boolean
}

export function Navbar(props: NavbarProps): JSX.Element {
    const navigate = useMedplumNavigate()
    const activeLink = getActiveLink(
        props.pathname,
        props.searchParams,
        props.menus
    )
    const [bookmarkDialogVisible, setBookmarkDialogVisible] = useState(false)

    function onLinkClick(e: SyntheticEvent, to: string): void {
        e.stopPropagation()
        e.preventDefault()
        navigate(to)
        if (window.innerWidth < 768) {
            props.closeNavbar()
        }
    }

    function navigateResourceType(resourceType: string | undefined): void {
        if (resourceType) {
            navigate(`/${resourceType}`)
        }
    }

    return (
        <>
            <MantineAppShell.Navbar>
                <ScrollArea p="xs">
                    {!props.resourceTypeSearchDisabled && (
                        <MantineAppShell.Section mb="sm">
                            <ResourceTypeInput
                                key={window.location.pathname}
                                name="resourceType"
                                placeholder="Resource Type"
                                maxValues={0}
                                onChange={(newValue) =>
                                    navigateResourceType(newValue)
                                }
                            />
                        </MantineAppShell.Section>
                    )}
                    <MantineAppShell.Section grow>
                        {props.menus?.map((menu) => (
                            <Fragment key={`menu-${menu.title}`}>
                                {menu.links?.map((link) => (
                                    <NavbarLink
                                        key={link.href}
                                        to={link.href}
                                        active={link.href === activeLink?.href}
                                        onClick={(e) =>
                                            onLinkClick(e, link.href)
                                        }
                                    >
                                        <NavLinkIcon
                                            to={link.href}
                                            icon={link.icon}
                                        />
                                        <span>{link.label}</span>
                                    </NavbarLink>
                                ))}
                            </Fragment>
                        ))}
                        <Menu type="general" />
                        {/* {props.displayAddBookmark && (
							<Button
								variant="subtle"
								size="xs"
								mt="xl"
								leftSection={<IconPlus size="0.75rem" />}
								onClick={() => setBookmarkDialogVisible(true)}
							>
								Add Bookmark
							</Button>
						)} */}
                    </MantineAppShell.Section>
                </ScrollArea>
            </MantineAppShell.Navbar>
            {props.pathname && props.searchParams && (
                <BookmarkDialog
                    pathname={props.pathname}
                    searchParams={props.searchParams}
                    visible={bookmarkDialogVisible}
                    onOk={() => setBookmarkDialogVisible(false)}
                    onCancel={() => setBookmarkDialogVisible(false)}
                />
            )}
        </>
    )
}

interface NavbarLinkProps {
    readonly to: string
    readonly active: boolean
    readonly onClick: MouseEventHandler
    readonly children: ReactNode
}

function NavbarLink(props: NavbarLinkProps): JSX.Element {
    return (
        <MedplumLink
            onClick={props.onClick}
            to={props.to}
            sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                fontSize: "var(--mantine-font-size-sm)",
                color: "light-dark(var(--mantine-color-gray-7), var(--mantine-color-dark-1))",
                padding: "8px 12px",
                borderRadius: "var(--mantine-radius-sm)",
                fontWeight: 500,
                "&:hover": {
                    backgroundColor:
                        "light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))",
                    color: "light-dark(var(--mantine-color-black), var(--mantine-color-white))",
                    textDecoration: "none",
                    "& svg": {
                        color: "light-dark(var(--mantine-color-black), var(--mantine-color-white))",
                    },
                },
                "& svg": {
                    color: "light-dark(var(--mantine-color-gray-6), var(--mantine-color-dark-2))",
                    marginRight: "var(--mantine-spacing-sm)",
                    strokeWidth: 1.5,
                    width: 18,
                    height: 18,
                },
                ...(props.active && {
                    color: "var(--mantine-primary-color-filled)",
                    backgroundColor:
                        "light-dark(var(--mantine-primary-color-light), var(--mantine-primary-color-dark))",
                    "&:hover": {
                        color: "var(--mantine-primary-color-filled-hover)",
                        backgroundColor:
                            "light-dark(var(--mantine-primary-color-light-hover), var(--mantine-primary-color-dark-hover))",
                        "& svg": {
                            color: "var(--mantine-color-blue-light-color)",
                        },
                    },
                    "& svg": {
                        color: "var(--mantine-color-blue-light-color)",
                    },
                }),
            }}
        >
            {props.children}
        </MedplumLink>
    )
}

interface NavLinkIconProps {
    readonly to: string
    readonly icon?: JSX.Element
}

function NavLinkIcon(props: NavLinkIconProps): JSX.Element {
    if (props.icon) {
        return props.icon
    }
    return <Space w={30} />
}

/**
 * Returns the best "active" link for the menu.
 * In most cases, the navbar links are simple, and an exact match can determine which link is active.
 * However, we ignore some search parameters to support pagination.
 * But we cannot ignore all search parameters, to support separate links based on search filters.
 * So in the end, we use a simple scoring system based on the number of matching query search params.
 * @param currentPathname - The web browser current pathname.
 * @param currentSearchParams - The web browser current search parameters.
 * @param menus - Collection of navbar menus and links.
 * @returns The active link if one is found.
 */
function getActiveLink(
    currentPathname: string | undefined,
    currentSearchParams: URLSearchParams | undefined,
    menus: NavbarMenu[] | undefined
): NavbarLink | undefined {
    if (!currentPathname || !currentSearchParams || !menus) {
        return undefined
    }

    let bestLink = undefined
    let bestScore = 0

    for (const menu of menus) {
        if (menu.links) {
            for (const link of menu.links) {
                const score = getLinkScore(
                    currentPathname,
                    currentSearchParams,
                    link.href
                )
                if (score > bestScore) {
                    bestScore = score
                    bestLink = link
                }
            }
        }
    }

    return bestLink
}

/**
 * Calculates a score for a link.
 * Zero means "does not match at all".
 * One means "matches the pathname only".
 * Additional increases for each matching search parameter.
 * Ignores pagination parameters "_count" and "_offset".
 * @param currentPathname - The web browser current pathname.
 * @param currentSearchParams - The web browser current search parameters.
 * @param linkHref - A candidate link href.
 * @returns The link score.
 */
function getLinkScore(
    currentPathname: string,
    currentSearchParams: URLSearchParams,
    linkHref: string
): number {
    const linkUrl = new URL(linkHref, "https://example.com")
    if (currentPathname !== linkUrl.pathname) {
        return 0
    }
    const ignoredParams = ["_count", "_offset"]
    for (const [key, value] of linkUrl.searchParams.entries()) {
        if (ignoredParams.includes(key)) {
            continue
        }
        if (currentSearchParams.get(key) !== value) {
            return 0
        }
    }
    let count = 1
    for (const [key, value] of currentSearchParams.entries()) {
        if (ignoredParams.includes(key)) {
            continue
        }
        if (linkUrl.searchParams.get(key) === value) {
            count++
        }
    }
    return count
}
