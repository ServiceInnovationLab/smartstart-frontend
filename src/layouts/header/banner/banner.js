import './banner.scss'

import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router'

class Banner extends Component {
  render () {
    if (this.props.shown) {
      return (
        <div className='page-header-banner' data-test='banner'>
          <div className='page-header-inner'>
            <p>The Department of Internal Affairs has just announced <Link to={'/news/baby-names/'}>the top baby names for 2016</Link></p>
          </div>
        </div>
      )
    } else {
      return null
    }
  }
}

Banner.propTypes = {
  shown: PropTypes.bool
}

export default Banner
