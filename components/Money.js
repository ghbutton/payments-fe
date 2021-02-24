const Money = {
  fullString: (amount, currency) => {
    if (currency === "USDC") {
      return `$${Money.stringAmount(amount, currency)}`
    } else {
      throw "Currency not supported"
    }
  },
  stringAmount: (amount, currency) => {
    if (currency === "USDC") {
      return `${Math.floor(amount / 100)}.${("00" + amount % 100).slice(-2)}`
    } else {
      throw "Currency not supported"
    }
  },
  decimalAmount: (stringAmount, currency) => {
    if (currency === "USDC") {
      const [dollar, cents] = stringAmount.split(".");
      const leadingCents = (cents || "0").substring(0, 2);

      // Ugh I can believe you can add strings to numbers if you wanted to
      // javascript is annoying
      return (Number(dollar) * 100) + Number(leadingCents);
    } else {
      throw "Currency not supported"
    }
  }
}

export default Money;
