/**
 * axios setup to use mock service
 */

import axios from "axios"

// Create an instance for VITE_BASE_URL
const axiosVite = axios.create({ baseURL: import.meta.env.VITE_BASE_URL })

// Create an instance for API_BASE_URL
const axiosAPI = axios.create({ baseURL: import.meta.env.VITE_API_URL })

export default { axiosAPI, axiosVite }
