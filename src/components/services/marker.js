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
    const { title, id, website } = this.props
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
              <a href={'#' + id}>Find out more</a>
              {website &&
                <span>
                  <br />
                  <a href={website} target='_black' rel='noopener noreferrer'>Go to website</a>
                </span>
              }
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
  website: PropTypes.string
}

export default Marker
