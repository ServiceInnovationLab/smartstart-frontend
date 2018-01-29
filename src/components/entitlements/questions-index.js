import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import get from 'lodash/get'
import { Link } from 'react-router'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import { fetchSchema } from 'actions/entitlements'
import Spinner from 'components/spinner/spinner'
import getFieldProps from 'components/form/get-field-props'
import fields from './fields'

class EntitlementsQuestions extends Component {
  constructor (props) {
    super(props)

    this.retry = this.retry.bind(this)
  }

  componentWillMount () {
    this.props.fetchSchema()
  }

  retry () {
    this.props.fetchSchema()
  }

  onNZResidentChange () {

  }

  render () {
    const { schema, fetchingSchema, handleSubmit, isNZResident } = this.props

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
      <div className='form'>
        <form onSubmit={handleSubmit}>
          <Field {...getFieldProps(fields, 'general.isNZResident')} />

          { isNZResident === 'true' &&
            <div className="conditional-field">
              <Field {...getFieldProps(fields, 'general.age')} />
            </div>
          }
        </form>
      </div>
    )
  }
}

EntitlementsQuestions.propTypes = {
  params: PropTypes.object.isRequired,
  fetchSchema: PropTypes.func,
  fetchingSchema: PropTypes.bool,
  schema: PropTypes.array,
  handleSubmit: PropTypes.func,
  isNZResident: PropTypes.string
}

const selector = formValueSelector('entitlements')

const mapStateToProps = (state) => ({
  fetchingSchema: get(state, 'entitlements.fetchingSchema'),
  schema: get(state, 'entitlements.schema'),
  isNZResident: selector(state, 'general.isNZResident')
})

EntitlementsQuestions = reduxForm({
  form: 'entitlements'
})(EntitlementsQuestions)

export default connect(
  mapStateToProps,
  {
    fetchSchema
  }
)(EntitlementsQuestions)
