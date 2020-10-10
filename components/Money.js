const Money = {
  format: (amount, currency) => {
    if (currency === "USDC") {
      return `$${Money.number(amount, currency)}`
    } else {
      throw "Currency not supported"
    }
  },
  number: (amount, currency) => {
    if (currency === "USDC") {
      return `${Math.floor(amount / 100)}.${("00" + amount % 100).slice(-2)}`
    } else {
      throw "Currency not supported"
    }
  }
}

export default Money;
