import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import get from 'lodash/get'
import { Link } from 'react-router'
import { fetchSchema } from 'actions/entitlements'
import Spinner from 'components/spinner/spinner'

class EntitlementsQuestions extends Component {
  constructor(props) {
    super(props)

    this.retry = this.retry.bind(this)
  }

  componentWillMount() {
    this.props.fetchSchema()
  }

  retry() {
    this.props.fetchSchema()
  }

  render() {
    const { schema, fetchingSchema } = this.props

    if (fetchingSchema) {
      return <Spinner text="Please wait ..."/>
    }

    if(!schema || !schema.length) {
      return <div className="unavailable-notice">
        <h2>Sorry!</h2>
        <div className="informative-text">
          Benefits eligibility is currently unavailable. Right now we're working on getting back online as soon as possible. Thank you for your patience - please <Link to={'/benefits-eligibility/questions'} onClick={this.retry}>try again</Link> shortly.
        </div>
      </div>
    }

    return (
      <div>
        <h3>question steps injected here :)</h3>
      </div>
    )
  }
}

EntitlementsQuestions.propTypes = {
  params: PropTypes.object.isRequired,
  fetchSchema: PropTypes.func,
  fetchingSchema: PropTypes.bool,
  schema: PropTypes.array
}

const mapStateToProps = (state) => ({
  fetchingSchema: get(state, 'entitlementsActions.fetchingSchema'),
  schema: get(state, 'entitlementsActions.schema')
})

export default connect(
  mapStateToProps,
  {
    fetchSchema
  }
)(EntitlementsQuestions)
