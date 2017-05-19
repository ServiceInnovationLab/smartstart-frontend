import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import times from 'lodash/times'
import Accordion from './accordion'
import renderField from './render-field'
import renderDatepicker from './render-datepicker'
import renderSelect from './render-select'
import renderRadioGroup from './render-radio-group'
import { required } from './validate'

const validate = () => {
  const errors = {}
  return errors
}

class ParentRelationshipForm extends Component {
  renderSiblings(numberOfSiblings) {
    return numberOfSiblings > 0 ?
      <div>
        { times(numberOfSiblings).map(idx => (
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
                validate={[required]}
              />
            </div>
          ))
        }
      </div> :
      null
  }

  render() {
    const { parentRelationship, numberOfSiblings, handleSubmit, submitting } = this.props
    return (
      <div>
        <h2><span className="visuallyhidden">Step</span> <span className="step-number">4</span> Hononga mātua <br/> Parent's relationship</h2>
        <form onSubmit={handleSubmit(this.props.onSubmit)}>
          <Field
            name="numberOfSiblings"
            component={renderSelect}
            options={[0, 1, 2, 3, 4, 5, 6, 7, 8]}
            label="Select the number of other children with the same mother and father. If this is the first child together then go to the next question"
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
                validate={[required]}
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
      </div>
    )
  }
}

ParentRelationshipForm.propTypes = {
  parentRelationship: PropTypes.string,
  numberOfSiblings: PropTypes.number,
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
    numberOfSiblings: parseInt(selector(state, 'numberOfSiblings'))
  })
)(ParentRelationshipForm)

export default ParentRelationshipForm

