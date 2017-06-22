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

const renderStep3Review = ({ formState, onEdit }) => {
    const {
      isCitizen, isPermanentResident, isNZRealmResident, isAuResidentOrCitizen,
      nonCitizenDocNumber, citizenshipSource, citizenshipPassportNumber
    } = formState.father;
    return <div className="review-section">
      <div className="section-heading">
        <h3>Matua <br/> Father/Other parent</h3>
        <button type="button" onClick={() => onEdit('father-details')} className="section-edit-btn">Edit</button>
      </div>

      <FieldReview
        label="Is the child born as a result of an assisted human reproduction procedure (such as artificial insemination)?"
        name="assistedHumanReproduction"
        value={getOptionDisplay(yesNo, formState.assistedHumanReproduction)}
        section="father-details"
        onEdit={onEdit}
      />

      { formState.assistedHumanReproduction === 'yes' &&
        <div className="review-subfields">
          <SubFieldReview
            label="I am in a relationship with a man who consented to the procedure. I will name him as the child's father"
            name="assistedHumanReproductionManConsented"
            value={formState.assistedHumanReproductionManConsented ? 'Yes' : 'No'}
            section="father-details"
          />
          <SubFieldReview
            label="I am in a relationship with a woman who consented to the procedure. I will name her as the child's other parent"
            name="assistedHumanReproductionWomanConsented"
            value={formState.assistedHumanReproductionWomanConsented ? 'Yes' : 'No'}
            section="father-details"
          />
          <SubFieldReview
            label="I used a sperm donor on my own without a consenting partner. I do not know who the father of the child is"
            name="assistedHumanReproductionSpermDonor"
            value={formState.assistedHumanReproductionSpermDonor ? 'Yes' : 'No'}
            section="father-details"
          />
        </div>
      }

      { formState.assistedHumanReproduction === 'no' &&
        <FieldReview
          label="Is the father known?"
          name="fatherKnown"
          value={getOptionDisplay(yesNo, formState.fatherKnown)}
          section="father-details"
          onEdit={onEdit}
        />
      }

      {
        (
          (
            formState.assistedHumanReproduction === 'no' &&
            formState.fatherKnown === 'yes'
          ) ||
          (
            formState.assistedHumanReproduction === 'yes' &&
            (formState.assistedHumanReproductionManConsented || formState.assistedHumanReproductionWomanConsented)
          )
        ) &&
        <div>
          <FieldReview
            label="All first name(s) father is currently known by"
            name="father.firstNames"
            value={formState.father.firstNames}
            section="father-details"
            onEdit={onEdit}
          />
          <FieldReview
            label="Surname of father (currently known by)"
            name="father.surname"
            value={formState.father.surname}
            section="father-details"
            onEdit={onEdit}
          />
          <FieldReview
            label="All first name(s) of father at birth (if different from current name)"
            name="father.firstNamesAtBirth"
            value={formState.father.firstNamesAtBirth}
            section="father-details"
            onEdit={onEdit}
          />
          <FieldReview
            label="Surname of father at birth (if different from current name)"
            name="father.surnameAtBirth"
            value={formState.father.surnameAtBirth}
            section="father-details"
            onEdit={onEdit}
          />
          <FieldReview
            label="father's date of birth"
            name="father.dateOfBirth"
            value={formatDate(formState.father.dateOfBirth)}
            section="father-details"
            onEdit={onEdit}
          />
          <FieldReview
            label="Place of Birth - City/town"
            name="father.placeOfBirth"
            value={formState.father.placeOfBirth}
            section="father-details"
            onEdit={onEdit}
          />
          <FieldReview
            label="Place of Birth - Country (if born overseas)"
            name="father.countryOfBirth"
            value={formState.father.countryOfBirth}
            section="father-details"
            onEdit={onEdit}
          />
          <FieldReview
            label="Home address"
            name="father.homeAddress.line1"
            value={formatAddress(formState.father.homeAddress)}
            section="father-details"
            onEdit={onEdit}
          />
          <FieldReview
            label="Is the father a descendant of a New Zealand Māori?"
            name="father.maoriDescendant"
            value={getOptionDisplay(yesNoNotSure, formState.father.maoriDescendant)}
            section="father-details"
            onEdit={onEdit}
          />
          <FieldReview
            label="Which ethnic group(s) does the father belong to?"
            name="father.ethnicGroups"
            value={formState.father.ethnicGroups.join(', ')}
            section="father-details"
            onEdit={onEdit}
          />
          { formState.father.ethnicGroups && formState.father.ethnicGroups.indexOf('Other') > -1 &&
            <FieldReview
              label="Please describe the father’s ethnicity"
              name="father.ethnicityDescription"
              value={formState.father.ethnicityDescription}
              section="father-details"
              onEdit={onEdit}
            />
          }
          <FieldReview
            label="Is the father a New Zealand citizen?"
            name="father.isCitizen"
            value={getOptionDisplay(yesNo, isCitizen)}
            section="father-details"
            onEdit={onEdit}
          />
          { isCitizen === 'no' &&
            <div className="review-subfields">
              <SubFieldReview
                label="Is the father a New Zealand permanent resident?"
                name="father.isPermanentResident"
                value={getOptionDisplay(yesNo, isPermanentResident)}
                section="father-details"
              />
              <SubFieldReview
                label="Is the father a resident of the Cook Islands, Niue or Tokelau?"
                name="father.isNZRealmResident"
                value={getOptionDisplay(yesNo, isNZRealmResident)}
                section="father-details"
              />
              <SubFieldReview
                label="Is the father an Australian citizen or permanent resident of Australia?"
                name="father.isAuResidentOrCitizen"
                value={getOptionDisplay(yesNo, isAuResidentOrCitizen)}
                section="father-details"
              />
              <SubFieldReview
                label="Passport/travel document number the father entered New Zealand on:"
                name="father.nonCitizenDocNumber"
                value={nonCitizenDocNumber}
                section="father-details"
              />
            </div>
          }

          { isCitizen === 'yes' &&
            <div className="review-subfields">
              <SubFieldReview
                label="Father is"
                name="father.citizenshipSource"
                value={getOptionDisplay(citizenshipSources, citizenshipSource)}
                section="father-details"
              />
              { (citizenshipSource === 'bornInNiue' ||
                 citizenshipSource === 'bornInCookIslands' ||
                 citizenshipSource === 'bornInTokelau') &&
                <SubFieldReview
                  label="Father's New Zealand passport number:"
                  name="father.citizenshipPassportNumber"
                  value={citizenshipPassportNumber}
                  section="father-details"
                />
              }
            </div>
          }

          <Field
            name="father.citizenshipWarning"
            component={renderWarning}
          />

          <FieldReview
            name="father.daytimePhone"
            label="Daytime contact phone number"
            value={formState.father.daytimePhone}
            section="father-details"
            onEdit={onEdit}
          />

          <FieldReview
            name="father.alternativePhone"
            label="Alternative contact phone number"
            value={formState.father.alternativePhone}
            section="father-details"
            onEdit={onEdit}
          />

          <FieldReview
            name="father.email"
            label="Email address"
            value={formState.father.email}
            section="father-details"
            onEdit={onEdit}
          />
        </div>
      }
    </div>
}

renderStep3Review.propTypes = {
  formState: PropTypes.object,
  onEdit: PropTypes.func
}

export default renderStep3Review
