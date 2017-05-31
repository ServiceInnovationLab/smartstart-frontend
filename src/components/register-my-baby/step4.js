import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import times from 'lodash/times'
import Accordion from './accordion'
import renderField from './render-field'
import renderDatepicker from './render-datepicker'
import renderSelect from './render-select'
import renderRadioGroup from './render-radio-group'
import { required, validDate } from './validate'

const validate = () => {
  const errors = {}
  return errors
}

class ParentRelationshipForm extends Component {
  renderSiblings(numberOfSiblings) {
    return numberOfSiblings > 0 ?
      <div className="component-grouping">
        { times(numberOfSiblings).map(idx => (
            <div>
              <h4>Child {idx + 1}</h4>
              <div className="conditional-field" key={`siblings-${idx}`}>
                <Field
                  name={`otherChildren.[${idx}].sex`}
                  component={renderRadioGroup}
                  label={`Sex of child ${idx + 1}`}
                  options={[
                    { value: 'male', display: 'Male'},
                    { value: 'female', display: 'Female'}
                  ]}
                  validate={[required]}
                />
                <Field
                  name={`otherChildren.[${idx}].aliveAtBirth`}
                  component={renderRadioGroup}
                  label="Is this child alive, since died, or were they stillborn?"
                  options={[
                    { value: 'alive', display: 'Alive'},
                    { value: 'sincedied', display: 'Since died'},
                    { value: 'stillborn', display: 'Stillborn'}
                  ]}
                  validate={[required]}
                />
                <Field
                  name={`otherChildren.[${idx}].dateOfBirth`}
                  component={renderDatepicker}
                  label="What is this child's date of birth?"
                  validate={[required, validDate]}
                />
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
    const { parentRelationship, numberOfSiblings, fatherKnown, assistedHumanReproduction, assistedHumanReproductionSpermDonor, handleSubmit, submitting } = this.props
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
              <button type="submit" className="next" disabled={submitting}>Next</button>
            </div>
          </form>
        }

        { !isFormHidden &&
          <form onSubmit={handleSubmit(this.props.onSubmit)}>
            <Field
              name="numberOfSiblings"
              component={renderSelect}
              options={[0, 1, 2, 3, 4, 5, 6, 7, 8]}
              renderEmptyOption={false}
              label="Are there other children born from the same parent relationship?"
              instructionText="Select the number of other children with the same mother and father. If this is the first child together then go to the next question"
              validate={[required]}
            />

            { this.renderSiblings(numberOfSiblings) }

            <Field
              name="parentRelationship"
              component={renderSelect}
              options={['Marriage', 'Civil Union', 'De Facto Relationship', 'Not married/in a Civil Union/De Facto Relationship']}
              label="What was the parents' relationship with each other at the time of the child's birth?"
              validate={[required]}
            />

            { (parentRelationship === 'Marriage' || parentRelationship === 'Civil Union') &&
              <div className="conditional-field">
                <Field
                  name="parentDateOfMarriage"
                  component={renderDatepicker}
                  label="Date of marriage/civil union"
                  validate={[required, validDate]}
                />
                <Field
                  name="parentPlaceOfMarriage"
                  component={renderField}
                  type="text"
                  label="Place of marriage/civil union"
                  instructionText="City or town and Country (if ceremony was performed overseas)"
                  validate={[required]}
                />
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
  numberOfSiblings: PropTypes.number,
  fatherKnown: PropTypes.bool,
  assistedHumanReproduction: PropTypes.bool,
  assistedHumanReproductionSpermDonor: PropTypes.bool,
  onSubmit: PropTypes.func,
  onPrevious: PropTypes.func,
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
    numberOfSiblings: parseInt(selector(state, 'numberOfSiblings')),
    fatherKnown: selector(state, 'fatherKnown'),
    assistedHumanReproduction: selector(state, 'assistedHumanReproduction'),
    assistedHumanReproductionSpermDonor: selector(state, 'assistedHumanReproductionSpermDonor'),
  })
)(ParentRelationshipForm)

export default ParentRelationshipForm

