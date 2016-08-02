import './url.scss'

import React from 'react'

class Url extends React.Component {
  render () {
    return (
      <p><a className='url' target='_blank' rel='noopener noreferrer' href={this.props.url}>{this.props.linkLabel}</a></p>
    )
  }
}

export default Url
