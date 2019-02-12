import React, { Component } from 'react'

import AppHeader from './components/AppHeader.jsx'
import AppNews from './components/AppNews.jsx'
import AppWeather from './components/AppWeather.jsx'
import AppCurrency from './components/AppCurrency.jsx'
import AppIpInfo from './components/AppIpInfo.jsx'
import AppFooter from './components/AppFooter.jsx'

import NewsAPI from "newsapi"

// default data if something was wrong in fetch
import DATA from './data.js'

// process currency for default value
setRequiredCurrenciesByCountryCode(DATA.currency, 'US')

// set news api private key
const newsapi = new NewsAPI('18d231507c2245f6b886ac83c8f009e2')

export default class App extends Component {
  constructor(props) {
    super(props)
    // set initial state for data (for debug)
    this.state = {
      news: DATA.news || [],
      weather: DATA.weather || [],
      ipInfo: DATA.ipInfo || {},
      currency: DATA.currency || {}
    }
  }

  componentDidMount() {
    // get user data from different resources
    getIpInfo()
      .then(async ipInfo => ({
        ipInfo,
        rates: await getRatesByCountryCode(ipInfo.countryCode),
        weather: await getForecastWeatherInfoByGeolocation(ipInfo.lon, ipInfo.lat),
        // currentWeather: await getCurrentWeatherInfoByGeolocation(ipInfo.lon, ipInfo.lat),
        news: await getNewsByLocation({city: ipInfo.city, language: ipInfo.countryCode, country: ipInfo.countryCode }, newsapi)
      }))
      .then(userInfo => {
        // process currency
        setRequiredCurrenciesByCountryCode(userInfo.rates, userInfo.ipInfo.countryCode)
        // and return result
        return userInfo
      })
      .then(userInfo => {
        this.setState({
          news: userInfo.news.articles,
          weather: userInfo.weather,
          currency: userInfo.rates,
          ipInfo: userInfo.ipInfo
        })
      })
      .catch(err => {
        console.error(err)
      })
  }

  render() {
    return (
      <div className="content">
        <AppHeader />
        <main className="main">
          <center><h2>Currency Exchange & IP Info</h2></center>
          <aside className="location-info">
            <div className="ipinfo-section">
              <AppIpInfo ipInfo={this.state.ipInfo}/>
            </div>
            <div className="currency-section">
              <AppCurrency rates={this.state.currency.rates} date={this.state.currency.date} base={this.state.currency.base} />
            </div>
          </aside>
          <center><h2>Weather Info</h2></center>
          <div className="weather-section">
            <AppWeather city={this.state.ipInfo.city} country={this.state.ipInfo.countryCode} weather={this.state.weather.list} />
          </div>
          <center><h2>Latest News</h2></center>
          <div className="news-section">
            {
              this.state.news.map((news, index) => (
                <AppNews key={`news-${index}`} author={news.author} title={news.title} date={getNormalTime(news.publishedAt)} url={news.url} previewImage={news.urlToImage}>{news.description}</AppNews>
              ))
            }
          </div>
        </main>
        <AppFooter />
      </div>
    )
  }
}

// weather api time parser
function getNormalTime(date) {
  return `${date.split('T')[0]} ${date.split('T')[1].slice(0,-4)}`
}

// choose needed currencies
function setRequiredCurrenciesByCountryCode(currency, countryCode) {
  let setRequired = (currency, rates) => {
    for (let prop in currency.rates) {
      if (rates.indexOf(prop) == -1) {
        delete currency.rates[prop]
      }
    }
  }

  // we can choose only 2 types currencies
  // categories. For UA & other countries
  if (countryCode == 'UA') {
    currency.base = 'UAN'
    setRequired(currency, [ 'USD', 'RUB', 'PLN', 'EUR' ])
  } else {
    setRequired(currency, [ 'EUR', 'RUB', 'AUD' ])
  }

  // creating response data
  const ratesNames = Object.keys(currency.rates)
  currency.rates = ratesNames.map((rate, index) => {
    return {
      name: ratesNames[index],
      value: currency.rates[rate]
    }
  })
}

// get ip data
async function getIpInfo() {
  const response = await fetch('http://ip-api.com/json/', { method: 'GET' })
  return await response.json()
}

// get currency data
async function getRatesByCountryCode(currencyCountryCode) {
  if (!currencyCountryCode) {
    throw new Error('Any country code for searching currency exchange not found!')
  }

  let rates = Object.create(null)

  // api doesn`t have UAN currency
  // then create own by USD value
  if (currencyCountryCode === 'UA') {
    const response = await fetch('https://ratesapi.io/api/latest?base=USD', { method: 'GET' })
    const json = await response.json()

    // in normal app we can take this
    // value by anouther request
    const USD_TO_UAN = 26.95
    const currencies = Object.keys(json.rates)

    currencies.map((rate, index) => {
      json.rates[currencies[index]] = json.rates[rate] / USD_TO_UAN
    })

    // add USD to rates list
    json.rates['USD'] = 1 / USD_TO_UAN

    rates = json
  } else {
    const response = await fetch(`https://ratesapi.io/api/latest?base=${currencyCountryCode}`, { method: 'GET' })
    rates = await response.json()
  }

  return rates
}

// get weather data
async function getCurrentWeatherInfoByGeolocation(lon = 0, lat = 0) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=5caa848ebab7974b3799258afabab482&units=metric`)
  return await response.json()
}

async function getForecastWeatherInfoByGeolocation(lon = 0, lat = 0) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&APPID=5caa848ebab7974b3799258afabab482&units=metric`)
  return await response.json()
}

// get news data
async function getNewsByLocation({ city, language, country }, newsapi) {
  return await newsapi.v2.topHeadlines({
    city,
    language,
    country,
    sortBy: 'relevancy',
  })
}
