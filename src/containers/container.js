import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { fetchContent, checkAuthCookie, fetchPhaseMetadata, piwikTrackPost } from 'actions/actions'
import Page from 'layouts/page/page'

class Container extends Component {
  componentDidMount () {
    const { dispatch } = this.props
    // should only need to get once on load
    dispatch(fetchContent())
    dispatch(fetchPhaseMetadata())

    // should only need to check on load
    dispatch(checkAuthCookie())

    // TODO if logged in, fetch /users/me/ and update state as needed
    // should the spinner keep going until we have a response? will
    // be 403 if not logged in

    // set up actions for 'update' and checkbox tick

    dispatch(piwikTrackPost('Timeline'))
  }

  render () {
    const { phases, supplementary, supplementaryID, isLoggedIn, error } = this.props

    return (
      <Page phases={phases} supplementary={supplementary} supplementaryID={supplementaryID} isLoggedIn={isLoggedIn} appError={error} />
    )
  }
}

function mapStateToProps (state) {
  const {
    contentActions,
    personalisationActions,
    applicationActions
  } = state
  const {
    phases,
    supplementary
  } = contentActions || {
    phases: [],
    supplementary: []
  }
  const {
    isLoggedIn
  } = personalisationActions || {
    isLoggedIn: false
  }
  const {
    error
  } = applicationActions || {
    error: false
  }

  return {
    phases,
    supplementary,
    isLoggedIn,
    error
  }
}

Container.propTypes = {
  phases: PropTypes.array.isRequired,
  supplementary: PropTypes.array,
  isLoggedIn: PropTypes.bool.isRequired,
  appError: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string
  ])
}

export default connect(mapStateToProps)(Container)
