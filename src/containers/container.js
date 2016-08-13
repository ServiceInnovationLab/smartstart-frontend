import React from 'react'
import { connect } from 'react-redux'
import { fetchContent, checkAuthCookie } from 'actions/actions'
import Page from 'layouts/page/page'

class Container extends React.Component {
  componentDidMount () {
    const { dispatch } = this.props
    dispatch(fetchContent()) // should only need to check on load
    dispatch(checkAuthCookie()) // should only need to check on load
  }

  render () {
    const { isFetching, phases, supplementary, isLoggedIn, error } = this.props

    return (
      <Page phases={phases} supplementary={supplementary} loading={isFetching} isLoggedIn={isLoggedIn} appError={error} />
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
    isFetching,
    phases,
    supplementary
  } = contentActions || {
    isFetching: true,
    phases: [],
    supplementary: [],
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
    isFetching,
    phases,
    supplementary,
    isLoggedIn,
    error
  }
}

export default connect(mapStateToProps)(Container)
