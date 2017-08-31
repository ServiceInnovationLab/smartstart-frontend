import React, { PropTypes } from 'react'
import { Field } from 'redux-form'
import times from 'lodash/times'
import renderFieldReview from '../../fields/render-review-field'
import renderSubFieldReview from '../../fields/render-review-subfield'
import { formatDate } from './utils'
import {
  sexes,
  childStatuses,
  parentRelationships,
  getOptionDisplay
} from '../../options'
import schema from '../schemas/step4'
import getFieldReviewProps from './get-field-review-props'

const renderStep4Review = ({ formState, onEdit }) => {
  const isFormHidden = formState.fatherKnown === 'no' ||
    (formState.assistedHumanReproduction === 'yes' && formState.assistedHumanReproductionSpermDonor)

  return <div className="review-section">
    <div className="section-heading">
      <h3>
        Hononga mātua <br/>
        <span className="subtitle">Parent's relationship</span>
      </h3>
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
          {...getFieldReviewProps(schema, 'otherChildren')}
          component={renderFieldReview}
          section="parents-relationship"
          onEdit={onEdit}
        />

        { times(formState.otherChildren).map(idx =>
            <div className="review-subfields" key={idx}>
              <h4>Child {idx + 1}</h4>
              <Field
                {...getFieldReviewProps(schema, 'siblings[].sex')}
                name={`siblings.[${idx}].sex`}
                component={renderSubFieldReview}
                valueRenderer={getOptionDisplay(sexes)}
                section="parents-relationship"
              />
              <Field
                {...getFieldReviewProps(schema, 'siblings[].statusOfChild')}
                name={`siblings.[${idx}].statusOfChild`}
                component={renderSubFieldReview}
                valueRenderer={getOptionDisplay(childStatuses)}
                section="parents-relationship"
              />
              <Field
                {...getFieldReviewProps(schema, 'siblings[].dateOfBirth')}
                name={`siblings.[${idx}].dateOfBirth`}
                component={renderSubFieldReview}
                valueRenderer={formatDate}
                section="parents-relationship"
              />
            </div>
          )
        }

        <Field
          {...getFieldReviewProps(schema, 'parentRelationship')}
          component={renderFieldReview}
          valueRenderer={getOptionDisplay(parentRelationships)}
          section="parents-relationship"
          onEdit={onEdit}
        />

        { (formState.parentRelationship === 'marriage' || formState.parentRelationship === 'civilUnion') &&
          <div className="review-subfields">
            <Field
              {...getFieldReviewProps(schema, 'parentRelationshipDate')}
              component={renderSubFieldReview}
              valueRenderer={formatDate}
              section="parents-relationship"
            />
            <Field
              {...getFieldReviewProps(schema, 'parentRelationshipPlace')}
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

