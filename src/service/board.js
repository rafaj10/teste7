import { get } from '../helpers/api_helper'
import * as helper from '../helpers/backend_helper'

export const fetchBoardById = (id) => {
  const tenant = helper.getDefaultTenantUrl()
  return get(`${tenant}/boards/${id}`)
}

export const fetchBoardList = () => {
  const tenant = helper.getDefaultTenantUrl()
  return get(`${tenant}/boards`)
}

function buildQueryString(filters) {
  let params = [];
  Object.keys(filters).forEach(key => {
    if (Array.isArray(filters[key])) {
      filters[key].forEach(value => {
        if (key === 'categories') {
          const categoryValue = value.split('|')[1];
          params.push(`${encodeURIComponent(key)}[]=${encodeURIComponent(categoryValue)}`);
        } else {
          params.push(`${encodeURIComponent(key)}[]=${encodeURIComponent(value)}`);
        }
      });
    } else if (filters[key] instanceof Date) {
      params.push(`${encodeURIComponent(key)}=${encodeURIComponent(filters[key].toISOString().split('T')[0])}`);
    } else if (filters[key] !== '') {
      params.push(`${encodeURIComponent(key)}=${encodeURIComponent(filters[key])}`);
    }
  });
  return params.join('&');
}

export const fetchBoardLeadList = (id, filters) => {
  const tenant = helper.getDefaultTenantUrl();
  if (filters && Object.keys(filters).length > 0) {
    const query = buildQueryString(filters);
    return get(`${tenant}/boards/${id}/leads?${query}`);
  } else {
    return get(`${tenant}/boards/${id}/leads`);
  }
}