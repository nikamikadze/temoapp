import { create } from 'zustand'
import * as SecureStore from 'expo-secure-store'

const useAuthStore = create((set) => ({
  isSignedIn: false,
  isVerified: false,
  token: null,

  setToken: async (token) => {
    await SecureStore.setItemAsync('accessToken', token)
    set({ token, isSignedIn: true, isVerified: true })
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

export default useAuthStore
