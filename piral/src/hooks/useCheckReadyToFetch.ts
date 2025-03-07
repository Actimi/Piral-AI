import { useMedplumContext } from "@medplum/react"

export function useReadyToFetch(): boolean {
    const { medplum, profile } = useMedplumContext()

    return !!(medplum && profile)
}
