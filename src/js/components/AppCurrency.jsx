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
          this.props.rates.map((currency, index) => (
            <article key={`exchange-${index}`} className="currency-box__exchange">
              <span className="currency-box__exchange__name">{currency.name}</span>
              <span className="currency-box__exchange__value">{(currency.value * 100).toFixed(2)}</span>
            </article>
          ))
        }
      </section>
    )
  }
}

export default AppCurrency
