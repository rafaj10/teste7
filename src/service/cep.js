import { get } from '../helpers/api_helper'

export const fetchCep = (cep) => {
  console.log('aeee' + `/tools/cep?q=${cep}`)
  return get(`/tools/cep?q=${cep}`)
}
