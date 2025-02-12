import { create } from 'zustand'
import * as SecureStore from 'expo-secure-store'

const useAuthStore = create((set) => ({
  isSignedIn: false,
  isVerified: false,
  token: null,
  isSignInModalVisible: false,

  setToken: async (token) => {
    try {
      await SecureStore.setItemAsync('accessToken', token)
      set({ token, isSignedIn: true, isVerified: true })
    } catch (error) {
      console.error('Error setting token:', error)
    }
  },

  setInfo: async (email, number) => {
    try {
      console.log('setting info', email, number)
      await SecureStore.setItemAsync('email', email)
      await SecureStore.setItemAsync('number', `${number}`)
    } catch (error) {
      console.error('Error setting info:', error)
    }
  },

  showSignInModal: async (isVisible) => {
    set({ isSignInModalVisible: isVisible })
  },

  verifyUser: async () => {
    set({ isVerified: true })
  },

  signOut: async () => {
    await SecureStore.deleteItemAsync('accessToken')
    set({ token: null, isSignedIn: false, isVerified: false })
  },

  checkLoginStatus: async () => {
    const token = await SecureStore.getItemAsync('accessToken')
    console.log(token)

    if (token) {
      set({ token, isSignedIn: true, isVerified: true })
    } else {
      set({ token: null, isSignedIn: false, isVerified: false })
    }
  },
}))
export const getState = useAuthStore.getState
export default useAuthStore
