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

// mapping for routes for secondary pages
// the value is the tag on the card from the content api used to create the association
export const routeTagMapping = {
  'copyright-and-attribution': 'boac_presentation::copyright',
  'your-privacy': 'boac_presentation::privacy',
  'contact-us': 'boac_presentation::contact'
}
let secondaryRoutes = []

for (var route in routeTagMapping) {
  secondaryRoutes.push(<Route key={route} path={route} component={Secondary} />)
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory} onUpdate={() => window.scrollTo(0, 0)}>
      <Route path='/' component={Container}>
        <IndexRoute component={Main} />
        {secondaryRoutes}
        <Route path='*' component={Main} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
)
