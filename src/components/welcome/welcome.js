import './welcome.scss'

import React, { Component } from 'react'

class Welcome extends Component {
  render () {
    return (
      <div className='welcome'>
        <div className='welcome-pane-wrapper'>

          <div className='welcome-intro'>
            <h2>Welcome to SmartStart</h2>
            <p>SmartStart provides step-by-step information and support to help you access the right government services for you and your baby.</p>
          </div>

          <a href='' className='welcome-action welcome-action-personalise'>Add your due date</a>
          <a href='' className='welcome-action welcome-action-timeline'>Find out about services</a>
          <a href='' className='welcome-action welcome-action-todo-list'>Check your To Do list</a>
          <p><a href='/login/' className=''>Login with RealMe</a> to access and save your SmartStart profile and To Do list</p>

        </div>
      </div>
    )
  }
}

export default Welcome
