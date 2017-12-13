import React, { PropTypes, Component } from 'react'
import classNames from 'classnames'

import './marker.scss'

class Marker extends Component {
  constructor (props) {
    super(props)

    this.state = {
      infoShown: false,
      clickedOn: false
    }

    this.showInfo = this.showInfo.bind(this)
    this.hideInfo = this.hideInfo.bind(this)
    this.markerClick = this.markerClick.bind(this)
    this.markerRemove = this.markerRemove.bind(this)
  }

  showInfo () {
    this.setState({ infoShown: true })
  }

  hideInfo () {
    if (!this.state.clickedOn) {
      this.setState({ infoShown: false })
    }
  }

  markerClick () {
    if (this.state.clickedOn) {
      // act as a toggle
      this.setState({
        infoShown: false,
        clickedOn: false
      })
    } else {
      this.setState({
        infoShown: true,
        clickedOn: true
      })
    }
  }

  markerRemove (event) {
    event.preventDefault()
    this.setState({
      infoShown: false,
      clickedOn: false
    })
  }

  render () {
    const { infoShown, clickedOn } = this.state
    const { title, id, lat, lng, showList } = this.props
    const markerClasses = classNames(
      'marker-box',
      { 'is-active': infoShown }
    )
    const closeClasses = classNames(
      'marker-info',
      { 'show-close': clickedOn }
    )

    return (
      <div className={markerClasses}>
        <div className='marker-box-hover-wrapper' onMouseOver={this.showInfo} onMouseOut={this.hideInfo}>
          <div className='marker' onClick={this.markerClick}></div>
          <div className={closeClasses}>
            <h5>{title}</h5>
            <a className='close-button' href='#' onClick={this.markerRemove}><span className='visuallyhidden'>Close</span></a>
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
