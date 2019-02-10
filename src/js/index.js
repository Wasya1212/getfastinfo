getIpInfo()
  .then(async ipInfo => ({
    ipInfo,
    rates: await getRatesByCountryCode(ipInfo.countryCode),
    weather: await getForecastWeatherInfoByGeolocation(ipInfo.lon, ipInfo.lat),
    currentWeather: await getCurrentWeatherInfoByGeolocation(ipInfo.lon, ipInfo.lat)
  }))
  .then(userInfo => {
    console.log(userInfo.rates)
    console.log(userInfo.weather)
    console.log(userInfo.currentWeather)
    console.log(userInfo.ipInfo)
  })
  .catch(err => {
    console.error(err)
  })

async function getIpInfo() {
  const response = await fetch('http://ip-api.com/json/', { method: 'GET' })
  return await response.json()
}

async function getRatesByCountryCode(currencyCountryCode) {
  if (!currencyCountryCode) {
    throw new Error('Any country code for searching currency exchange not found!')
  }

  let rates = Object.create(null)

  if (currencyCountryCode === 'UA') {
    const response = await fetch('https://ratesapi.io/api/latest?base=USD', { method: 'GET' })
    const json = await response.json()

    const USD_TO_UAN = 26.95
    const currencies = Object.keys(json.rates)

    currencies.map((rate, index) => {
      rates[currencies[index]] = json.rates[rate] / USD_TO_UAN
    })
  } else {
    const response = await fetch(`https://ratesapi.io/api/latest?base=${currencyCountryCode}`, { method: 'GET' })
    const json = await response.json()

    rates = json.rates
  }

  return rates
}
//18d231507c2245f6b886ac83c8f009e2
async function getCurrentWeatherInfoByGeolocation(lon = 0, lat = 0) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=5caa848ebab7974b3799258afabab482&units=metric`)
  return await response.json()
}

async function getForecastWeatherInfoByGeolocation(lon = 0, lat = 0) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&APPID=5caa848ebab7974b3799258afabab482&units=metric`)
  return await response.json()
}

const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('18d231507c2245f6b886ac83c8f009e2');

newsapi.v2.topHeadlines({
  city: 'lviv',
  language: 'ua',
  country: 'ua',
  sortBy: 'relevancy',
}).then(response => {
  console.log(response);
});

// async function getNewsBy
