import React from 'react'
import { connect } from 'react-redux'
import { fetchContent } from 'actions/actions'
import Page from 'layouts/page/page'

class Container extends React.Component {
  componentDidMount () {
    const { dispatch } = this.props
    dispatch(fetchContent())
  }

  render () {
    const { isFetching, phases, supplementary } = this.props

    return (
      <Page phases={phases} supplementary={supplementary} loading={isFetching} />
    )
  }
}

function mapStateToProps (state) {
  const { content } = state
  const {
    isFetching,
    phases,
    supplementary
  } = content || {
    isFetching: true,
    phases: [],
    supplementary: []
  }

  return {
    isFetching,
    phases,
    supplementary
  }
}

export default connect(mapStateToProps)(Container)
