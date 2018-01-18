import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { fetchContent } from 'actions/timeline'
import { checkAuthCookie, fetchPhaseMetadata, fetchPersonalisationValues } from 'actions/personalisation'
import { piwikTrackPost, getPiwikID } from 'actions/application'

class Container extends Component {
  componentDidMount () {
    const { dispatch } = this.props

    dispatch(getPiwikID()).then(() => {

      // should only need to get once on load
      dispatch(fetchContent())
      dispatch(fetchPhaseMetadata())

      // should only need to check on load
      dispatch(checkAuthCookie()).then(() =>
        // wait for isLoggedIn state before deciding if OK to fetch
        dispatch(fetchPersonalisationValues())
      )

      // basic piwik logging
      dispatch(piwikTrackPost('Load site'))
    })
  }

  render () {
    const { phases, supplementary, about, supplementaryID, isLoggedIn, error, authError, isFetchingPersonalisation } = this.props

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
          authError: authError,
          isFetchingPersonalisation: isFetchingPersonalisation
        })}
      </div>
    )
  }
}

function mapStateToProps (state) {
  const {
    timeline,
    personalisation,
    application
  } = state
  const {
    phases,
    supplementary,
    about
  } = timeline || {
    phases: [],
    supplementary: [],
    about: []
  }
  const {
    isLoggedIn,
    isFetchingPersonalisation
  } = personalisation || {
    isLoggedIn: false,
    isFetchingPersonalisation: false
  }
  const {
    error,
    authError
  } = application || {
    error: false,
    authError: false
  }

  return {
    phases,
    supplementary,
    about,
    isLoggedIn,
    isFetchingPersonalisation,
    error,
    authError
  }
}

Container.propTypes = {
  phases: PropTypes.array.isRequired,
  supplementary: PropTypes.array,
  about: PropTypes.array,
  isLoggedIn: PropTypes.bool.isRequired,
  isFetchingPersonalisation: PropTypes.bool.isRequired,
  error: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.object
  ]),
  authError: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string
  ]),
  children: PropTypes.object.isRequired,
  supplementaryID: PropTypes.number,
  dispatch: PropTypes.func
}

export default connect(mapStateToProps)(Container)
