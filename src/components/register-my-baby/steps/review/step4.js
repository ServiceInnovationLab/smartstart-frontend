import React, { PropTypes } from 'react'
import { Field } from 'redux-form'
import times from 'lodash/times'
import renderFieldReview from '../../fields/render-review-field'
import renderSubFieldReview from '../../fields/render-review-subfield'
import { formatDate } from './utils'
import {
  sexs,
  childStatuses,
  parentRelationships,
  getOptionDisplay
} from '../../options'

const renderStep4Review = ({ formState, onEdit }) => {
  const isFormHidden = formState.fatherKnown === 'no' ||
    (formState.assistedHumanReproduction === 'yes' && formState.assistedHumanReproductionSpermDonor)

  return <div className="review-section">
    <div className="section-heading">
      <h3>Hononga mātua <br/> Parent's relationship</h3>
      <button type="button" onClick={() => onEdit('parents-relationship')} className="section-edit-btn">Edit</button>
    </div>

    { isFormHidden &&
      <div className="informative-text">
        You indicated that the father is not known, so you do not need to complete this step.
      </div>
    }

    { !isFormHidden &&
      <div>
        <Field
          label="Are there other children born from the same parent relationship?"
          name="otherChildren"
          component={renderFieldReview}
          section="parents-relationship"
          onEdit={onEdit}
        />

        { times(formState.otherChildren).map(idx =>
            <div className="review-subfields">
              <h4>Child {idx + 1}</h4>
              <Field
                label={`Sex of child ${idx + 1}`}
                name={`siblings.[${idx}].sex`}
                component={renderSubFieldReview}
                valueRenderer={getOptionDisplay(sexs)}
                section="parents-relationship"
              />
              <Field
                label="Is this child alive, since died, or were they stillborn?"
                name={`siblings.[${idx}].statusOfChild`}
                component={renderSubFieldReview}
                valueRenderer={getOptionDisplay(childStatuses)}
                section="parents-relationship"
              />
              <Field
                label="What is this child's date of birth?"
                name={`siblings.[${idx}].dateOfBirth`}
                component={renderSubFieldReview}
                valueRenderer={formatDate}
                section="parents-relationship"
              />
            </div>
          )
        }

        <Field
          label="What was the parents' relationship with each other at the time of the child's birth?"
          name="parentRelationship"
          component={renderFieldReview}
          valueRenderer={getOptionDisplay(parentRelationships)}
          section="parents-relationship"
          onEdit={onEdit}
        />

        { (formState.parentRelationship === 'marriage' || formState.parentRelationship === 'civilUnion') &&
          <div className="review-subfields">
            <Field
              name="parentRelationshipDate"
              label="Date of marriage/civil union"
              component={renderSubFieldReview}
              valueRenderer={formatDate}
              section="parents-relationship"
            />
            <Field
              name="parentRelationshipPlace"
              label="Place of marriage/civil union"
              component={renderSubFieldReview}
              section="parents-relationship"
            />
          </div>
        }
      </div>
    }
  </div>
}

renderStep4Review.propTypes = {
  formState: PropTypes.object,
  onEdit: PropTypes.func
}

export default renderStep4Review

