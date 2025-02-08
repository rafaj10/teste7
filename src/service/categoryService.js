import { get } from '../helpers/api_helper'
import * as helper from '../helpers/backend_helper'

const categoryService = {
  getCategories: async (categoryType) => {
    const tenant = helper.getDefaultTenantUrl()
    const response = await get(`categories/${categoryType}`)
    return response
  },
}

export default categoryService
