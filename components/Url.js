const Url = {
  queryParams: (url) => {
    // copied from: https://www.jskap.com/blog/React-Native-parse-url-query-params/
    let regex = /[?&]([^=#]+)=([^&#]*)/g,
    params = {},
      match

    while ((match = regex.exec(url))) {
      params[match[1]] = match[2]
    }
    return params;
  }
}

export default Url;
