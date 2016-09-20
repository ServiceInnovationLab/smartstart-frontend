import './footer.scss'

import React, { Component } from 'react'
import { Link } from 'react-router'

class Footer extends Component {
  render () {
    return (
      <footer className='page-footer'>
        <div className='page-footer-inner'>
          <Link to={'/contact-us/'}>Contact us</Link>
          <Link to={'/your-privacy/'}>Your privacy</Link>
          <Link to={'/copyright-and-attribution/'}>Copyright and attribution</Link>
        </div>
      </footer>
    )
  }
}

export default Footer
