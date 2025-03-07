import * as React from "react"
import { createRoot } from "react-dom/client"
import {
    createInstance,
    Piral,
    createStandardApi,
    ErrorComponentsState,
} from "piral"
import { layout } from "./layout"
import { MedplumClient } from "@medplum/core"
import { theme } from "./theme"

// change to your feed URL here (either using feed.piral.cloud or your own service)
const feedUrl = "https://feed.piral.cloud/api/v1/pilet/daiko-piral"

export const medplum = new MedplumClient({
    onUnauthenticated: () => {
        window.location.href = "/"
    },
    baseUrl: "https://fhir.ovok.com/",
    clientId: "",
})

export const errors: Partial<ErrorComponentsState> = {
    not_found: () => (
        <div>
            <p className="error">
                Could not find the requested page. Are you sure it exists?
            </p>
            <p>Go back</p>
        </div>
    ),
}
const instance = createInstance({
    state: {
        components: layout,
        errorComponents: errors,
    },
    plugins: [...createStandardApi()],
    requestPilets() {
        return fetch(feedUrl)
            .then((res) => res.json())
            .then((res) => res.items)
    },
})

instance.root.setData("medplum", medplum)
instance.root.setData("mantinetheme", theme)

const root = createRoot(document.querySelector("#app"))

root.render(<Piral instance={instance} />)
