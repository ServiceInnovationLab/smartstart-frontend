import React, { PropTypes } from 'react'
import FieldReview from './field-review'
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
    <FieldReview
      name="ird.applyForNumber"
      label="Do you wish to apply for an IRD number for your child?"
      value={getOptionDisplay(yesNo, formState.ird.applyForNumber)}
      section="other-services"
      onEdit={onEdit}
    />

    { formState.ird.applyForNumber === 'yes' &&
      <div>
        <FieldReview
          name="ird.deliveryAddress"
          label="Address Inland Revenue should post your child's IRD number to"
          value={getOptionDisplay(irdDeliveryAddresses, formState.ird.deliveryAddress)}
          section="other-services"
          onEdit={onEdit}
        />

        {
          formState.ird.deliveryAddress &&
          <FieldReview
            name="ird.numberByEmail"
            label="Do you also wish to receive your child's IRD number by email?"
            value={getOptionDisplay(yesNo, formState.ird.numberByEmail)}
            section="other-services"
            onEdit={onEdit}
          />
        }

        <FieldReview
          name="ird.taxCreditIRDNumber"
          label="If you have applied for Working for Families Tax Credits for this child please provide your IRD number"
          value={formState.ird.taxCreditIRDNumber}
          section="other-services"
          onEdit={onEdit}
        />
      </div>
    }

    <h4>Notify the Ministry of Social Development (MSD) of the birth</h4>

    <FieldReview
      name="msd.notify"
      label="I give permission for Births, Deaths and Marriages to notify the Ministry of Social Development of the birth of my child."
      value={(formState.msd && formState.msd.notify) ? 'Yes' : 'No'}
      section="other-services"
      onEdit={onEdit}
    />

    { formState.msd && formState.msd.notify &&
      <div>
        <FieldReview
          name="msd.mothersClientNumber"
          label="Mother's MSD client number"
          value={formState.msd.mothersClientNumber}
          section="other-services"
          onEdit={onEdit}
        />
        <FieldReview
          name="msd.fathersClientNumber"
          label="Father/Other parent's MSD client number"
          value={formState.msd.fathersClientNumber}
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

