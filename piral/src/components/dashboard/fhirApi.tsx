/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { MedplumClient } from "@medplum/core"
import axios from "axios"
import { AuditEvent, BundleEntry } from "@medplum/fhirtypes"

export const fetchPatients = async (
    medplum: any,
    query: string,
    filters?: any
) => {
    const token = medplum.getAccessToken()
    try {
        const response = await axios.post(
            `/fhir/R4/$graphql`,
            {
                query: query,
                filters: filters,
            },
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            }
        )
        return response.data
    } catch (error) {
        console.error(error)
        return error
    }
}

export const fetchPatientDetails = async (medplum: any, query: string) => {
    const token = medplum.getAccessToken()
    try {
        const response = await axios.post(
            `/fhir/R4/$graphql`,
            {
                query: query,
            },
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            }
        )
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export const exportMedicalRecord = async (
    medplum: MedplumClient,
    patientId: string,
    resources: string[],
    isGetOldDocFromS3: boolean,
    exportType: string,
    isPII: boolean
) => {
    try {
        const token = medplum.getAccessToken()
        const resourcesParam = resources.join(",")
        const isGetOldDocFromS3Param = isGetOldDocFromS3 ? true : false
        const isPIIParam = isPII ? true : false

        const url = `/api/pragmaconnect/export-patient-data?patientId=${patientId}&resources=${resourcesParam}&isGetOldDocFromS3=${isGetOldDocFromS3Param}&exportType=${exportType}&isPII=${isPIIParam}`

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            responseType: "blob",
        })
        return response
    } catch (error) {
        console.error("An error occurred:", error)
        return null
    }
}

export const getPatientClinicalData = async (medplum: any, patientId: any) => {
    const token = medplum.getAccessToken()
    try {
        const response = await axios.get(
            `/api/pragmaconnect/get-patient-clinical-data-document-date?patientId=${patientId}`,
            {
                headers: {
                    Accept: "application/fhir+json",
                    Authorization: "Bearer " + token,
                },
            }
        )
        return response
    } catch (error) {
        console.error(error)
        return null
    }
}

export const getAiAssistantPatientData = async (
    medplum: MedplumClient,
    patientId: string,
    question: string,
    conversationSessionId: string
) => {
    const token = medplum.getAccessToken()
    if (patientId) {
        try {
            let url = `/api/pragmaconnect/ai-asssistant-chat?patientId=${patientId}&question=${question}`
            if (conversationSessionId) {
                url = url + `&sessionId=${conversationSessionId}`
            }
            const response = await axios.get(url, {
                headers: {
                    Accept: "application/fhir+json",
                    Authorization: "Bearer " + token,
                },
            })
            return response
        } catch (error) {
            console.error(error)
            return null
        }
    }
    return null
}

export const updateAIAssistantChat = async (medplum: any, payload: any) => {
    const token = medplum.getAccessToken()
    try {
        const response = await axios.put(
            "/api/pragmaconnect/update-ai-assistant-chat",
            payload,
            {
                headers: {
                    Accept: "application/fhir+json",
                    Authorization: "Bearer " + token,
                },
            }
        )
        return response
    } catch (error) {
        console.error(error)
        return null
    }
}

export const getAiAssistantChatHistory = async (medplum: MedplumClient) => {
    const token = medplum.getAccessToken()

    try {
        let url = `/fhir/R4/Communication?_count=500&_offset=0&_sort=-_lastUpdated&_total=accurate&category=chatbot`
        const response = await axios.get(url, {
            headers: {
                Accept: "application/fhir+json",
                Authorization: "Bearer " + token,
            },
        })
        return response.data
    } catch (error) {
        console.error(error)
        return null
    }
}

export const updateChatHistoryTitle = async (medplum: any) => {
    const token = medplum.getAccessToken()
    try {
        const url = `/api/pragmaconnect/update-ai-assistant-chat-title`
        const response = await axios.put(
            url,
            {},
            {
                headers: {
                    Accept: "application/fhir+json",
                    Authorization: "Bearer " + token,
                },
            }
        )
        return response
    } catch (error) {
        console.error(error)
        return null
    }
}

export const getOrganization = async (medplum: any, orgId: any) => {
    const token = medplum.getAccessToken()
    try {
        const response = await axios.get(`/fhir/R4/Organization/${orgId}`, {
            headers: {
                Accept: "application/fhir+json",
                Authorization: "Bearer " + token,
            },
        })
        return response
    } catch (error) {
        console.error(error)
        return null
    }
}

export const updateOrganization = async (
    medplum: any,
    orgData: any,
    orgId: any
) => {
    const token = medplum.getAccessToken()
    try {
        const response = await axios.put(
            `fhir/R4/Organization/${orgId}`,
            orgData,
            {
                headers: {
                    Accept: "application/fhir+json",
                    Authorization: "Bearer " + token,
                },
            }
        )
        return response
    } catch (error) {
        console.error(error)
        return null
    }
}

export const createOrganizations = async (medplum: any, orgData: any) => {
    const token = medplum.getAccessToken()
    try {
        const response = await axios.post(`fhir/R4/Organization`, orgData, {
            headers: {
                Accept: "application/fhir+json",
                Authorization: "Bearer " + token,
            },
        })
        return response
    } catch (error) {
        console.error(error)
        return null
    }
}

export const createPractitioner = async (
    medplum: any,
    practitionerData: any
) => {
    const token = medplum.getAccessToken()
    try {
        const response = await axios.post(
            `/api/pragmaconnect/register-admin-user`,
            practitionerData,
            {
                headers: {
                    Accept: "application/fhir+json",
                    Authorization: "Bearer " + token,
                },
            }
        )
        return response
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const createNewSession = async (medplum: any, payload: any) => {
    const token = medplum.getAccessToken()

    const response = await axios.post(
        `/api/pragmaconnect/save-patient-session`,
        payload,
        {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        }
    )
    return response.data
}

export const createTelehealthSession = async (medplum: any, payload: any) => {
    const token = medplum.getAccessToken()

    const response = await axios.post(
        `/api/pragmaconnect/create-telehealth-session`,
        payload,
        {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        }
    )
    return response.data
}

export const exportClinicalNote = async (medplum: any, patientId: any) => {
    try {
        const token = medplum.getAccessToken()

        const response = await axios.get(
            `/api/pragmaconnect/download-clinical-note?id=${patientId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: "blob",
            }
        )
        return response
    } catch (error) {
        console.error("An error occurred:", error)
        return null
    }
}

export const getClinicalNotes = async (medplum: any, patientId: any) => {
    const token = medplum.getAccessToken()
    try {
        const response = await axios.get(
            `/api/analytics/get-clinical-note-by-patientId?patientId=${patientId}`,
            {
                headers: {
                    Accept: "application/fhir+json",
                    Authorization: "Bearer " + token,
                },
            }
        )
        return response
    } catch (error) {
        console.error(error)
        return null
    }
}

export const loadClinicalStudy = async (
    medplum: MedplumClient,
    studyId: string
) => {
    try {
        const response = await medplum.post(
            `/fhir/R4/Bot/3313d556-40da-449c-a9bf-549ec99541c9/$execute`,
            { studyId }
        )
        return response
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const clinicalStudyData = async (
    medplum: MedplumClient,
    studyId: string,
    patientId: string
) => {
    try {
        const response = await medplum.post(
            `/api/pragmaconnect/patient-eligibility-clinical-study`,
            { patientId, studyId }
        )
        return response
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const clinicalStudyNotification = async (
    medplum: MedplumClient,
    patientId: string,
    patientName: string,
    researchStudyId: string,
    researchStudyName: string,
    researchSubjectId: string,
    message: string
) => {
    try {
        const response = await medplum.post(
            `/api/pragmaconnect/generate-clinical-study-notification`,
            {
                patientId,
                patientName,
                researchStudyId,
                researchStudyName,
                researchSubjectId,
                message,
            }
        )
        return response
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const getQualifiedPatients = async (medplum: MedplumClient) => {
    try {
        const response = await medplum.get(
            "api/pragmaconnect/get-qualified-patients"
        )
        return response
    } catch (error) {
        console.error(error)
        return null
    }
}

export const getAllClinicalStudyConsents = async (medplum: MedplumClient) => {
    try {
        const response = await medplum.get(
            "api/pragmaconnect/track-all-clinical-study-consents"
        )
        return response
    } catch (error) {
        console.error(error)
        return null
    }
}

export const getClinicalTrialNotification = async (medplum: MedplumClient) => {
    try {
        const response = await medplum.get(
            `fhir/R4/CommunicationRequest?_count=20&_offset=0&_sort=-_lastUpdated&_total=accurate&group-identifier=Clinical+Trial+Notification`
        )
        return response
    } catch (error) {
        console.error(error)
        return null
    }
}

export const consentStatus = async (
    medplum: MedplumClient,
    researchSubjectId: string
) => {
    try {
        const response = await medplum.get(
            `fhir/R4/ResearchSubject/${researchSubjectId}`
        )
        return response
    } catch (error) {
        console.error(error)
        return null
    }
}

export const getCoverageInfo = async (medplum: any, patientId: any) => {
    const token = medplum.getAccessToken()
    try {
        const response = await axios.get(
            `/api/analytics/get-coverage-info-by-patientId?patientId=${patientId}`,
            {
                headers: {
                    Accept: "application/fhir+json",
                    Authorization: "Bearer " + token,
                },
            }
        )
        return response
    } catch (error) {
        console.error(error)
        return null
    }
}

export const getClaimInfo = async (medplum: any, patientId: any) => {
    const token = medplum.getAccessToken()
    try {
        const response = await axios.get(
            `/api/analytics/get-claim-info-by-patientId?patientId=${patientId}`,
            {
                headers: {
                    Accept: "application/fhir+json",
                    Authorization: "Bearer " + token,
                },
            }
        )

        return response
    } catch (error) {
        console.error(error)
        return null
    }
}

export const getAllOrganization = async (medplum: MedplumClient) => {
    const token = medplum.getAccessToken()
    try {
        const response = await axios.get(`fhir/R4/Organization`, {
            headers: {
                Accept: "application/fhir+json",
                Authorization: "Bearer " + token,
            },
        })
        return response
    } catch (error) {
        console.error(error)
        return null
    }
}

export const statisticCounts = async (medplum: MedplumClient) => {
    const token = medplum.getAccessToken()
    try {
        const response = await axios.get(`api/analytics/statistic-counts`, {
            headers: {
                Accept: "application/fhir+json",
                Authorization: "Bearer " + token,
            },
        })
        return response
    } catch (error) {
        console.error(error)
        return null
    }
}

export const integratedOrganizations = async (medplum: MedplumClient) => {
    const token = medplum.getAccessToken()
    try {
        const response = await axios.get(
            `api/analytics/integrated-organizations?`,
            {
                headers: {
                    Accept: "application/fhir+json",
                    Authorization: "Bearer " + token,
                },
            }
        )
        return response
    } catch (error) {
        console.error(error)
        return null
    }
}

export const patientCountsByOrganization = async (
    medplum: MedplumClient,
    ehr: string
) => {
    const token = medplum.getAccessToken()
    try {
        const response = await axios.get(
            `api/analytics/patient-counts-by-organization?ehr=${ehr}
    `,
            {
                headers: {
                    Accept: "application/fhir+json",
                    Authorization: "Bearer " + token,
                },
            }
        )
        return response
    } catch (error) {
        console.error(error)
        return null
    }
}

export const patientCountsByEhr = async (medplum: MedplumClient) => {
    const token = medplum.getAccessToken()
    try {
        const response = await axios.get(
            `api/analytics/get-patient-counts-by-ehr
    `,
            {
                headers: {
                    Accept: "application/fhir+json",
                    Authorization: "Bearer " + token,
                },
            }
        )
        return response
    } catch (error) {
        console.error(error)
        return null
    }
}

export const ehrList = async (medplum: MedplumClient) => {
    const token = medplum.getAccessToken()
    try {
        const response = await axios.get(
            `api/analytics/get-ehr-list
    `,
            {
                headers: {
                    Accept: "application/fhir+json",
                    Authorization: "Bearer " + token,
                },
            }
        )
        return response
    } catch (error) {
        console.error(error)
        return null
    }
}

export const getDemographic = async (medplum: MedplumClient, ehr: string) => {
    const token = medplum.getAccessToken()
    try {
        const response = await axios.get(
            `api/analytics/get-demographic-data?ehr=${ehr}
    `,
            {
                headers: {
                    Accept: "application/fhir+json",
                    Authorization: "Bearer " + token,
                },
            }
        )
        return response
    } catch (error) {
        console.error(error)
        return null
    }
}

export const registeredPatients = async (medplum: MedplumClient) => {
    const token = medplum.getAccessToken()
    try {
        const response = await axios.get(
            `api/analytics/get-newly-registered-patients
    `,
            {
                headers: {
                    Accept: "application/fhir+json",
                    Authorization: "Bearer " + token,
                },
            }
        )
        return response
    } catch (error) {
        console.error(error)
        return null
    }
}

export const getOrganizationsByEhr = async (
    medplum: MedplumClient,
    ehr: string
) => {
    const token = medplum.getAccessToken()
    try {
        const response = await axios.get(
            `api/analytics/get-organizations-by-ehr?ehr=${ehr}

    `,
            {
                headers: {
                    Accept: "application/fhir+json",
                    Authorization: "Bearer " + token,
                },
            }
        )
        return response
    } catch (error) {
        console.error(error)
        return null
    }
}

export const organizationPatientDemographics = async (
    medplum: MedplumClient,
    ehr: string,
    org: string
) => {
    const token = medplum.getAccessToken()
    try {
        const response = await axios.get(
            `api/analytics/organization-patient-demographics?ehr=${ehr}&organizationId=${org}

    `,
            {
                headers: {
                    Accept: "application/fhir+json",
                    Authorization: "Bearer " + token,
                },
            }
        )
        return response
    } catch (error) {
        console.error(error)
        return null
    }
}

export const organizationRegisteredPatients = async (
    medplum: MedplumClient,
    ehr: string,
    org: string
) => {
    const token = medplum.getAccessToken()
    try {
        const response = await axios.get(
            `api/analytics/organization-registered-patients?ehr=${ehr}&organizationId=${org}`,
            {
                headers: {
                    Accept: "application/fhir+json",
                    Authorization: "Bearer " + token,
                },
            }
        )
        return response
    } catch (error) {
        console.error(error)
        return null
    }
}

export const getAssessmentList = async (
    medplum: MedplumClient,
    assessmentId: string
) => {
    const token = medplum.getAccessToken()
    try {
        const response = await axios.get(
            `fhir/R4/QuestionnaireResponse?_id=${assessmentId}`,
            {
                headers: {
                    Accept: "application/fhir+json",
                    Authorization: "Bearer " + token,
                },
            }
        )
        return response
    } catch (error) {
        console.error(error)
        return null
    }
}

export const analyticsSummary = async (
    medplum: MedplumClient,
    patientId: string
) => {
    const token = medplum.getAccessToken()
    try {
        const response = await axios.get(
            `api/analytics/get-step-count-analytics?patientId=${patientId}`,
            {
                headers: {
                    Accept: "application/fhir+json",
                    Authorization: "Bearer " + token,
                },
            }
        )
        return response
    } catch (error) {
        console.error(error)
        return null
    }
}

export const heartRateAnalytics = async (
    medplum: MedplumClient,
    patientId: string
) => {
    const token = medplum.getAccessToken()
    try {
        const response = await axios.get(
            `api/analytics/get-heart-rate-analytics?patientId=${patientId}`,
            {
                headers: {
                    Accept: "application/fhir+json",
                    Authorization: "Bearer " + token,
                },
            }
        )
        return response
    } catch (error) {
        console.error(error)
        return null
    }
}

export const weightAnalytics = async (
    medplum: MedplumClient,
    patientId: string
) => {
    const token = medplum.getAccessToken()
    try {
        const response = await axios.get(
            `api/analytics/get-weight-analytics?patientId=${patientId}`,
            {
                headers: {
                    Accept: "application/fhir+json",
                    Authorization: "Bearer " + token,
                },
            }
        )
        return response
    } catch (error) {
        console.error(error)
        return null
    }
}

export const bloodPressureAnalytic = async (
    medplum: MedplumClient,
    patientId: string
) => {
    const token = medplum.getAccessToken()
    try {
        const response = await axios.get(
            `api/analytics/get-blood-pressure-analytics?patientId=${patientId}`,
            {
                headers: {
                    Accept: "application/fhir+json",
                    Authorization: "Bearer " + token,
                },
            }
        )
        return response
    } catch (error) {
        console.error(error)
        return null
    }
}

export const assessmentInsightsSummary = async (
    medplum: MedplumClient,
    patientId: string
) => {
    const token = medplum.getAccessToken()
    try {
        const response = await axios.get(
            `api/pragmaconnect/get-patient-assessment-insights?patient_id=${patientId}`,
            {
                headers: {
                    Accept: "application/fhir+json",
                    Authorization: "Bearer " + token,
                },
            }
        )
        return response
    } catch (error: any) {
        console.error(error)
        return null
    }
}

export const progressReportSummary = async (
    medplum: MedplumClient,
    patientId: string
) => {
    const token = medplum.getAccessToken()
    try {
        const response = await axios.get(
            `api/pragmaconnect/get-patient-clinical-notes-insights?patient_id=${patientId}`,
            {
                headers: {
                    Accept: "application/fhir+json",
                    Authorization: "Bearer " + token,
                },
            }
        )
        return response
    } catch (error: any) {
        console.error(error)
        return null
    }
}

export const getNotifications = async (medplum: MedplumClient) => {
    const token = medplum.getAccessToken()
    try {
        const response = await axios.get(
            `fhir/R4/AuditEvent?_count=200&_offset=0&_sort=-_lastUpdated&_total=accurate&outcome:not=4`,
            {
                headers: {
                    Accept: "application/fhir+json",
                    Authorization: "Bearer " + token,
                },
            }
        )
        const filteredEntries = {
            data: {
                entry: response.data.entry.filter(
                    (entry: BundleEntry) =>
                        (entry.resource as AuditEvent)?.outcomeDesc
                ),
            },
        }
        return filteredEntries
    } catch (error) {
        console.error(error)
        return null
    }
}

export const organizationStatisticCounts = async (
    medplum: MedplumClient,
    orgId: string
) => {
    const token = medplum.getAccessToken()
    try {
        const response = await axios.get(
            `api/analytics/organization-statistic-counts?id=${orgId}`,
            {
                headers: {
                    Accept: "application/fhir+json",
                    Authorization: "Bearer " + token,
                },
            }
        )
        return response
    } catch (error) {
        console.error(error)
        return null
    }
}

export const appointmentsByOrganization = async (
    medplum: MedplumClient,
    orgId: string
) => {
    const token = medplum.getAccessToken()
    try {
        const response = await axios.get(
            `api/analytics/get-appointments-by-organization?organizationId=${orgId}`,
            {
                headers: {
                    Accept: "application/fhir+json",
                    Authorization: "Bearer " + token,
                },
            }
        )
        return response
    } catch (error) {
        console.error(error)
        return null
    }
}

export const practitionersByOrganization = async (
    medplum: MedplumClient,
    orgId: string
) => {
    const token = medplum.getAccessToken()
    try {
        const response = await axios.get(
            `api/analytics/get-practitioners-by-organization?organizationId=${orgId}`,
            {
                headers: {
                    Accept: "application/fhir+json",
                    Authorization: "Bearer " + token,
                },
            }
        )
        return response
    } catch (error) {
        console.error(error)
        return null
    }
}
export const patientsByOrganization = async (
    medplum: MedplumClient,
    orgId: string
) => {
    const token = medplum.getAccessToken()
    try {
        const response = await axios.get(
            `api/analytics/organization-patient-list?organizationId=${orgId}`,
            {
                headers: {
                    Accept: "application/fhir+json",
                    Authorization: "Bearer " + token,
                },
            }
        )
        return response
    } catch (error) {
        console.error(error)
        return null
    }
}

export const serviceRequest = async (medplum: MedplumClient, orgId: string) => {
    const token = medplum.getAccessToken()
    try {
        const response = await axios.get(
            `api/analytics/get-service-requests-by-organization?organizationId=${orgId}`,
            {
                headers: {
                    Accept: "application/fhir+json",
                    Authorization: "Bearer " + token,
                },
            }
        )
        return response
    } catch (error) {
        console.error(error)
        return null
    }
}

export const getZoomSignature = async (
    medplum: MedplumClient,
    payload: any
) => {
    const token = medplum.getAccessToken()

    const response = await axios.post(
        `/api/pragmaconnect/join-telehealth-session`,
        payload,
        {
            headers: {
                Accept: "application/fhir+json",
                Authorization: "Bearer " + token,
            },
        }
    )
    return response.data
}

export const submitTranscription = async (
    medplum: MedplumClient,
    payload: any
) => {
    const token = medplum.getAccessToken()

    const response = await axios.post(
        `/api/pragmaconnect/end-telehealth-session`,
        payload,
        {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        }
    )
    return response.data
}
