import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import timeline from 'store/reducers/timeline'
import personalisation from 'store/reducers/personalisation'
import application from 'store/reducers/application'
import birthRegistration from 'store/reducers/birth-registration'
import services from 'store/reducers/services'
import entitlements from 'store/reducers/entitlements'

const rootReducer = combineReducers({
  form: formReducer,
  timeline,
  personalisation,
  application,
  birthRegistration,
  services,
  entitlements
})

export default rootReducer
