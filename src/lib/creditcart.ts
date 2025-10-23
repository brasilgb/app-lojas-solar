export function getCardBrandName (cardNumber: string): string | null {
  const numbers = cardNumber.replace(/[^0-9]+/g, '')

  const brands = {
    amex: /^3[47][0-9]{13}$/,
  }

  const match = Object.entries(brands).find(([_, value]) => {
    if (value.test(numbers)) {
      return true
    }
    return false
  })

  if (match) {
    return match[0]
  }

  return null
}