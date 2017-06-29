export const maxLength = (max) => (value, previousVal) => {
  return value.length <= max ? value : previousVal
}
