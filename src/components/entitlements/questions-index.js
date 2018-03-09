import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import get from 'lodash/get'
import { Link } from 'react-router'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import { piwikTrackPost } from 'actions/application'
import { fetchSchema, postToReasoner } from 'actions/entitlements'
import Spinner from 'components/spinner/spinner'
import Accordion from 'components/form/accordion'
import scrollToFirstError from 'components/form/scroll-to-first-error'
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
    const piwikEvent = {
      'category': 'Financial help',
      'action': 'Questions page - click submit',
      'name': 'Submit my answers'
    }
    this.props.piwikTrackPost('Financial help', piwikEvent)
    this.props.router['push']('/financial-help/results')
  }

  render () {
    const {
      schema,
      fetchingSchema,
      handleSubmit,
      submitting,
      isNZResident,
      relationshipStatus,
      isInadequatelySupportedByPartner,
      childrenAges,
      childHasDisability,
      requiresConstantCare,
      constantCareUnderSix,
      attendsECE,
      allChildrenInTheirFullTimeCare,
      isParent,
      isPrincipalCarerForOneYearFromApplicationDate,
      workOrStudy,
      expectingChild,
      doesPartnerWork,
      hasAccommodationCosts
    } = this.props
    const overFifteens = !!(
      childrenAges &&
      childrenAges.length &&
      (parseInt(childrenAges[0], 10) === 18)
    )
    const underFives = !!(
      childrenAges &&
      childrenAges.length &&
      (parseInt(childrenAges[0], 10) < 5)
    )
    const numberOfChildren = this.props.numberOfChildren ? parseInt(this.props.numberOfChildren, 10) : 0

    if (fetchingSchema) {
      return <Spinner text='Please wait ...'/>
    }

    if (!schema || !schema.length) {
      return <div className='unavailable-notice'>
        <h3>Sorry!</h3>
        <p>
          The financial help tool is currently unavailable. Right now we’re working on getting back online as soon as possible. Thank you for your patience - please <Link to={'/financial-help/questions'} onClick={this.retry}>try again</Link> shortly.
        </p>
      </div>
    }

    return (
      <div className='form eligibility'>
        <form onSubmit={handleSubmit(this.submit)}>

          <div className='section'>
          <div className='section-inner'>
            <h3 className='section-heading'>
              Tō tipuranga mai<br />
              <span className='english'>Your background</span>
            </h3>

            <Field {...getFieldProps(fields, 'applicant.isNZResident')} />

            { isNZResident === 'false' &&
              <div className='instruction'>
                If you aren’t a New Zealand citizen or resident, you’re probably not eligible for any of the benefits and payments covered by this tool.
              </div>
            }

            { isNZResident === 'true' &&
              <div className='component-grouping'>
                <Field {...getFieldProps(fields, 'applicant.normallyLivesInNZ')} />
                <Field {...getFieldProps(fields, 'applicant.Age')} />
                <Field {...getFieldProps(fields, 'applicant.hasSeriousDisability')} />
                <div className="expandable-group secondary">
                  <Accordion>
                    <Accordion.Toggle>
                    What does permanent or severe mean?
                    </Accordion.Toggle>
                    <Accordion.Content>
                      <p>Permanent means that your condition, injury or disability will affect your health for more than 2 years.</p>

                      <p>Severe means that it will also affect your ability to work 15 hours or more a week.</p>
                    </Accordion.Content>
                  </Accordion>
                </div>
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
              Ko āu tamariki<br />
              <span className='english'>Your children</span>
            </h3>

            <Field {...getFieldProps(fields, 'applicant.gaveBirthToThisChild')} />
            <Field {...getFieldProps(fields, 'applicant.numberOfChildren')} />
            <div className="expandable-group secondary">
              <Accordion>
                <Accordion.Toggle>
                What does dependent children mean?
                </Accordion.Toggle>
                <Accordion.Content>
                  <p>A dependent child is a child that is 18 and under, who you support financially, and who lives with you as a member of your family.</p>

                  <p>Dependent children include:</p>

                  <ul>
                    <li>your own children</li>
                    <li>adopted children</li>
                    <li>step children</li>
                    <li>children at boarding school</li>
                    <li>grandchildren/mokopuna.</li>
                  </ul>
                </Accordion.Content>
              </Accordion>
            </div>
            { numberOfChildren > 2 &&
              <div className='conditional-field'>
                <Field {...getFieldProps(fields, 'applicant.needsDomesticSupport')} />
              </div>
            }
            { numberOfChildren > 0 &&
              <div className='component-grouping'>
                <Field {...getFieldProps(fields, 'children.ages')} />
                { overFifteens &&
                  <Field {...getFieldProps(fields, 'children.financiallyIndependant')} />
                }
                { overFifteens &&
                  <div className="expandable-group secondary">
                    <Accordion>
                      <Accordion.Toggle>
                      What does financially independent mean?
                      </Accordion.Toggle>
                      <Accordion.Content>
                        <p>Your child is considered financially independent if:</p>

                        <ul>
                          <li>they work more than 30 hours a week on average</li>
                          <li>they receive a benefit or other government assistance of their own</li>
                          <li>they receive a student allowance.</li>
                        </ul>
                      </Accordion.Content>
                    </Accordion>
                  </div>
                }
                <Field {...getFieldProps(fields, 'child.hasSeriousDisability')} />
                { childHasDisability === 'true' &&
                  <div className='conditional-field'>
                    <Field {...getFieldProps(fields, 'child.requiresConstantCareAndAttention')} />
                    <div className="expandable-group secondary">
                      <Accordion>
                        <Accordion.Toggle>
                        What does constant care and attention mean
                        </Accordion.Toggle>
                        <Accordion.Content>
                          <p>This means a child that requires constant care and attention because of their disability, over and above that of a child of a similar age. It also means that they will be likely to need that care and attention for more than 12 months.</p>
                        </Accordion.Content>
                      </Accordion>
                    </div>
                    { requiresConstantCare === 'true' &&
                      <Field {...getFieldProps(fields, 'child.constantCareUnderSix')} />
                    }
                  </div>
                }
                { (underFives || (childHasDisability === 'true' && requiresConstantCare === 'true' && constantCareUnderSix === 'true')) &&
                  <div className='component-grouping'>
                    <Field {...getFieldProps(fields, 'child.attendsECE')} />
                    <div className="expandable-group secondary">
                      <Accordion>
                        <Accordion.Toggle>
                        What’s an approved early childhood programme?
                        </Accordion.Toggle>
                        <Accordion.Content>
                          <p>Approved early childhood programmes include:</p>

                          <ul>
                            <li>kindergartens and preschools</li>
                            <li>childcare centres and creches</li>
                            <li>playcentres and playgroups</li>
                            <li>Kohanga Reo, Punanga Reo, Aoga and other programmes with a language and culture focus</li>
                            <li>approved home-based care.</li>
                          </ul>
                        </Accordion.Content>
                      </Accordion>
                    </div>
                  </div>
                }
                { (underFives || (childHasDisability === 'true' && requiresConstantCare === 'true' && constantCareUnderSix === 'true')) && attendsECE === 'true' &&
                  <div className='conditional-field'>
                    <Field {...getFieldProps(fields, 'child.WeeklyECEHours')} />
                  </div>
                }
              </div>
            }
          </div>
          </div>
          }

          { isNZResident === 'true' && numberOfChildren > 0 &&
          <div className='section'>
          <div className='section-inner'>
            <h3 className='section-heading'>
              Tō hononga ki āu tamariki<br />
              <span className='english'>Your relationship to your children</span>
            </h3>

            <Field {...getFieldProps(fields, 'applicant.isPrincipalCarer')} />
            <div className="expandable-group secondary">
              <Accordion>
                <Accordion.Toggle>
                Am I the primary carer?
                </Accordion.Toggle>
                <Accordion.Content>
                  <p>The primary carer is the person responsible for the day-to-day care of the children on a permanent basis. If you have a partner and you’re both equally responsible for the care of your children, answer yes to this question.</p>
                </Accordion.Content>
              </Accordion>
            </div>
            <Field {...getFieldProps(fields, 'applicant.allChildrenInTheirFullTimeCare')} />
            <div className="expandable-group secondary">
              <Accordion>
                <Accordion.Toggle>
                What does full-time custody mean?
                </Accordion.Toggle>
                <Accordion.Content>
                  <p>If you have full-time custody of your children it means that you don’t have an arrangement to share custody with anyone else, e.g. an ex-partner or the child’s grandparent.</p>
                </Accordion.Content>
              </Accordion>
            </div>
            {allChildrenInTheirFullTimeCare === 'false' &&
              <div className='conditional-field'>
                <Field {...getFieldProps(fields, 'applicant.isPrincipalCarerForProportion')} />
              </div>
            }
            <Field {...getFieldProps(fields, 'applicant.isParent')} />
            {isParent === 'false' &&
              <div className='conditional-field'>
                <Field {...getFieldProps(fields, 'applicant.isPrincipalCarerForOneYearFromApplicationDate')} />
                {isPrincipalCarerForOneYearFromApplicationDate === 'true' &&
                  <Field {...getFieldProps(fields, 'children.birthParents')} />
                }
                {isPrincipalCarerForOneYearFromApplicationDate === 'true' &&
                  <div className="expandable-group secondary">
                    <Accordion>
                      <Accordion.Toggle>
                      Why do you need to know this information?
                      </Accordion.Toggle>
                      <Accordion.Content>
                        <p>This information is needed to be able to provide you with accurate results. The benefits and/or payments you may be entitled to depend on why the birth parents are unable to care for their child/children.</p>
                      </Accordion.Content>
                    </Accordion>
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
              Mahi/Ako<br />
              <span className='english'>Work/Study</span>
            </h3>

            <Field {...getFieldProps(fields, 'applicant.workOrStudy')} />
            {(workOrStudy === 'study' || workOrStudy === 'both') &&
              <div className='component-grouping'>
                <Field {...getFieldProps(fields, 'applicant.isStudyingFullTime')} />
                <div className="expandable-group secondary">
                  <Accordion>
                    <Accordion.Toggle>
                    How do I know if I’m studying full-time?
                    </Accordion.Toggle>
                    <Accordion.Content>
                      <p>Each tertiary course has a value assigned to it called EFTS (equivalent full-time student). For a course to be approved as full-time, the length of that course must meet a certain EFTS value.</p>
                      <p><a href='https://www.studylink.govt.nz/about-studylink/glossary/efts.html' target='_blank' rel='noopener noreferrer'>How EFTS works</a></p>
                      <p>If you’re unsure about whether you’re studying full-time, check with your education provider.</p>
                    </Accordion.Content>
                  </Accordion>
                </div>
              </div>
            }
            {(workOrStudy === 'work' || workOrStudy === 'both') &&
              <div className='component-grouping'>
                <Field {...getFieldProps(fields, 'applicant.employmentStatus')} />
                <Field {...getFieldProps(fields, 'applicant.worksWeeklyHours')} />
              </div>
            }
            {expectingChild === 'true' &&
              <Field {...getFieldProps(fields, 'applicant.meetsPaidParentalLeaveEmployedRequirements')} />
            }
            {expectingChild === 'true' &&
            <div className="expandable-group secondary">
              <Accordion>
                <Accordion.Toggle>
                What if I was self-employed or had multiple employers?
                </Accordion.Toggle>
                <Accordion.Content>
                  <p>This includes if you have been self-employed up to your due date or
                  date the child comes into your care. This can be for one employer or a
                  combination of employers even if there were periods where you did not work.</p>
                </Accordion.Content>
              </Accordion>
            </div>
            }
            { relationshipStatus && relationshipStatus !== 'single' && isInadequatelySupportedByPartner !== 'true' &&
              <Field {...getFieldProps(fields, 'applicant.doesPartnerWork')} />
            }
            { relationshipStatus && relationshipStatus !== 'single' && isInadequatelySupportedByPartner !== 'true' && doesPartnerWork === 'true' &&
              <Field {...getFieldProps(fields, 'partner.worksWeeklyHours')} />
            }
            {(workOrStudy === 'work' || workOrStudy === 'both' || (relationshipStatus && relationshipStatus !== 'single' && isInadequatelySupportedByPartner !== 'true' && doesPartnerWork === 'true')) && expectingChild === 'true' &&
              <Field {...getFieldProps(fields, 'applicant.isStoppingWorkToCareForChild')} />
            }
          </div>
          </div>
          }

          { isNZResident === 'true' &&
          <div className='section'>
          <div className='section-inner'>
            <h3 className='section-heading'>
              Whiwhinga Moni<br />
              <span className='english'>Income</span>
            </h3>

            <Field {...getFieldProps(fields, 'income.applicant')} />
            <div className="expandable-group secondary">
              <Accordion>
                <Accordion.Toggle>
                What is my gross income and where do I find it?
                </Accordion.Toggle>
                <Accordion.Content>
                  <p>Your gross income is the amount of money you earn before anything is
                  taken out for taxes or other deductions.</p>

                  <p>This includes money from salary, wages, benefits, pensions, interests or dividends.</p>

                  <p>You might find this: </p>

                  <ul>
                    <li>on your payslip from your employer</li>
                    <li>through MyIR</li>
                    <li>directly from your employer.</li>
                  </ul>
                </Accordion.Content>
              </Accordion>
            </div>
            { relationshipStatus && relationshipStatus !== 'single' && isInadequatelySupportedByPartner !== 'true' &&
              <Field {...getFieldProps(fields, 'income.spouse')} />
            }
            <Field {...getFieldProps(fields, 'applicant.receivesIncomeTestedBenefit')} />
            <div className="expandable-group secondary">
              <Accordion>
                <Accordion.Toggle>
                What’s an income-tested benefit or payment?
                </Accordion.Toggle>
                <Accordion.Content>
                  <p>For tax purposes, an income-tested benefit or payment means any one of the following:</p>

                  <ul>
                    <li>Emergency Benefit</li>
                    <li>Jobseeker Support</li>
                    <li>Sole Parent Support</li>
                    <li>Supported Living Payment</li>
                    <li>Young Parent Payment</li>
                    <li>Youth Payment.</li>
                  </ul>
                </Accordion.Content>
              </Accordion>
            </div>
            <Field {...getFieldProps(fields, 'applicant.holdsCommunityServicesCard')} />
            <div className="expandable-group secondary">
              <Accordion>
                <Accordion.Toggle>
                What’s a Community Services Card?
                </Accordion.Toggle>
                <Accordion.Content>
                  <p>A Community Services Card helps you and your family with the costs of health care.</p>
                </Accordion.Content>
              </Accordion>
            </div>
          </div>
          </div>
          }

          { isNZResident === 'true' &&
          <div className='section'>
          <div className='section-inner'>
            <h3 className='section-heading'>
              Wāhi Noho<br />
              <span className='english'>Accommodation</span>
            </h3>

            <Field {...getFieldProps(fields, 'applicant.hasAccommodationCosts')} />
            <div className="expandable-group secondary">
              <Accordion>
                <Accordion.Toggle>
                What are accommodation costs?
                </Accordion.Toggle>
                <Accordion.Content>
                  <p>Accommodation costs include:</p>

                  <ul>
                    <li>rent</li>
                    <li>board</li>
                    <li>the costs of owning a home, e.g. a mortgage, house insurance payments, annual council rates and essential repairs and maintenance.</li>
                  </ul>
                </Accordion.Content>
              </Accordion>
            </div>

            { hasAccommodationCosts === 'true' &&
              <div className='component-grouping'>
                <Field {...getFieldProps(fields, 'applicant.hasSocialHousing')} />
                <div className="expandable-group secondary">
                  <Accordion>
                    <Accordion.Toggle>
                    What’s a social housing provider?
                    </Accordion.Toggle>
                    <Accordion.Content>
                      <p>Social housing properties are rented out by approved social and
                      community housing providers, e.g. Housing New Zealand, city councils
                      and Salvation Army</p>

                      <p>If you aren’t sure whether you live in a social or community housing
                      home, you’ll need to check with your landlord.</p>
                    </Accordion.Content>
                  </Accordion>
                </div>
              </div>
            }
          </div>
          </div>
          }

          { isNZResident === 'true' &&
            <div className="form-actions">
              <button type="submit" disabled={submitting}>Submit my answers</button>
            </div>
          }
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
  piwikTrackPost: PropTypes.func,
  submitting: PropTypes.bool,
  isNZResident: PropTypes.string,
  relationshipStatus: PropTypes.string,
  isInadequatelySupportedByPartner: PropTypes.string,
  numberOfChildren: PropTypes.string,
  childrenAges: PropTypes.array,
  childHasDisability: PropTypes.string,
  requiresConstantCare: PropTypes.string,
  constantCareUnderSix: PropTypes.string,
  attendsECE: PropTypes.string,
  allChildrenInTheirFullTimeCare: PropTypes.string,
  isParent: PropTypes.string,
  isPrincipalCarerForOneYearFromApplicationDate: PropTypes.string,
  workOrStudy: PropTypes.string,
  expectingChild: PropTypes.string,
  doesPartnerWork: PropTypes.string,
  hasAccommodationCosts: PropTypes.string
}

const selector = formValueSelector('entitlements')

const mapStateToProps = (state) => ({
  fetchingSchema: get(state, 'entitlements.fetchingSchema'),
  schema: get(state, 'entitlements.schema'),
  isNZResident: selector(state, 'applicant.isNZResident'),
  relationshipStatus: selector(state, 'applicant.relationshipStatus'),
  isInadequatelySupportedByPartner: selector(state, 'applicant.isInadequatelySupportedByPartner'),
  numberOfChildren: selector(state, 'applicant.numberOfChildren'),
  childrenAges: selector(state, 'children.ages'),
  childHasDisability: selector(state, 'child.hasSeriousDisability'),
  requiresConstantCare: selector(state, 'child.requiresConstantCareAndAttention'),
  constantCareUnderSix: selector(state, 'child.constantCareUnderSix'),
  attendsECE: selector(state, 'child.attendsECE'),
  allChildrenInTheirFullTimeCare: selector(state, 'applicant.allChildrenInTheirFullTimeCare'),
  isParent: selector(state, 'applicant.isParent'),
  isPrincipalCarerForOneYearFromApplicationDate: selector(state, 'applicant.isPrincipalCarerForOneYearFromApplicationDate'),
  workOrStudy: selector(state, 'applicant.workOrStudy'),
  expectingChild: selector(state, 'applicant.gaveBirthToThisChild'),
  doesPartnerWork: selector(state, 'applicant.doesPartnerWork'),
  hasAccommodationCosts: selector(state, 'applicant.hasAccommodationCosts')
})

EntitlementsQuestions = reduxForm({
  form: 'entitlements',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
  onSubmitFail: (values, dispatch) => {
    window.setTimeout(scrollToFirstError, 200)
    const piwikEvent = {
      'category': 'Financial help',
      'action': 'Questions page - click submit (errors)',
      'name': 'Submit my answers (errors)'
    }
    dispatch(piwikTrackPost('Financial help', piwikEvent))
  }
})(EntitlementsQuestions)

export default connect(
  mapStateToProps,
  {
    fetchSchema,
    postToReasoner,
    piwikTrackPost
  }
)(EntitlementsQuestions)
