import React, { PropTypes, Component } from 'react'
import classNames from 'classnames'

import './marker.scss'

class Marker extends Component {
  constructor (props) {
    super(props)

    this.state = {
      infoShown: false
    }

    this.showInfo = this.showInfo.bind(this)
    this.hideInfo = this.hideInfo.bind(this)
  }

  showInfo () {
    this.setState({ infoShown: true })
  }

  hideInfo () {
    // TODO only hide if leave combined region of box AND marker
    this.setState({ infoShown: false })
  }

  render () {
    const infoBoxClasses = classNames(
      'marker-info',
      { 'is-open': this.state.infoShown }
    )

    return (
      <div className='marker-box'>
        <div className='marker' onMouseOver={this.showInfo} onMouseOut={this.hideInfo}></div>
        <div className={infoBoxClasses}>
          {this.props.title}
        </div>
      </div>
    )
  }
}

Marker.propTypes = {
  title: PropTypes.string.isRequired
}

export default Marker
