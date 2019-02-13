import React, { Component } from 'react'

import AppHeader from './components/AppHeader.jsx'
import AppNews from './components/AppNews.jsx'
import AppWeather from './components/AppWeather.jsx'
import AppCurrency from './components/AppCurrency.jsx'
import AppIpInfo from './components/AppIpInfo.jsx'
import AppFooter from './components/AppFooter.jsx'

import IpAPI from './middleware/ipdata.js'
import RatesAPI from './middleware/ratesapi.js'
import OpenWeatherMapAPI from './middleware/openweathermap.js'
import GoogleNewsAPI from './middleware/googlenews.js'

// default data if something was wrong in fetch
import {
  ipInfo as AppIpDefaultData,
  currency as AppCurrencyDefaultData,
  weather as AppWeatherDefaultData,
  news as AppNewsDefaultData
} from './utils/data.js'

const ipapi = new IpAPI('728e2a59e039be0527cffa984bed6e6c0450d5e6ffdae8c578398938')
const ratesapi = new RatesAPI('123i456dont789have012any345api678key901')
const openweathermapapi = new OpenWeatherMapAPI('5caa848ebab7974b3799258afabab482', { units: 'metric' })
const googlenewsapi = new GoogleNewsAPI('18d231507c2245f6b886ac83c8f009e2')

export default class App extends Component {
  constructor(props) {
    super(props)
    // set initial state for data (for debug)
    this.state = {
      news: AppNewsDefaultData,
      weather: AppWeatherDefaultData,
      ipInfo: AppIpDefaultData,
      currency: AppCurrencyDefaultData
    }
  }

  componentDidMount() {
    // get user data from different resources
    ipapi
      .getCompactInfo()
      .then(async ipInfo => ({
        ipInfo: ipInfo,
        rates: await ratesapi.getRatesByCountryCode(ipInfo.country_code),
        weather: await openweathermapapi.getForecastWeatherInfoByGeolocation(ipInfo.longitude, ipInfo.latitude),
        news: await googlenewsapi.getTopHeadlines({city: ipInfo.city, language: ipInfo.country_code, country: ipInfo.country_code })
      }))
      .then(userInfo => {
        this.setState({
          news: userInfo.news.articles,
          weather: userInfo.weather,
          currency: userInfo.rates,
          ipInfo: userInfo.ipInfo
        })
      })
      .catch(err => {
        // inform user about problem
        alert("We can't load data! You see default values...")
        // log error
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
            <AppWeather city={this.state.ipInfo.city} country={this.state.ipInfo.country_code} weather={this.state.weather.list} />
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

// news api time parser
function getNormalTime(date) {
  return `${date.split('T')[0]} ${date.split('T')[1].slice(0,-4)}`
}
