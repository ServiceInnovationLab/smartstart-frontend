import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import times from 'lodash/times'
import makeFocusable from '../hoc/make-focusable'
import Accordion from '../accordion'
import validate from './validation'
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
                        <p>A baby is stillborn if the baby is not alive at birth when born, and either;</p>
                        <ul>
                          <li>weighed 400g or more at birth, or</li>
                          <li>the baby is delivered after the 20th week of the pregnancy</li>
                        </ul>
                        <p>You still need to register the birth. If you don’t want to give the baby a first name, you can choose to leave that field blank by adding a dash (-) into the field. A pregnancy miscarriage occurs when the baby is not born alive, and the before the 20th week of the pregnancy.</p>
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
        <h2><span className="visuallyhidden">Step</span> <span className="step-number">4</span> Hononga mātua <br/> Parent's relationship</h2>
        { isFormHidden &&
          <form onSubmit={handleSubmit(this.props.onSubmit)}>
            <div className="informative-text">
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
            <Field {...getFieldProps(schema, 'otherChildren')} />

            { this.renderSiblings(otherChildren) }

            <Field {...getFieldProps(schema, 'parentRelationship')} />

            { (parentRelationship === 'marriage' || parentRelationship === 'civilUnion') &&
              <div className="conditional-field">
                <Field {...getFieldProps(schema, 'parentRelationship')} />
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
                  <p>Not every relationship where two people live together (and are not married, nor in a civil union) is a de facto relationship under the law. Being in a de facto relationship depends on the couple's circumstances, including the couple's ages, the length of the relationship, the degree to which the couple are mutually committed to a shared life together, and the extent to which they make their relationship known publicly, for example, to friends and family. It is important that you know whether or not you are in a de facto relationship before you tick the de facto relationship box. If you are unsure whether you are in a de facto relationship, you should get advice from a lawyer.</p>
                </Accordion.Content>
              </Accordion>
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
  validate
})(ParentRelationshipForm)


const selector = formValueSelector('registration')

ParentRelationshipForm = connect(
  state => ({
    parentRelationship: selector(state, 'parentRelationship'),
    otherChildren: parseInt(selector(state, 'otherChildren')),
    fatherKnown: selector(state, 'fatherKnown'),
    assistedHumanReproduction: selector(state, 'assistedHumanReproduction'),
    assistedHumanReproductionSpermDonor: selector(state, 'assistedHumanReproductionSpermDonor'),
  })
)(ParentRelationshipForm)

export default makeFocusable(ParentRelationshipForm)
