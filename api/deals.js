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
}

const dealsService = new DealsService()

export default dealsService
