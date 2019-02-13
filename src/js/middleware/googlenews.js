import NewsAPI from "newsapi"

const API_KEY = '18d231507c2245f6b886ac83c8f009e2'

export default class GoogleNews {
  constructor(api_key) {
    this.api_key = api_key || API_KEY
    this.newsapi = new NewsAPI(this.api_key)
  }

  getTopHeadlines = async ({ city, language, country }) => {
    return await this.newsapi.v2.topHeadlines({
      city: city,
      language: language,
      country: country,
      sortBy: 'relevancy',
    })
  }
}
