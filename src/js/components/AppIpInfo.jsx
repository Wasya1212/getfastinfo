import React, { Component } from 'react'

class AppIpInfo extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <section className="ip-info-box">
        <h3>Your additional info by IP data</h3>
        {
          Object.keys(this.props.ipInfo).map((key, index) => (
            <div key={`ipInfo-${index}`} className="ip-info-box__category">
              <span className="ip-info-box__category__name">{key}</span>
              <span className="ip-info-box__category__value">{this.props.ipInfo[key].toString()}</span>
            </div>
          ))
        }
      </section>
    )
  }
}

export default AppIpInfo
