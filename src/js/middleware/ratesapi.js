const API_KEY = ''

export default class RatesAPI {
  constructor() {
    // empty :)
  }

  getRatesByCurrencyName = async (base = 'USD', rates) => {
    let json = Object.create(null)

    if (base == 'UAH') {
      json = await this.getRatesByCountryCode('UA')
    } else {
      const response = await fetch(`https://ratesapi.io/api/latest?symbols=${rates.join(',')}&base=${base}`, { method: 'GET' })
      json = await response.json()
    }

    return json
  }

  getRatesByCountryCode = async currencyCountryCode => {
    if (!currencyCountryCode) {
      throw new Error('Any country code for searching currency exchange not found!')
    }

    // get base currency
    // and necessary currencies
    // for current country
    const relatedRatesNames = getRelatedRatesNamesByCountryCode(currencyCountryCode)

    let rates = Object.create(null)

    // api doesn`t have UAH currency
    // then create own by USD value
    if (currencyCountryCode.toLowerCase() === 'ua') {
      // get all currencies
      const response = await fetch('https://ratesapi.io/api/latest?base=USD', { method: 'GET' })
      const json = await response.json()

      // in normal app we can take this
      // value by anouther request
      const USD_TO_UAN = 26.95
      const currencies = Object.keys(json.rates)

      try {
        for (let prop in json.rates) {
          if (relatedRatesNames.ratesNames.indexOf(prop) == -1) {
            // remove unnecessary currencies
            delete json.rates[prop]
          } else {
            // change rates exchange to UAH side
            json.rates[prop] /= USD_TO_UAN
          }
        }
      } catch (err) {
        console.error("Can`t delete unnecessary currencies in 'UA' request!")
      } finally {
        // change base currency to UAH
        json.base = relatedRatesNames.base
        // add USD to rates list
        json.rates['USD'] = 1 / USD_TO_UAN
      }

      rates = json
    } else {
      const response = await fetch(`https://ratesapi.io/api/latest?symbols=${relatedRatesNames.ratesNames.join(',')}&base=${relatedRatesNames.base}`, { method: 'GET' })
      rates = await response.json()
    }

    return rates
  }
}

function getRelatedRatesNamesByCountryCode(currencyCountryCode) {
  let ratesNames = []
  let base = ''

  switch (currencyCountryCode.toLowerCase()) {
    case 'ua': // for Ukraine
      ratesNames = [ 'USD', 'RUB', 'PLN', 'EUR' ]
      base = 'UAH'
      break;
    case 'ru': // for Russia
      ratesNames = [ 'USD', 'EUR' ]
      base = 'RUB'
      break;
    case 'se': // for Swedish
      ratesNames = [ 'USD', 'EUR', 'GBP', 'RUB' ]
      base = 'SEK'
      break;
    case 'gb': // for United Kingdom
      ratesNames = [ 'USD', 'EUR', 'PLN' ]
      base = 'GBP'
      break;
    case 'us': // for USA
      ratesNames = [ 'EUR', 'RUB', 'JPY' ]
      base = 'USD'
      break;
    case 'de': // for Germany
      ratesNames = [ 'USD', 'EUR', 'GBP' ]
      base = 'EUR'
      break;
    case 'jp': // for Japan
      ratesNames = [ 'USD', 'EUR', 'RUB' ]
      base = 'JPY'
      break;
    // ...
    // we can add more countries
    // ...
    default: // for Others countries
      ratesNames = [ 'USD', 'RUB', 'AUD' ]
      base = 'EUR'
  }

  return { base, ratesNames }
}
