import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { fetchContent, checkAuthCookie, piwikTrackPost } from 'actions/actions'
import Page from 'layouts/page/page'

class Container extends Component {
  componentDidMount () {
    const { dispatch } = this.props
    dispatch(fetchContent()) // should only need to check on load
    dispatch(checkAuthCookie()) // should only need to check on load
    dispatch(piwikTrackPost('Timeline'))
  }

  render () {
    const { phases, supplementary, isLoggedIn, error } = this.props

    return (
      <Page phases={phases} supplementary={supplementary} isLoggedIn={isLoggedIn} appError={error} />
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
