import React, { PropTypes } from 'react'
import { Field } from 'redux-form'
import renderFieldReview from '../../fields/render-review-field'
import {
  yesNo,
  irdDeliveryAddresses,
  getOptionDisplay
} from '../../options'

const renderStep5Review = ({ formState, onEdit }) => {
  return <div className="review-section">
    <div className="section-heading">
      <h3>Te Reo Title <br/> Other services</h3>
      <button type="button" onClick={() => onEdit('other-services')} className="section-edit-btn">Edit</button>
    </div>

    <h4>Apply for an IRD number for your child</h4>
    <Field
      name="ird.applyForNumber"
      label="Do you wish to apply for an IRD number for your child?"
      component={renderFieldReview}
      valueRenderer={getOptionDisplay(yesNo)}
      section="other-services"
      onEdit={onEdit}
    />

    { formState.ird.applyForNumber === 'yes' &&
      <div>
        <Field
          name="ird.deliveryAddress"
          label="Address Inland Revenue should post your child's IRD number to"
          component={renderFieldReview}
          valueRenderer={getOptionDisplay(irdDeliveryAddresses)}
          section="other-services"
          onEdit={onEdit}
        />

        {
          formState.ird.deliveryAddress &&
          <Field
            name="ird.numberByEmail"
            label="Do you also wish to receive your child's IRD number by email?"
            component={renderFieldReview}
            valueRenderer={getOptionDisplay(yesNo)}
            section="other-services"
            onEdit={onEdit}
          />
        }

        <Field
          name="ird.taxCreditIRDNumber"
          label="If you have applied for Working for Families Tax Credits for this child please provide your IRD number"
          component={renderFieldReview}
          section="other-services"
          onEdit={onEdit}
        />
      </div>
    }

    <h4>Notify the Ministry of Social Development (MSD) of the birth</h4>

    <Field
      name="msd.notify"
      label="I give permission for Births, Deaths and Marriages to notify the Ministry of Social Development of the birth of my child."
      component={renderFieldReview}
      valueRenderer={value => value ? 'Yes' : 'No'}
      section="other-services"
      onEdit={onEdit}
    />

    { formState.msd && formState.msd.notify &&
      <div>
        <Field
          name="msd.mothersClientNumber"
          label="Mother's MSD client number"
          component={renderFieldReview}
          section="other-services"
          onEdit={onEdit}
        />
        <Field
          name="msd.fathersClientNumber"
          label="Father/Other parent's MSD client number"
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

