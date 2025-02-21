import * as SecureStore from 'expo-secure-store'
import { getState } from '../../zustand/auth'

import axios from 'axios'

const api = axios.create({
  baseURL: 'https://jgupuri-back.onrender.com/api',
})

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },

  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        await SecureStore.deleteItemAsync('accessToken')
        const { showSignInModal } = getState()
        showSignInModal()
      }
    } else {
      console.log('Error without response:', error.message)
    }

    return Promise.reject(error)
  }
)
export default api
