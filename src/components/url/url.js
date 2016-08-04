import './url.scss'

import React from 'react'

class Url extends React.Component {
  render () {
    // if there is no linkLabel use the regular label instead
    let linkText = this.props.linkLabel ? this.props.linkLabel : this.props.label

    return (
      <p><a className='url' href={this.props.url}>{linkText}</a></p>
    )
  }
}

export default Url
