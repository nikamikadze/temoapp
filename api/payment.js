import axios from '../libs/axios.js'

class PaymentsService {
  async createPayment(price, orderId, quantity, image) {
    const response = await axios.post(`/payment/create-payment`, {
      price: 0.01,
      orderId,
      quantity,
      image,
    })

    console.log(response.data)

    return response.data
  }
  async getDetails(orderId, dealId) {
    const response = await axios.get(
      `/payment/details?orderId=${orderId}&dealId=${dealId}`
    )
    console.log(response.data)

    return response.data
  }
}

const paymentsService = new PaymentsService()

export default paymentsService
