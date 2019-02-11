import React, { Component } from 'react'

import { Line } from 'react-chartjs-2';

class AppWeather extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <h2>Line Example</h2>
        <Line data={{
          labels: this.props.weather.map(weather => {
            return weather.dt_txt
          }),
          datasets: [
            {
              label: `Weather and Forecast in ${this.props.city} ${this.props.country}`,
              fill: false,
              lineTension: 0.1,
              backgroundColor: 'rgba(75,192,192,0.4)',
              borderColor: 'rgba(75,192,192,1)',
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: 'rgba(75,192,192,1)',
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: 'rgba(75,192,192,1)',
              pointHoverBorderColor: 'rgba(220,220,220,1)',
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: this.props.weather.map(weather => {
                return weather.main.temp
              }),
              options: {
        				title: {
        					text: 'Chart.js Time Scale'
        				},
        				scales: {
        					xAxes: [{
        						type: 'time',
        						time: {
        							tooltipFormat: 'll HH:mm'
        						},
        						scaleLabel: {
        							display: true,
        							labelString: 'Date'
        						}
        					}],
        					yAxes: [{
        						scaleLabel: {
        							display: true,
        							labelString: 'value'
        						}
        					}]
        				},
        			}
            }
          ]
        }} />
      </div>
    )
  }
}

export default AppWeather
