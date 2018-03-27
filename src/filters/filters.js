let format = (value, isPercentage) => {
  if (isPercentage === false) {
    return value ? value : '-'
  }
  return value ? value + '%' : '-'
}
export {
  format
}
