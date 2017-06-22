import React, { PropTypes } from 'react'
import { Field } from 'redux-form'
import FieldReview from './field-review'
import SubFieldReview from './sub-field-review'
import { formatAddress, formatDate } from './utils'
import renderWarning from '../../fields/render-warning'
import {
  yesNo,
  yesNoNotSure,
  citizenshipSources,
  getOptionDisplay
} from '../../options'

const renderStep2Review = ({ formState, onEdit }) => {
  const {
    isCitizen, isPermanentResident, isNZRealmResident, isAuResidentOrCitizen,
    nonCitizenDocNumber, citizenshipSource, citizenshipPassportNumber
  } = formState.mother;
  return <div className="review-section">
    <div className="section-heading">
      <h3>Whaea <br/> Mother</h3>
      <button type="button" onClick={() => onEdit('mother-details')} className="section-edit-btn">Edit</button>
    </div>

    <FieldReview
      label="All first name(s) mother is currently known by"
      name="mother.firstNames"
      value={formState.mother.firstNames}
      section="mother-details"
      onEdit={onEdit}
    />
    <FieldReview
      label="Surname of mother (currently known by)"
      name="mother.surname"
      value={formState.mother.surname}
      section="mother-details"
      onEdit={onEdit}
    />
    <FieldReview
      label="All first name(s) of mother at birth (if different from current name)"
      name="mother.firstNamesAtBirth"
      value={formState.mother.firstNamesAtBirth}
      section="mother-details"
      onEdit={onEdit}
    />
    <FieldReview
      label="Surname of mother at birth (if different from current name)"
      name="mother.surnameAtBirth"
      value={formState.mother.surnameAtBirth}
      section="mother-details"
      onEdit={onEdit}
    />
    <FieldReview
      label="Mother's date of birth"
      name="mother.dateOfBirth"
      value={formatDate(formState.mother.dateOfBirth)}
      section="mother-details"
      onEdit={onEdit}
    />
    <FieldReview
      label="Place of Birth - City/town"
      name="mother.placeOfBirth"
      value={formState.mother.placeOfBirth}
      section="mother-details"
      onEdit={onEdit}
    />
    <FieldReview
      label="Place of Birth - Country (if born overseas)"
      name="mother.countryOfBirth"
      value={formState.mother.countryOfBirth}
      section="mother-details"
      onEdit={onEdit}
    />
    <FieldReview
      label="Home address"
      name="mother.homeAddress.line1"
      value={formatAddress(formState.mother.homeAddress)}
      section="mother-details"
      onEdit={onEdit}
    />
    <FieldReview
      label="Is the mother a descendant of a New Zealand Māori?"
      name="mother.maoriDescendant"
      value={getOptionDisplay(yesNoNotSure, formState.mother.maoriDescendant)}
      section="mother-details"
      onEdit={onEdit}
    />
    <FieldReview
      label="Which ethnic group(s) does the mother belong to?"
      name="mother.ethnicGroups"
      value={formState.mother.ethnicGroups.join(', ')}
      section="mother-details"
      onEdit={onEdit}
    />
    { formState.mother.ethnicGroups && formState.mother.ethnicGroups.indexOf('Other') > -1 &&
      <FieldReview
        label="Please describe the mother’s ethnicity"
        name="mother.ethnicityDescription"
        value={formState.mother.ethnicityDescription}
        section="mother-details"
        onEdit={onEdit}
      />
    }
    <FieldReview
      label="Is the mother a New Zealand citizen?"
      name="mother.isCitizen"
      value={getOptionDisplay(yesNo, isCitizen)}
      section="mother-details"
      onEdit={onEdit}
    />
    { isCitizen === 'no' &&
      <div className="review-subfields">
        <SubFieldReview
          label="Is the mother a New Zealand permanent resident?"
          name="mother.isPermanentResident"
          value={getOptionDisplay(yesNo, isPermanentResident)}
          section="mother-details"
        />
        <SubFieldReview
          label="Is the mother a resident of the Cook Islands, Niue or Tokelau?"
          name="mother.isNZRealmResident"
          value={getOptionDisplay(yesNo, isNZRealmResident)}
          section="mother-details"
        />
        <SubFieldReview
          label="Is the mother an Australian citizen or permanent resident of Australia?"
          name="mother.isAuResidentOrCitizen"
          value={getOptionDisplay(yesNo, isAuResidentOrCitizen)}
          section="mother-details"
        />
        <SubFieldReview
          label="Passport/travel document number the mother entered New Zealand on:"
          name="mother.nonCitizenDocNumber"
          value={nonCitizenDocNumber}
          section="mother-details"
        />
      </div>
    }

    { isCitizen === 'yes' &&
      <div className="review-subfields">
        <SubFieldReview
          label="Mother is"
          name="mother.citizenshipSource"
          value={getOptionDisplay(citizenshipSources, citizenshipSource)}
          section="mother-details"
        />
        { (citizenshipSource === 'bornInNiue' ||
           citizenshipSource === 'bornInCookIslands' ||
           citizenshipSource === 'bornInTokelau') &&
          <SubFieldReview
            label="Mother's New Zealand passport number:"
            name="mother.citizenshipPassportNumber"
            value={citizenshipPassportNumber}
            section="mother-details"
          />
        }
      </div>
    }

    <Field
      name="mother.citizenshipWarning"
      component={renderWarning}
    />

    <FieldReview
      name="mother.daytimePhone"
      label="Daytime contact phone number"
      value={formState.mother.daytimePhone}
      section="mother-details"
      onEdit={onEdit}
    />

    <FieldReview
      name="mother.alternativePhone"
      label="Alternative contact phone number"
      value={formState.mother.alternativePhone}
      section="mother-details"
      onEdit={onEdit}
    />

    <FieldReview
      name="mother.email"
      label="Email address"
      value={formState.mother.email}
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

