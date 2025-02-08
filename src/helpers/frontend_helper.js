import 'moment/locale/pt-br'
import moment from 'moment/moment'

export const dateToView = (date) => {
  if (!date) return ''
  const d = new Date(date)
  moment.locale('pt-br')
  return moment(d).locale('').format('DD/MM/yyyy')
}

export const dateToHour = (date) => {
  if (!date) return ''
  const d = new Date(date)
  moment.locale('pt-br')
  return moment(d).format('HH:mm')
}

export const dateToViewAndHour = (date) => {
  if (!date) return ''
  const d = new Date(date)
  moment.locale('pt-br')
  return moment(d).format('DD MMMM, ddd HH:mm')
}

