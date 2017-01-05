import 'index.scss'

import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import configureStore from 'store/store'
import Container from 'containers/container'
import Main from 'layouts/main/main'
import MetadataPage from 'layouts/metadata-page/metadata-page'
import FeaturePage from 'layouts/feature-page/feature-page'
import BabyNames from 'components/baby-names/baby-names'
import { routerScrollHandler } from 'utils'

const store = configureStore()

// mapping for routes for metadata pages
// the value is the tag on the card from the content api used to create the association
export const routeTagMapping = {
  'copyright-and-attribution': 'boac_presentation::copyright',
  'your-privacy': 'boac_presentation::privacy',
  'contact-us': 'boac_presentation::contact'
}
let metadataRoutes = []

for (var route in routeTagMapping) {
  metadataRoutes.push(<Route key={route} path={route} component={MetadataPage} />)
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory} onUpdate={routerScrollHandler}>
      <Route path='/' component={Container}>
        <IndexRoute component={Main} />
        <Route path='news' component={FeaturePage}>
          <Route path='baby-names' component={BabyNames} />
          <Route path='*' component={BabyNames} />
        </Route>
        {metadataRoutes}
        <Route path='*' component={Main} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
)
