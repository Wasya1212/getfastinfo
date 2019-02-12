import React, { Component } from 'react'

import AppHeader from './components/AppHeader.jsx'
import AppNews from './components/AppNews.jsx'
import AppWeather from './components/AppWeather.jsx'
import AppCurrency from './components/AppCurrency.jsx'
import AppIpInfo from './components/AppIpInfo.jsx'

import NewsAPI from "newsapi"
import DATA from './data.js'

setRequiredCurrenciesByCountryCode(DATA.currency, 'US')

const newsapi = new NewsAPI('18d231507c2245f6b886ac83c8f009e2')

const title = 'My Minimal React Webpack Babel Setup'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      news: DATA.news || []
    }
  }

  componentDidMount() {
    console.log(DATA.currency)
    // getIpInfo()
    //   .then(async ipInfo => ({
    //     ipInfo,
    //     rates: await getRatesByCountryCode(ipInfo.countryCode),
    //     weather: await getForecastWeatherInfoByGeolocation(ipInfo.lon, ipInfo.lat),
    //     currentWeather: await getCurrentWeatherInfoByGeolocation(ipInfo.lon, ipInfo.lat),
    //     news: await getNewsByLocation({city: ipInfo.city, language: ipInfo.countryCode, country: ipInfo.countryCode }, newsapi)
    //   }))
    //   .then(userInfo => {
    //     console.log(userInfo.rates)
    //     console.log(userInfo.weather)
    //     console.log(userInfo.currentWeather)
    //     console.log(JSON.stringify(userInfo.news.articles))
    //     console.log(userInfo.ipInfo)
    //     return userInfo
    //   })
    //   .then(userInfo => {
    //     // this.setState({
    //     //   news: userInfo.news.articles
    //     // })
    //   })
    //   .catch(err => {
    //     console.error(err)
    //   })
  }

  render() {
    return (
      <main className="main">
        <AppHeader />
        <center><h2>Currency Exchange & IP Info</h2></center>
        <aside className="location-info">
          <div className="ipinfo-section">
            <AppIpInfo ipInfo={DATA.ipInfo}/>
          </div>
          <div className="currency-section">
            <AppCurrency rates={DATA.currency.rates} date={DATA.currency.date} base={DATA.currency.base} />
          </div>
        </aside>
        <center><h2>Weather Info</h2></center>
        <div className="weather-section">
          <AppWeather city="Lviv" country="UA" weather={DATA.weather.list} />
        </div>
        <center><h2>Latest News</h2></center>
        <div className="news-section">
          {
            this.state.news.map((news, index) => (
              <AppNews key={`news-${index}`} author={news.author} title={news.title} date={getNormalTime(news.publishedAt)} url={news.url} previewImage={news.urlToImage}>{news.description}</AppNews>
            ))
          }
        </div>
        <div>{title}</div>
      </main>
    )
  }
}

function getNormalTime(date) {
  return `${date.split('T')[0]} ${date.split('T')[1].slice(0,-4)}`
}

function setRequiredCurrenciesByCountryCode(currency, countryCode) {
  let setRequired = (currency, rates) => {
    for (let prop in currency.rates) {
      if (rates.indexOf(prop) == -1) {
        delete currency.rates[prop]
      }
    }
  }

  if (countryCode === 'UA') {
    setRequired(currency, [ 'USD', 'RUB', 'PLN', 'EUR' ])
  } else {
    setRequired(currency, [ 'EUR', 'RUB', 'AUD' ])
  }

  const ratesNames = Object.keys(currency.rates)
  currency.rates = ratesNames.map((rate, index) => {
    return {
      name: ratesNames[index],
      value: currency.rates[rate]
    }
  })
}

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

async function getCurrentWeatherInfoByGeolocation(lon = 0, lat = 0) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=5caa848ebab7974b3799258afabab482&units=metric`)
  return await response.json()
}

async function getForecastWeatherInfoByGeolocation(lon = 0, lat = 0) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&APPID=5caa848ebab7974b3799258afabab482&units=metric`)
  return await response.json()
}

async function getNewsByLocation({ city, language, country }, newsapi) {
  return await newsapi.v2.topHeadlines({
    city,
    language,
    country,
    sortBy: 'relevancy',
  })
}

export default App
