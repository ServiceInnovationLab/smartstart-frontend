import './footer.scss'

import React, { Component } from 'react'
import { Link } from 'react-router'

class Footer extends Component {
  render () {
    return (
      <footer className='page-footer'>
        <span className='page-footer-curve' />
        <div className='page-footer-inner-wrap'>
          <div className='page-footer-inner'>
            <ul role='contentinfo'>
              <li><Link to={'/contact-us/'}>Contact us</Link></li>
              <li><Link to={'/your-privacy/'}>Your privacy</Link></li>
              <li><Link to={'/copyright-and-attribution/'}>Copyright and attribution</Link></li>
            </ul>
            <p className='nz-govt'>
              <a href='https://www.govt.nz/'><img src='/assets/img/nz-govt-logo-black.svg' alt='New Zealand Government' /></a>
            </p>
          </div>
        </div>
      </footer>
    )
  }
}

export default Footer
