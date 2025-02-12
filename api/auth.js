import axios from '../libs/axios.js'

class AuthService {
  async signUp(email, mobileNumber, password, notificationToken) {
    const response = await axios.post(`/auth/signUp`, {
      email,
      mobileNumber,
      password,
      notificationToken,
    })
    return response.data
  }
  async signIn(email, password, notificationToken) {
    const response = await axios.post(`/auth/signIn`, {
      email,
      password,
      ...(notificationToken && { notificationToken }),
    })
    console.log('sign in response, ', response)

    return response.data
  }
  async sendVerifyCode(email) {
    console.log(1, email)

    const response = await axios.get(`/auth/resend-code`, {
      email,
    })

    return response.data
  }

  async verifyEmail(email, code) {
    const response = await axios.post(`/auth/verify-email`, {
      code,
      email,
    })
    return response.data
  }
  async signInWithGoogle(token, notificationToken) {
    const response = await axios.post(`/auth/google`, {
      idToken: token,
      notificationToken,
    })
    return response.data
  }
  async getProfile() {
    console.log(123)

    const response = await axios.get(`/auth/user-profile`)
    return response.data
  }
}

const authService = new AuthService()

export default authService
