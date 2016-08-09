import './url.scss'

import React from 'react'
import classNames from 'classnames'

class Url extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      isButton: false
    }
  }

  componentWillMount () {
    // check if it's presented as a button
    if (this.props.tags.indexOf('boac_presentation::link-button') >= 0) {
      this.setState({isButton: true})
    }
  }

  render () {
    // if there is no linkLabel use the regular label instead
    let linkText = this.props.linkLabel ? this.props.linkLabel : this.props.label
    let urlClasses = classNames(
      'url',
      { 'button': this.state.isButton }
    )

    return (
      <p><a className={urlClasses} href={this.props.url}>{linkText}</a></p>
    )
  }
}

export default Url
