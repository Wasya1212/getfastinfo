const API_KEY = '728e2a59e039be0527cffa984bed6e6c0450d5e6ffdae8c578398938'

export default class Ipdata {
  constructor(api_key) {
    this.api_key = api_key || API_KEY
  }

  getFullInfo = async () => {
    const response = await fetch(`https://api.ipdata.co/?api-key=${this.api_key}`, { method: 'GET' })
    return await response.json()
  }

  getCompactInfo = async () => {
    const response = await fetch(`https://api.ipdata.co/?api-key=${this.api_key}`, { method: 'GET' })
    const json = await response.json()

    return {
      ip: json.ip,
      city: json.city,
      region: json.region,
      country_name: json.country_name,
      country_code: json.country_code,
      latitude: json.latitude,
      longitude: json.longitude,
      postal_code: json.postal,
      language: json.languages[0].name,
      currency: json.currency.code,
      time_zone: json.time_zone.name
    }
  }
}
