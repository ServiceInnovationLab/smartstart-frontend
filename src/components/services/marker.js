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
    this.setState({ infoShown: false })
  }

  render () {
    const { title, id, lat, lng, showList } = this.props
    const markerClasses = classNames(
      'marker-box',
      { 'is-active': this.state.infoShown }
    )

    return (
      <div className={markerClasses}>
        <div className='marker-box-hover-wrapper' onMouseOver={this.showInfo} onMouseOut={this.hideInfo}>
          <div className='marker'></div>
          <div className='marker-info'>
            <h5>{title}</h5>
            <p>
              <a href={'#' + id} onClick={showList}>Find out more</a>
              <br />
              <a href={`https://www.google.com/maps/dir/Current+Location/${lat},${lng}`} target='_blank' rel='noopener noreferrer'>Directions</a>
            </p>
          </div>
        </div>
      </div>
    )
  }
}

Marker.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  lat: PropTypes.string.isRequired,
  lng: PropTypes.string.isRequired,
  showList: PropTypes.func.isRequired
}

export default Marker
