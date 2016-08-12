import 'index.scss'

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from 'store/store'
import Container from 'containers/container'

const store = configureStore()

ReactDOM.render(
  <Provider store={store}><Container /></Provider>,
  document.getElementById('app')
)
