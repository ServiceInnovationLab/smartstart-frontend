import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { fetchContent, checkAuthCookie, fetchPhaseMetadata, piwikTrackPost, fetchPersonalisationValues } from 'actions/actions'

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
    const { phases, supplementary, about, supplementaryID, isLoggedIn, error, isFetchingPersonalisation } = this.props

    // react router renders the appropriate layout accourding to the route, and
    // we pass in all the required props as per https://github.com/ReactTraining/react-router/blob/master/examples/passing-props-to-children/app.js#L48
    return (
      <div>
        {this.props.children && React.cloneElement(this.props.children, {
          phases: phases,
          supplementary: supplementary,
          about: about,
          supplementaryID: supplementaryID,
          isLoggedIn: isLoggedIn,
          appError: error,
          isFetchingPersonalisation: isFetchingPersonalisation
        })}
      </div>
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
    supplementary,
    about
  } = contentActions || {
    phases: [],
    supplementary: [],
    about: []
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
    about,
    isLoggedIn,
    isFetchingPersonalisation,
    error
  }
}

Container.propTypes = {
  phases: PropTypes.array.isRequired,
  supplementary: PropTypes.array,
  about: PropTypes.array,
  isLoggedIn: PropTypes.bool.isRequired,
  isFetchingPersonalisation: PropTypes.bool.isRequired,
  appError: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string
  ]),
  children: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(Container)
