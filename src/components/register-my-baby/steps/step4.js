import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import times from 'lodash/times'
import get from 'lodash/get'
import makeFocusable from '../hoc/make-focusable'
import Accordion from '../accordion'
import SaveAsDraft from '../save-as-draft'
import validate from './validation'
import warn from '../warn'
import schema from './schemas/step4'
import getFieldProps from './get-field-props'

class ParentRelationshipForm extends Component {
  renderSiblings(otherChildren) {
    return otherChildren > 0 ?
      <div className="component-grouping">
        { times(otherChildren).map(idx => (
            <div key={idx}>
              <h4>Child {idx + 1}</h4>
              <div className="conditional-field" key={`siblings-${idx}`}>
                <Field {...getFieldProps(schema, 'siblings[].sex')} name={`siblings.[${idx}].sex`} />
                <Field {...getFieldProps(schema, 'siblings[].statusOfChild')} name={`siblings.[${idx}].statusOfChild`} />
                <Field {...getFieldProps(schema, 'siblings[].dateOfBirth')} name={`siblings.[${idx}].dateOfBirth`} />
                { idx === 0 &&
                  <div className="expandable-group secondary">
                    <Accordion>
                      <Accordion.Toggle>
                        What is a stillbirth?
                      </Accordion.Toggle>
                      <Accordion.Content>
                        <p>A baby is stillborn if the baby is not alive at birth, and either:</p>
                        <ul>
                          <li>weighed 400g or more at birth; or</li>
                          <li>the baby is delivered after the 20th week of the pregnancy.</li>
                        </ul>
                        <p>You still need to register the birth. If you don't want to give the baby a first name, you can choose to leave that field blank by adding a dash (-) into the field.</p>
                        <strong>What about a miscarriage?</strong>
                        <p>A pregnancy is termed a miscarriage if the baby is not born alive, and is born before the 20th week of the pregnancy. You don't have to register the baby if you have suffered a miscarriage.</p>
                      </Accordion.Content>
                    </Accordion>
                  </div>
                }
              </div>
            </div>
          ))
        }
      </div> :
      null
  }

  render() {
    const { parentRelationship, otherChildren, fatherKnown, assistedHumanReproduction, assistedHumanReproductionSpermDonor, handleSubmit, submitting } = this.props
    const isFormHidden = fatherKnown === 'no' || (assistedHumanReproduction === 'yes' && assistedHumanReproductionSpermDonor)

    return (
      <div>
        <h2 className="step-heading">
          <span className="visuallyhidden">Step</span>
          <span className="step-number">4</span>
          Hononga mātua <br/>
          <span className="english">Parents' relationship</span>
        </h2>

        <SaveAsDraft step={4} />

        { isFormHidden &&
          <form onSubmit={handleSubmit(this.props.onSubmit)}>
            <div className="informative-text intro">
              You indicated that the father is not known, so you do not need to complete this step.
              <br/>
              Just select <strong>Next</strong> to continue on or <strong>Back</strong> if you wish to change anything on the step before.
            </div>
            <div className="form-actions">
              <button type="button" className="previous" onClick={this.props.onPrevious}>Back</button>
              <div>
                { this.props.isReviewing &&
                  <button type="button" className="review" onClick={handleSubmit(this.props.onComebackToReview)}>Return to review</button>
                }
                <button type="submit" className="next" disabled={submitting}>Next</button>
              </div>
            </div>
          </form>
        }

        { !isFormHidden &&
          <form onSubmit={handleSubmit(this.props.onSubmit)}>
            <div className="informative-text">
              This section is where you give information on the relationship of the parents, including other children from the same relationship.
            </div>

            <Field {...getFieldProps(schema, 'otherChildren')} />

            { this.renderSiblings(otherChildren) }

            <Field {...getFieldProps(schema, 'parentRelationship')} />

            { (parentRelationship === 'marriage' || parentRelationship === 'civilUnion') &&
              <div className="conditional-field">
                <Field {...getFieldProps(schema, 'parentRelationshipDate')} />
                <Field {...getFieldProps(schema, 'parentRelationshipPlace')} />
              </div>
            }

            <div className="expandable-group secondary">
              <Accordion>
                <Accordion.Toggle>
                  What is a de facto relationship?
                </Accordion.Toggle>
                <Accordion.Content>
                  <p>Not every relationship where two people live together (and aren't married, or in a civil union) is a de facto relationship under the law.</p>
                  <p>Being considered to be in a de facto relationship depends on a number of things, including:</p>
                  <ul>
                    <li>the couple's circumstances, including their ages;</li>
                    <li>the length of their relationship;</li>
                    <li>how committed the couple are to a sharing a life together; and</li>
                    <li>how public they make their relationship to friends and family.</li>
                  </ul>
                  <p>It's important that you know whether or not you are in a de facto relationship before you select the de facto relationship option. If you're unsure you should get advice from a lawyer.</p>
                </Accordion.Content>
              </Accordion>
            </div>

            <div className="form-actions">
              { this.props.isReviewing &&
                <div className="review-btn-positioner">
                  <button type="button" className="review" onClick={handleSubmit(this.props.onComebackToReview)}>Return to review</button>
                </div>
              }
              { this.props.isReviewing ?
                <button type="button" className="previous" onClick={handleSubmit(this.props.onPrevious)}>Back</button>:
                <button type="button" className="previous" onClick={this.props.onPrevious}>Back</button>
              }
              <button type="submit" className="next" disabled={submitting}>Next</button>
            </div>
          </form>
        }
      </div>
    )
  }
}

ParentRelationshipForm.propTypes = {
  parentRelationship: PropTypes.string,
  otherChildren: PropTypes.number,
  fatherKnown: PropTypes.string,
  assistedHumanReproduction: PropTypes.string,
  assistedHumanReproductionSpermDonor: PropTypes.bool,
  onSubmit: PropTypes.func,
  onPrevious: PropTypes.func,
  isReviewing: PropTypes.bool,
  onComebackToReview: PropTypes.func,
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  pristine: PropTypes.bool,
}

ParentRelationshipForm = reduxForm({
  form: 'registration',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
  warn
})(ParentRelationshipForm)


const selector = formValueSelector('registration')

ParentRelationshipForm = connect(
  state => ({
    initialValues: get(state, 'birthRegistration.savedRegistrationForm.data'),
    parentRelationship: selector(state, 'parentRelationship'),
    otherChildren: parseInt(selector(state, 'otherChildren')),
    fatherKnown: selector(state, 'fatherKnown'),
    assistedHumanReproduction: selector(state, 'assistedHumanReproduction'),
    assistedHumanReproductionSpermDonor: selector(state, 'assistedHumanReproductionSpermDonor'),
  })
)(ParentRelationshipForm)

export default makeFocusable(ParentRelationshipForm)
