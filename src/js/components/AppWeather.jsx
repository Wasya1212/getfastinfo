import React, { Component } from 'react'

import { Line } from 'react-chartjs-2';

class AppWeather extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="weather-box">
        <div className="weather-box__current-weather">
          <div className="weather-box__current-weather__status">
            <span>Current Status</span>
            <span>{this.props.weather[0].weather[0].description}</span>
          </div>
          <div className="weather-box__current-weather__temperature">
            <span>Temperature</span>
            <span>{Math.floor(this.props.weather[0].main.temp)}</span>
          </div>
          <div className="weather-box__current-weather__pressure">
            <span>Pressure</span>
            <span>{this.props.weather[0].main.pressure}</span>
          </div>
          <div className="weather-box__current-weather__humidity">
            <span>Humidity</span>
            <span>{this.props.weather[0].main.humidity}</span>
          </div>
        </div>
        <Line options={{
          title: {
            text: `Weather and Forecast in ${this.props.city} ${this.props.country}`,
            display: true
          },
          scales: {
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Date'
              }
            }],
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Temperature'
              }
            }]
          },
        }} data={{
          labels: this.props.weather.map(weather => {
            return weather.dt_txt
          }),
          datasets: [
            {
              label: `Temperature °C`,
              fill: true,
              lineTension: 0.1,
              backgroundColor: 'rgba(75, 126, 193, 0.4)',
              borderColor: 'rgba(75, 133, 193, 1)',
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: 'rgba(75, 136, 193, 1)',
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: 'rgba(75, 140, 193, 1)',
              pointHoverBorderColor: 'rgba(221, 221, 221, 1)',
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: this.props.weather.map(weather => {
                return Math.floor(weather.main.temp)
              })
            }
          ]
        }} />
      </div>
    )
  }
}

export default AppWeather
