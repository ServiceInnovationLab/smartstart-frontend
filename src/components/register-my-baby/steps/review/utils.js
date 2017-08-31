import moment from 'moment'

export const formatDate = (d) =>
  moment(d).format('DD MMM YYYY')

export const formatAddress = (address) =>
  [address.line1, address.suburb, address.line2].join(', ')
