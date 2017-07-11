export const maxLength = (max) => (value) => {
  return value.length <= max ? value : value.substring(0, max)
}
