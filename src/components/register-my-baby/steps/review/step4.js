import React, { PropTypes } from 'react'
import times from 'lodash/times'
import FieldReview from './field-review'
import SubFieldReview from './sub-field-review'
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
        <FieldReview
          label="Are there other children born from the same parent relationship?"
          name="otherChildren"
          value={formState.otherChildren}
          section="parents-relationship"
          onEdit={onEdit}
        />

        { times(formState.otherChildren).map(idx =>
            <div className="review-subfields">
              <h4>Child {idx + 1}</h4>
              <SubFieldReview
                label={`Sex of child ${idx + 1}`}
                name={`siblings.[${idx}].sex`}
                value={getOptionDisplay(sexs, formState.siblings[idx].sex)}
                section="parents-relationship"
              />
              <SubFieldReview
                label="Is this child alive, since died, or were they stillborn?"
                name={`siblings.[${idx}].statusOfChild`}
                value={getOptionDisplay(childStatuses, formState.siblings[idx].statusOfChild)}
                section="parents-relationship"
              />
              <SubFieldReview
                label="What is this child's date of birth?"
                name={`siblings.[${idx}].dateOfBirth`}
                value={formatDate(formState.siblings[idx].dateOfBirth)}
                section="parents-relationship"
              />
            </div>
          )
        }

        <FieldReview
          label="What was the parents' relationship with each other at the time of the child's birth?"
          name="parentRelationship"
          value={getOptionDisplay(parentRelationships, formState.parentRelationship)}
          section="parents-relationship"
          onEdit={onEdit}
        />

        { (formState.parentRelationship === 'marriage' || formState.parentRelationship === 'civilUnion') &&
          <div className="review-subfields">
            <SubFieldReview
              name="parentRelationshipDate"
              label="Date of marriage/civil union"
              value={formatDate(formState.parentRelationshipDate)}
              section="parents-relationship"
            />
            <SubFieldReview
              name="parentRelationshipPlace"
              label="Place of marriage/civil union"
              value={formState.parentRelationshipPlace}
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

