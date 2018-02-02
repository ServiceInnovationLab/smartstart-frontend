import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import get from 'lodash/get'
import { Link } from 'react-router'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import { fetchSchema, postToReasoner } from 'actions/entitlements'
import Spinner from 'components/spinner/spinner'
import Accordion from 'components/form/accordion'
import getFieldProps from 'components/form/get-field-props'
import fields from './fields'
import validate from './validation'
import transform from './transform'
import './questions-index.scss'

class EntitlementsQuestions extends Component {
  constructor (props) {
    super(props)

    this.retry = this.retry.bind(this)
    this.submit = this.submit.bind(this)
  }

  componentWillMount () {
    this.props.fetchSchema()
  }

  retry () {
    this.props.fetchSchema()
  }

  submit (values) {
    const { schema, postToReasoner } = this.props
    postToReasoner(transform(values, schema))
    this.props.router['push']('/financial-help/results')
  }

  render () {
    const { schema, fetchingSchema, handleSubmit, submitting, isNZResident, hasAccommodationCosts } = this.props

    if (fetchingSchema) {
      return <Spinner text="Please wait ..."/>
    }

    if(!schema || !schema.length) {
      return <div className="unavailable-notice">
        <h2>Sorry!</h2>
        <div className="informative-text">
          Benefits eligibility is currently unavailable. Right now we're working on getting back online as soon as possible. Thank you for your patience - please <Link to={'/financial-help/questions'} onClick={this.retry}>try again</Link> shortly.
        </div>
      </div>
    }

    return (
      <div className='form eligibility'>
        <form onSubmit={handleSubmit(this.submit)}>

          <h3 className='section-heading'>
            Your background<br />
            <span className='english'>Your background</span>
          </h3>

          <Field {...getFieldProps(fields, 'applicant.isNZResident')} />

          { isNZResident === 'true' &&
            <Field {...getFieldProps(fields, 'applicant.normallyLivesInNZ')} />
          }

          { isNZResident === 'true' &&
            <Field {...getFieldProps(fields, 'applicant.Age')} />
          }

          { isNZResident === 'true' &&
            <h3 className='section-heading'>
              Accommodation<br />
              <span className='english'>Accommodation</span>
            </h3>
          }

          { isNZResident === 'true' &&
            <Field {...getFieldProps(fields, 'applicant.hasAccommodationCosts')} />
          }

          { isNZResident === 'true' && hasAccommodationCosts === 'true' &&
            <Field {...getFieldProps(fields, 'applicant.hasSocialHousing')} />
          }

          { isNZResident === 'true' && hasAccommodationCosts === 'true' &&
            <Field {...getFieldProps(fields, 'applicant.receivesAccommodationSupport')} />
          }

          { isNZResident === 'true' && hasAccommodationCosts === 'true' &&
            <Field {...getFieldProps(fields, 'threshold.income.AccommodationSupplement')} />
          }

          { isNZResident === 'true' && hasAccommodationCosts === 'true' &&
            <div className="expandable-group secondary">
              <Accordion>
                <Accordion.Toggle>
                  How do we calculate the income threshold?
                </Accordion.Toggle>
                <Accordion.Content>
                  <p><a href='http://www.legislation.govt.nz/act/public/1964/0136/latest/DLM362884.html?search=sw_096be8ed816df160_16%2c200_25_se&p=1&sr=0'>Link the legislation</a></p>
                </Accordion.Content>
              </Accordion>
            </div>
          }

          <div className="form-actions">
            <button type="submit" className="next" disabled={submitting}>Submit your answers</button>
          </div>
        </form>
      </div>
    )
  }
}

EntitlementsQuestions.propTypes = {
  router: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  fetchSchema: PropTypes.func,
  fetchingSchema: PropTypes.bool,
  schema: PropTypes.array,
  postToReasoner: PropTypes.func,
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  isNZResident: PropTypes.string,
  hasAccommodationCosts: PropTypes.string
}

const selector = formValueSelector('entitlements')

const mapStateToProps = (state) => ({
  fetchingSchema: get(state, 'entitlements.fetchingSchema'),
  schema: get(state, 'entitlements.schema'),
  isNZResident: selector(state, 'applicant.isNZResident'),
  hasAccommodationCosts: selector(state, 'applicant.hasAccommodationCosts')
})

EntitlementsQuestions = reduxForm({
  form: 'entitlements',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate
})(EntitlementsQuestions)

export default connect(
  mapStateToProps,
  {
    fetchSchema,
    postToReasoner
  }
)(EntitlementsQuestions)
