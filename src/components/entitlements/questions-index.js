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
    const {
      schema,
      fetchingSchema,
      handleSubmit,
      submitting,
      isNZResident,
      hasDisability,
      relationshipStatus,
      numberOfChildren,
      childrenAges,
      childHasDisability,
      requiresConstantCare,
      attendsECE,
      hasAccommodationCosts
    } = this.props
    const overFifteens = (
      childrenAges &&
      childrenAges.length &&
      (parseInt(childrenAges[childrenAges.length - 1], 10) === 18)
    )
    const underFives = (
      childrenAges &&
      childrenAges.length &&
      (parseInt(childrenAges[0], 10) < 5)
    )

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

          <div className='section'>
          <div className='section-inner'>
            <h3 className='section-heading'>
              Your background<br />
              <span className='english'>Your background</span>
            </h3>

            <Field {...getFieldProps(fields, 'applicant.isNZResident')} />

            { isNZResident === 'true' &&
              <div className='component-grouping'>
                <Field {...getFieldProps(fields, 'applicant.normallyLivesInNZ')} />
                <Field {...getFieldProps(fields, 'applicant.Age')} />
                <Field {...getFieldProps(fields, 'applicant.hasDisability')} />
                { hasDisability === 'true' &&
                  <div className='conditional-field'>
                    <Field {...getFieldProps(fields, 'applicant.hasSeriousDisability')} />
                  </div>
                }
                <Field {...getFieldProps(fields, 'applicant.relationshipStatus')} />
                { relationshipStatus && relationshipStatus !== 'single' &&
                  <div className='conditional-field'>
                    <Field {...getFieldProps(fields, 'applicant.isInadequatelySupportedByPartner')} />
                  </div>
                }
              </div>
            }
          </div>
          </div>

          { isNZResident === 'true' &&
          <div className='section'>
          <div className='section-inner'>
            <h3 className='section-heading'>
              Your children<br />
              <span className='english'>Your children</span>
            </h3>

            <Field {...getFieldProps(fields, 'applicant.expectingChild')} />
            <Field {...getFieldProps(fields, 'applicant.numberOfChildren')} />
            {/* TODO add special message if numberOfChildren === 0 ? */}
            { numberOfChildren && parseInt(numberOfChildren, 10) > 2 &&
              <div className='conditional-field'>
                <Field {...getFieldProps(fields, 'applicant.needsDomesticSupport﻿')} />
              </div>
            }
            { numberOfChildren && parseInt(numberOfChildren, 10) > 0 &&
              <div className='component-grouping'>
                <Field {...getFieldProps(fields, 'children.ages')} />
                { overFifteens &&
                  <Field {...getFieldProps(fields, 'children.financiallyIndependant')} />
                }
                <Field {...getFieldProps(fields, 'child.hasSeriousDisability')} />
                { childHasDisability === 'true' &&
                  <div className='conditional-field'>
                    <Field {...getFieldProps(fields, 'child.requiresConstantCare')} />
                    { requiresConstantCare === 'true' &&
                      <Field {...getFieldProps(fields, 'child.constantCareUnderSix')} />
                    }
                  </div>
                }
                { underFives &&
                  <Field {...getFieldProps(fields, 'child.attendsECE')} />
                }
                { attendsECE === 'true' &&
                  <div className='conditional-field'>
                    <Field {...getFieldProps(fields, 'child.WeeklyECEHours')} />
                  </div>
                }
              </div>
            }
          </div>
          </div>
          }

          { isNZResident === 'true' &&
          <div className='section'>
          <div className='section-inner'>
            <h3 className='section-heading'>
              Accommodation<br />
              <span className='english'>Accommodation</span>
            </h3>

            <Field {...getFieldProps(fields, 'applicant.hasAccommodationCosts')} />

            { hasAccommodationCosts === 'true' &&
              <div className='component-grouping'>
                <Field {...getFieldProps(fields, 'applicant.hasSocialHousing')} />
                <Field {...getFieldProps(fields, 'applicant.receivesAccommodationSupport')} />
                <Field {...getFieldProps(fields, 'threshold.income.AccommodationSupplement')} />
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
              </div>
            }
          </div>
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
  hasDisability: PropTypes.string,
  relationshipStatus: PropTypes.string,
  numberOfChildren: PropTypes.string,
  childrenAges: PropTypes.array,
  childHasDisability: PropTypes.string,
  requiresConstantCare: PropTypes.string,
  attendsECE: PropTypes.string,
  hasAccommodationCosts: PropTypes.string
}

const selector = formValueSelector('entitlements')

const mapStateToProps = (state) => ({
  fetchingSchema: get(state, 'entitlements.fetchingSchema'),
  schema: get(state, 'entitlements.schema'),
  isNZResident: selector(state, 'applicant.isNZResident'),
  hasDisability: selector(state, 'applicant.hasDisability'),
  relationshipStatus: selector(state, 'applicant.relationshipStatus'),
  numberOfChildren: selector(state, 'applicant.numberOfChildren'),
  childrenAges: selector(state, 'children.ages'),
  childHasDisability: selector(state, 'child.hasSeriousDisability'),
  requiresConstantCare: selector(state, 'child.requiresConstantCare'),
  attendsECE: selector(state, 'child.attendsECE'),
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
