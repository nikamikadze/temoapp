import axios from '../libs/axios.js'

class AuthService {
  async signUp(email, mobileNumber, password) {
    const response = await axios.post(`/auth/signUp`, {
      email,
      mobileNumber,
      password,
    })
    return response.data
  }
  async signIn(email, password) {
    const response = await axios.post(`/auth/signIn`, {
      email,
      password,
    })
    console.log('sign in response, ', response)

    return response.data
  }
  async sendVerifyCode(email) {
    console.log('code sent to: ', email)

    const response = await axios.get(`/auth/verify-code`, {
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
}

const authService = new AuthService()

export default authService
