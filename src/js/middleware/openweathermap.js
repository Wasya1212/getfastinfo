const API_KEY = '5caa848ebab7974b3799258afabab482'

export default class OpenWeatherMap {
  constructor(api_key, options = {}) {
    this.api_key = api_key || API_KEY
    this.options = options
  }

  getCurrentWeatherInfoByGeolocation = async (lon = 0, lat = 0) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${this.api_key}${this.options.units == 'metric' ? '&units=metric' : ''}`)
    return await response.json()
  }

  getForecastWeatherInfoByGeolocation = async (lon = 0, lat = 0) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&APPID=${this.api_key}${this.options.units == 'metric' ? '&units=metric' : ''}`)
    return await response.json()
  }
}
