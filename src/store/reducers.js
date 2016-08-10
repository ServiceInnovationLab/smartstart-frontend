import { combineReducers } from 'redux'
import { REQUEST_API, RECEIVE_API } from 'actions/actions'

function content (state = {
  isFetching: false,
  phases: [],
  supplementary: []
}, action) {
  switch (action.type) {
    case REQUEST_API:
      return Object.assign({}, state, {
        isFetching: true
      })
    case RECEIVE_API:
      return Object.assign({}, state, {
        isFetching: false,
        phases: action.phases,
        supplementary: action.supplementary
      })
    default:
      return state
  }
}

const rootReducer = combineReducers({
  content
})

export default rootReducer
