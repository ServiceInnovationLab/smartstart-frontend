/* globals DocumentTouch  */
import './login-button.scss'

import React, { Component } from 'react'
import classNames from 'classnames'

class LoginButton extends Component {
  constructor (props) {
    super(props)

    this.state = {
      helpShown: false,
      touchDevice: false
    }
  }

  componentDidMount () {
    this.setState({touchDevice: (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch)})
  }

  helpHover (event) {
    if (!this.state.touchDevice) {
      this.setState({helpShown: true})
    }
  }

  removeHelpHover () {
    this.setState({helpShown: false})
  }

  render () {
    let popoverClasses = classNames(
      'realme_popup_wrapper',
      'realme_arrow_top_right',
      { 'show-help': this.state.helpShown }
    )
    let popoverTrigger = ''

    if (!this.state.touchDevice) {
      popoverTrigger = <a id='popup_trigger' className='link whats_realme' role='button'>?</a>
    } else {
      popoverTrigger = <a id='popup_trigger' href='http://www.realme.govt.nz' target='_blank' rel='noopener noreferrer' className='link whats_realme'>?</a>
    }

    return (
      <div className='realme_widget realme_secondary_login realme_theme_dark' data-test='login'>
        <a href='/login/' className='realme_login realme_pipe'>Login <span className='realme_icon_link'></span></a>
        <a href='/login/' className='realme_create_account realme_pipe'>Create <span className='realme_icon_link'></span></a>
        <div className='realme_popup_position' onMouseEnter={this.helpHover.bind(this)} onMouseLeave={this.removeHelpHover.bind(this)}>
          {popoverTrigger}

          <div className={popoverClasses}>
            <div className='realme_popup'>
              <h2 className='realme_popup_title'>To login to this service you now need a RealMe account.</h2>
              <p><b>RealMe</b> is a service from the New Zealand government and New Zealand Post that includes a single login, letting you use one username and password to access a wide range of services online.</p>
              <p>But there is much more to <b>RealMe</b> than just the convenience of a single login.</p>
              <h2 className='realme_popup_title'>Get Verified</h2>
              <p><b>RealMe</b> is also your secure online ID. Verify your <b>RealMe</b> account and use it to prove who you are online. This lets you to do lots of useful things over the internet that would normally require you to turn up in person. <a className='realme_find_out_more' target='_blank' rel='noopener noreferrer' href='http://www.realme.govt.nz'>Find out more <span className='realme_icon_find_out_more'></span></a></p>
              <span className='arrow'>
                <span className='front'></span>
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

LoginButton.propTypes = {}

export default LoginButton
