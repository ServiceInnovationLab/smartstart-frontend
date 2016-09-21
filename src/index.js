import 'index.scss'

import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import configureStore from 'store/store'
import Container from 'containers/container'
import Main from 'layouts/main/main'
import Secondary from 'layouts/secondary/secondary'

const store = configureStore()

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory} onUpdate={() => window.scrollTo(0, 0)}>
      <Route path='/' component={Container}>
        <IndexRoute component={Main} />
        <Route path='your-privacy' component={Secondary} />
        <Route path='*' component={Main} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
)
