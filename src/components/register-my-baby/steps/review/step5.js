import React, { PropTypes } from 'react'
import { Field } from 'redux-form'
import renderFieldReview from 'components/form/fields/render-review-field'
import {
  yesNo,
  getIrdDeliveryAddresses,
  getOptionDisplay
} from '../../options'
import schema from '../schemas/step5'
import getFieldReviewProps from './get-field-review-props'

const renderStep5Review = ({ formState, onEdit }) => {
  const isOtherParent = formState.assistedHumanReproduction === 'yes' && formState.assistedHumanReproductionWomanConsented
  const irdDeliveryAddresses = getIrdDeliveryAddresses(isOtherParent)
  return <div className="review-section">
    <div className="section-heading">
      <h3>
        Ētahi atu ratonga <br/>
        <span className="subtitle">Other services</span>
      </h3>
      <button type="button" onClick={() => onEdit('other-services')} className="section-edit-btn">Edit</button>
    </div>

    <h4>Apply for an IRD number for your child</h4>
    <Field
      {...getFieldReviewProps(schema, 'ird.applyForNumber')}
      component={renderFieldReview}
      valueRenderer={getOptionDisplay(yesNo)}
      section="other-services"
      onEdit={onEdit}
    />

    { formState.ird.applyForNumber === 'yes' &&
      <div>
        <Field
          {...getFieldReviewProps(schema, 'ird.deliveryAddress')}
          component={renderFieldReview}
          valueRenderer={getOptionDisplay(irdDeliveryAddresses)}
          section="other-services"
          onEdit={onEdit}
        />

        {
          formState.ird.deliveryAddress &&
          <Field
            {...getFieldReviewProps(schema, 'ird.numberByEmail')}
            component={renderFieldReview}
            valueRenderer={getOptionDisplay(yesNo)}
            section="other-services"
            onEdit={onEdit}
          />
        }

        <Field
          {...getFieldReviewProps(schema, 'ird.taxCreditIRDNumber')}
          component={renderFieldReview}
          section="other-services"
          onEdit={onEdit}
        />
      </div>
    }

    <h4>Notify the Ministry of Social Development (MSD) of the birth</h4>

    <Field
      {...getFieldReviewProps(schema, 'msd.notify')}
      component={renderFieldReview}
      valueRenderer={value => value ? 'Yes' : 'No'}
      section="other-services"
      onEdit={onEdit}
    />

    { formState.msd && formState.msd.notify &&
      <div>
        <Field
          {...getFieldReviewProps(schema, 'msd.mothersClientNumber')}
          component={renderFieldReview}
          section="other-services"
          onEdit={onEdit}
        />
        <Field
          {...getFieldReviewProps(schema, 'msd.fathersClientNumber')}
          component={renderFieldReview}
          section="other-services"
          onEdit={onEdit}
        />
      </div>
    }
  </div>
}

renderStep5Review.propTypes = {
  formState: PropTypes.object,
  onEdit: PropTypes.func
}

export default renderStep5Review

