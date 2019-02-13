import React, { Component } from 'react'

class AppCurrency extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <section className="currency-box">
        <h3>{`Exchange by 100 ${this.props.base} on ${this.props.date}`}</h3>
        {
          Object.keys(this.props.rates).map((rate, index) => (
            <article key={`exchange-${index}`} className="currency-box__exchange">
              <span className="currency-box__exchange__name">{rate}</span>
              <span className="currency-box__exchange__value">{(this.props.rates[rate] * 100).toFixed(2)}</span>
            </article>
          ))
        }
      </section>
    )
  }
}

export default AppCurrency
