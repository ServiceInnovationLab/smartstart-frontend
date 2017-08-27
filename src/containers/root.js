import 'index.scss'

import React, { PropTypes } from 'react'
import { Router, Route, IndexRoute, IndexRedirect, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import Container from 'containers/container'
import Main from 'layouts/main/main'
import MetadataPage from 'layouts/metadata-page/metadata-page'
import FeaturePage from 'layouts/feature-page/feature-page'
import BirthRegistrationPage from 'layouts/birth-registration-page/birth-registration-page'
import ServicesPage from 'layouts/services/services'
import BabyNames from 'components/baby-names/baby-names'
import RegisterMyBabyLandingPage from 'components/register-my-baby/landing-page'
import RegisterMyBaby from 'components/register-my-baby'
import RegisterMyBabyConfirmation from 'components/register-my-baby/confirmation-page-no-birth-certificate-order'
import RegisterMyBabyConfirmationPaymentSuccess from 'components/register-my-baby/confirmation-page-payment-success'
import RegisterMyBabyConfirmationPaymentOutstanding from 'components/register-my-baby/confirmation-page-payment-outstanding'
import { routerScrollHandler } from 'utils'

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

const Root = (props) => (
  <Provider store={props.store}>
    <Router history={browserHistory} onUpdate={routerScrollHandler}>
      <Route path='/' component={Container}>
        <IndexRoute component={Main} />
        <Route path='register-my-baby' component={BirthRegistrationPage}>
          <IndexRoute component={RegisterMyBabyLandingPage} />
          <Route path='confirmation' component={RegisterMyBabyConfirmation} />
          <Route path='confirmation-payment-success' component={RegisterMyBabyConfirmationPaymentSuccess} />
          <Route path='confirmation-payment-outstanding' component={RegisterMyBabyConfirmationPaymentOutstanding} />
          <Route path=':stepName' component={RegisterMyBaby} />
        </Route>
        <Route path='news' component={FeaturePage}>
          <IndexRedirect to="/news/baby-names" />
          <Route path='baby-names' component={BabyNames} />
          <Route path='*' component={BabyNames} />
        </Route>
        <Route path='services' component={ServicesPage} />
        {metadataRoutes}
        <Route path='*' component={Main} />
      </Route>
    </Router>
  </Provider>
)

Root.propTypes = {
  store: PropTypes.object
}

export default Root
