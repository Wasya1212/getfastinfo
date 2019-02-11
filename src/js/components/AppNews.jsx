import React, { Component } from 'react'

class AppNews extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <section className="news-box">
        <div className="news-box__preview">
          <a href={this.props.url}>
            <img className="news-box__preview__image news-preview" src={this.props.previewImage} />
          </a>
        </div>
        <div className="news-box__info">
          <div className="news-box__info__source">
            <span>source</span>
            <strong>{this.props.author}</strong>
          </div>
          <div className="news-box__info__date">
            <span>{this.props.date}</span>
          </div>
        </div>
        <div className="news-box__description">
          <h3 className="news-box__description__title news-title">
            <a href={this.props.url}>{this.props.title}</a>
          </h3>
          <p className="news-box__description__text news-description">{this.props.children}</p>
        </div>
      </section>
    )
  }
}

export default AppNews
