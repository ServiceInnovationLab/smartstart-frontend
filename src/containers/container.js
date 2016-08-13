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
    const { isFetching, phases, supplementary, isLoggedIn } = this.props

    return (
      <Page phases={phases} supplementary={supplementary} loading={isFetching} isLoggedIn={isLoggedIn} />
    )
  }
}

function mapStateToProps (state) {
  const { content, personalisation } = state
  const {
    isFetching,
    phases,
    supplementary
  } = content || {
    isFetching: true,
    phases: [],
    supplementary: [],
  }
  const {
    isLoggedIn
  } = personalisation || {
    isLoggedIn: false
  }

  return {
    isFetching,
    phases,
    supplementary,
    isLoggedIn
  }
}

export default connect(mapStateToProps)(Container)
