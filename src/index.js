import 'index.scss'

import React from 'react'
import ReactDOM from 'react-dom'
import Greeting from 'components/greeting/greeting'

ReactDOM.render(
  <Greeting name='World' />,
  document.getElementById('app')
)
