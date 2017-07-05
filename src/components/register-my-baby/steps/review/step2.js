import React, { PropTypes } from 'react'
import { Field } from 'redux-form'
import renderFieldReview from '../../fields/render-review-field'
import renderSubFieldReview from '../../fields/render-review-subfield'
import renderReviewValidation from '../../fields/render-review-validation'
import { formatAddress, formatDate } from './utils'
import renderWarning from '../../fields/render-warning'
import {
  yesNo,
  yesNoNotSure,
  citizenshipSources,
  ethnicGroups,
  getOptionDisplay
} from '../../options'

const renderStep2Review = ({ formState, onEdit }) => {
  const {
    isCitizen, citizenshipSource
  } = formState.mother;
  return <div className="review-section">
    <div className="section-heading">
      <h3>Whaea <br/> Mother</h3>
      <button type="button" onClick={() => onEdit('mother-details')} className="section-edit-btn">Edit</button>
    </div>

    <Field
      label="All first name(s) mother is currently known by"
      name="mother.firstNames"
      component={renderFieldReview}
      section="mother-details"
      onEdit={onEdit}
    />
    <Field
      label="Surname of mother (currently known by)"
      name="mother.surname"
      component={renderFieldReview}
      section="mother-details"
      onEdit={onEdit}
    />
    <Field
      label="All first name(s) of mother at birth (if different from current name)"
      name="mother.firstNamesAtBirth"
      component={renderFieldReview}
      section="mother-details"
      onEdit={onEdit}
    />
    <Field
      label="Surname of mother at birth (if different from current name)"
      name="mother.surnameAtBirth"
      component={renderFieldReview}
      section="mother-details"
      onEdit={onEdit}
    />
    <Field
      label="Usual occupation, profession or job of mother"
      name="mother.occupation"
      component={renderFieldReview}
      section="mother-details"
      onEdit={onEdit}
    />
    <Field
      label="Mother's date of birth"
      name="mother.dateOfBirth"
      component={renderFieldReview}
      valueRenderer={formatDate}
      section="mother-details"
      onEdit={onEdit}
    />
    <Field
      label="Place of Birth - City/town"
      name="mother.placeOfBirth"
      component={renderFieldReview}
      section="mother-details"
      onEdit={onEdit}
    />
    <Field
      label="Place of Birth - Country (if born overseas)"
      name="mother.countryOfBirth"
      component={renderFieldReview}
      section="mother-details"
      onEdit={onEdit}
    />
    <Field
      label="Home address"
      name="mother.homeAddress.line1"
      component={renderFieldReview}
      valueRenderer={() => formatAddress(formState.mother.homeAddress)}
      section="mother-details"
      onEdit={onEdit}
    />
    <Field name="mother.homeAddress.suburb" component={renderReviewValidation} />
    <Field name="mother.homeAddress.line2" component={renderReviewValidation} />
    <Field
      label="Is the mother a descendant of a New Zealand Māori?"
      name="mother.maoriDescendant"
      component={renderFieldReview}
      valueRenderer={getOptionDisplay(yesNoNotSure)}
      section="mother-details"
      onEdit={onEdit}
    />
    <Field
      label="Which ethnic group(s) does the mother belong to?"
      name="mother.ethnicGroups"
      component={renderFieldReview}
      valueRenderer={value => value.map(getOptionDisplay(ethnicGroups)).join(', ')}
      section="mother-details"
      onEdit={onEdit}
    />
    { formState.mother.ethnicGroups && formState.mother.ethnicGroups.indexOf('other') > -1 &&
      <Field
        label="Please describe the mother’s ethnicity"
        name="mother.ethnicityDescription"
        component={renderFieldReview}
        section="mother-details"
        onEdit={onEdit}
      />
    }
    <Field
      label="Is the mother a New Zealand citizen?"
      name="mother.isCitizen"
      component={renderFieldReview}
      valueRenderer={getOptionDisplay(yesNo)}
      section="mother-details"
      onEdit={onEdit}
    />
    { isCitizen === 'no' &&
      <div className="review-subfields">
        <Field
          label="Is the mother a New Zealand permanent resident?"
          name="mother.isPermanentResident"
          component={renderSubFieldReview}
          valueRenderer={getOptionDisplay(yesNo)}
          section="mother-details"
        />
        <Field
          label="Is the mother a resident of the Cook Islands, Niue or Tokelau?"
          name="mother.isNZRealmResident"
          component={renderSubFieldReview}
          valueRenderer={getOptionDisplay(yesNo)}
          section="mother-details"
        />
        <Field
          label="Is the mother an Australian citizen or permanent resident of Australia?"
          name="mother.isAuResidentOrCitizen"
          component={renderSubFieldReview}
          valueRenderer={getOptionDisplay(yesNo)}
          section="mother-details"
        />
        <Field
          label="Passport/travel document number the mother entered New Zealand on:"
          name="mother.nonCitizenDocNumber"
          component={renderSubFieldReview}
          section="mother-details"
        />
      </div>
    }

    { isCitizen === 'yes' &&
      <div className="review-subfields">
        <Field
          label="Mother is"
          name="mother.citizenshipSource"
          component={renderSubFieldReview}
          valueRenderer={getOptionDisplay(citizenshipSources)}
          section="mother-details"
        />
        { (citizenshipSource === 'bornInNiue' ||
           citizenshipSource === 'bornInCookIslands' ||
           citizenshipSource === 'bornInTokelau') &&
          <Field
            label="Mother's New Zealand passport number:"
            name="mother.citizenshipPassportNumber"
            component={renderSubFieldReview}
            section="mother-details"
          />
        }
      </div>
    }

    <Field
      name="mother.citizenshipWarning"
      component={renderWarning}
    />

    <Field
      name="mother.daytimePhone"
      label="Daytime contact phone number"
      component={renderFieldReview}
      section="mother-details"
      onEdit={onEdit}
    />

    <Field
      name="mother.alternativePhone"
      label="Alternative contact phone number"
      component={renderFieldReview}
      section="mother-details"
      onEdit={onEdit}
    />

    <Field
      name="mother.email"
      label="Email address"
      component={renderFieldReview}
      section="mother-details"
      onEdit={onEdit}
    />
  </div>
}

renderStep2Review.propTypes = {
  formState: PropTypes.object,
  onEdit: PropTypes.func
}

export default renderStep2Review

