import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { fetchContent, checkAuthCookie, fetchPhaseMetadata, piwikTrackPost, fetchPersonalisationValues } from 'actions/actions'
import Page from 'layouts/page/page'

class Container extends Component {
  componentDidMount () {
    const { dispatch } = this.props
    // should only need to get once on load
    dispatch(fetchContent())
    dispatch(fetchPhaseMetadata())

    // should only need to check on load
    dispatch(checkAuthCookie()).then(() =>
      // wait for isLoggedIn state before deciding if OK to fetch
      dispatch(fetchPersonalisationValues())
    )

    // basic piwik logging
    dispatch(piwikTrackPost('Timeline'))
  }

  render () {
    const { phases, supplementary, supplementaryID, isLoggedIn, error, isFetchingPersonalisation } = this.props

    return (
      <Page phases={phases} supplementary={supplementary} supplementaryID={supplementaryID} isLoggedIn={isLoggedIn} appError={error} isFetchingPersonalisation={isFetchingPersonalisation} />
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
    isLoggedIn,
    isFetchingPersonalisation
  } = personalisationActions || {
    isLoggedIn: false,
    isFetchingPersonalisation: false
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
    isFetchingPersonalisation,
    error
  }
}

Container.propTypes = {
  phases: PropTypes.array.isRequired,
  supplementary: PropTypes.array,
  isLoggedIn: PropTypes.bool.isRequired,
  isFetchingPersonalisation: PropTypes.bool.isRequired,
  appError: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string
  ])
}

export default connect(mapStateToProps)(Container)
