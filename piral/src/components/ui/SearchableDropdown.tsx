import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { ComboboxData, Select } from "@mantine/core"
import { Patient, Practitioner, ResourceType } from "@medplum/fhirtypes"
import { getPersonItems } from "../../utils/helpers"
import React from "react"

interface Props {
    resourceType: ResourceType
    patients?: Patient[]
    practitioners?: Practitioner[]
    selectedPatient?: Patient
    selectedPractitioner?: Practitioner
    setSelectedPatient?: Dispatch<SetStateAction<Patient | undefined>>
    setSelectedPractitioner?: Dispatch<SetStateAction<Practitioner | undefined>>
    allowAll?: boolean
    required?: boolean
    hideLabel?: boolean
}

export default function SearchableDropdown({
    resourceType,
    patients,
    practitioners,
    selectedPatient,
    selectedPractitioner,
    setSelectedPatient,
    setSelectedPractitioner,
    allowAll = true,
    required = false,
    hideLabel = false,
}: Props) {
    const [value, setValue] = useState<string | null>(null)

    const handleSelect = (id: string | null) => {
        if (resourceType === "Patient" && patients) {
            setSelectedPatient &&
                setSelectedPatient(patients.find((p) => p.id === id)!)
        } else if (resourceType === "Practitioner" && practitioners) {
            setSelectedPractitioner &&
                setSelectedPractitioner(practitioners.find((p) => p.id === id)!)
        }
        setValue(id)
    }

    const getOptions = (): ComboboxData | undefined => {
        if (resourceType === "Practitioner" && practitioners) {
            if (allowAll) {
                return [
                    {
                        group: "All Practitioners",
                        items: [{ label: "All", value: "" }],
                    },
                    {
                        group: "Select Practitioner",
                        items: getPersonItems(practitioners),
                    },
                ]
            } else {
                return getPersonItems(practitioners)
            }
        } else if (resourceType === "Patient" && patients) {
            if (allowAll) {
                return [
                    {
                        group: "All Patients",
                        items: [{ label: "All", value: "" }],
                    },
                    {
                        group: "Select Patients",
                        items: getPersonItems(patients),
                    },
                ]
            } else {
                return getPersonItems(patients)
            }
        }
    }

    useEffect(() => {
        if (value) return
        function getInitialValue(): string | null {
            const val: string | undefined =
                resourceType === "Patient"
                    ? selectedPatient?.id
                    : selectedPractitioner?.id
            return val || null
        }
        setValue(getInitialValue())
    }, [resourceType, selectedPatient?.id, selectedPractitioner?.id, value])

    return (
        <Select
            label={hideLabel ? "" : `Select ${resourceType.toLowerCase()}`}
            placeholder={"Select"}
            searchable
            data={getOptions()}
            value={value}
            onChange={handleSelect}
            required={required}
            w="100%"
        />
    )
}
