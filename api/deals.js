import axios from '../libs/axios.js'

class DealsService {
  async getList() {
    const response = await axios.get(`/deals/list`)
    return response.data
  }
  async buyDeal(dealId, count) {
    const response = await axios.post(`/deals/buy-deal`, {
      dealId,
      count,
    })
    return response.data
  }
  async quitDeal(dealId) {
    const response = await axios.post(`/deals/quit-deal`, {
      dealId,
    })
    return response.data
  }
  async userDeals(status) {
    const response = await axios.get(`/deals/user-deals`, {
      params: { status },
    })
    return response.data
  }
  async userDealCount(dealId) {
    const response = await axios.get(`/deals/user-deal-count`, {
      params: { dealId },
    })
    return response.data
  }
  async activateVoucher(voucherId) {
    const response = await axios.post(`/deals/activate-voucher`, {
      voucherId,
    })

    return response.data
  }
  async sendWish(title) {
    const response = await axios.post(`/deals/send-wish`, {
      title,
    })

    return response.data
  }
}

const dealsService = new DealsService()

export default dealsService
