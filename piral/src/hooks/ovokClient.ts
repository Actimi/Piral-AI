import { DocumentReference } from "@medplum/fhirtypes"
import { useMedplum } from "@medplum/react"
import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios"
import { showErrorMessage, showSuccessMessage } from "../utils/validation"

// Create a function to initialize the Axios instance with the token
const createOvokClient = (): AxiosInstance => {
    const medplum = useMedplum()
    const instance = axios.create({
        baseURL: import.meta.env.VITE_OVOK_BASE_URL,
    })

    // Add a request interceptor to include the Authorization header
    instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
        if (config.headers) {
            config.headers["Authorization"] =
                `Bearer ${medplum.getAccessToken()}`
        }
        return config
    })

    return instance
}

export async function uploadFile(
    fileInput: File,
    accessToken: string | undefined
): Promise<DocumentReference | undefined> {
    const myHeaders = new Headers()

    myHeaders.append("Authorization", `Bearer ${accessToken}`)

    const formData = new FormData()
    formData.append("file", fileInput)

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formData,
        redirect: "follow" as RequestRedirect,
    }

    try {
        const response = await fetch(
            import.meta.env.VITE_OVOK_BASE_URL + "binary/single",
            requestOptions
        )

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }

        return response.json()
    } catch (error) {
        throw new Error(`HTTP error! Status: ${error}`)
    }
}

export async function downloadFile(
    url: string | undefined,
    fileName: string,
    accessToken: string
) {
    if (!url) return
    try {
        const response = await fetch(url, {
            method: "GET",

            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/octet-stream",
            },
            credentials: "include",
        })
        const blob = await response.blob()
        const downloadUrl = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = downloadUrl
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(downloadUrl)
        showSuccessMessage("Download successful.")
    } catch (err) {
        console.error(`Error while fetching ${fileName}: `, err)
        showErrorMessage("Download failed.")
    }
}

export default createOvokClient
