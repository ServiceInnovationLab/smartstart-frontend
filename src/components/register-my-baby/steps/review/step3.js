import React, { PropTypes } from 'react'
import { Field } from 'redux-form'
import renderFieldReview from '../../fields/render-review-field'
import renderSubFieldReview from '../../fields/render-review-subfield'
import { formatAddress, formatDate } from './utils'
import renderWarning from '../../fields/render-warning'
import {
  yesNo,
  yesNoNotSure,
  citizenshipSources,
  getOptionDisplay
} from '../../options'

const renderStep3Review = ({ formState, onEdit }) => {
    const { isCitizen, citizenshipSource } = formState.father;
    return <div className="review-section">
      <div className="section-heading">
        <h3>Matua <br/> Father/Other parent</h3>
        <button type="button" onClick={() => onEdit('father-details')} className="section-edit-btn">Edit</button>
      </div>

      <Field
        label="Is the child born as a result of an assisted human reproduction procedure (such as artificial insemination)?"
        name="assistedHumanReproduction"
        component={renderFieldReview}
        valueRenderer={getOptionDisplay(yesNo)}
        section="father-details"
        onEdit={onEdit}
      />

      { formState.assistedHumanReproduction === 'yes' &&
        <div className="review-subfields">
          <Field
            label="I am in a relationship with a man who consented to the procedure. I will name him as the child's father"
            name="assistedHumanReproductionManConsented"
            component={renderSubFieldReview}
            valueRenderer={value => value ? 'Yes' : 'No'}
            section="father-details"
          />
          <Field
            label="I am in a relationship with a woman who consented to the procedure. I will name her as the child's other parent"
            name="assistedHumanReproductionWomanConsented"
            component={renderSubFieldReview}
            valueRenderer={value => value ? 'Yes' : 'No'}
            section="father-details"
          />
          <Field
            label="I used a sperm donor on my own without a consenting partner. I do not know who the father of the child is"
            name="assistedHumanReproductionSpermDonor"
            component={renderSubFieldReview}
            valueRenderer={value => value ? 'Yes' : 'No'}
            section="father-details"
          />
        </div>
      }

      { formState.assistedHumanReproduction === 'no' &&
        <Field
          label="Is the father known?"
          name="fatherKnown"
          component={renderFieldReview}
          valueRenderer={getOptionDisplay(yesNo)}
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
          <Field
            label="All first name(s) father is currently known by"
            name="father.firstNames"
            component={renderFieldReview}
            section="father-details"
            onEdit={onEdit}
          />
          <Field
            label="Surname of father (currently known by)"
            name="father.surname"
            component={renderFieldReview}
            section="father-details"
            onEdit={onEdit}
          />
          <Field
            label="All first name(s) of father at birth (if different from current name)"
            name="father.firstNamesAtBirth"
            component={renderFieldReview}
            section="father-details"
            onEdit={onEdit}
          />
          <Field
            label="Surname of father at birth (if different from current name)"
            name="father.surnameAtBirth"
            component={renderFieldReview}
            section="father-details"
            onEdit={onEdit}
          />
          <Field
            label="father's date of birth"
            name="father.dateOfBirth"
            component={renderFieldReview}
            valueRenderer={formatDate}
            section="father-details"
            onEdit={onEdit}
          />
          <Field
            label="Place of Birth - City/town"
            name="father.placeOfBirth"
            component={renderFieldReview}
            section="father-details"
            onEdit={onEdit}
          />
          <Field
            label="Place of Birth - Country (if born overseas)"
            name="father.countryOfBirth"
            component={renderFieldReview}
            section="father-details"
            onEdit={onEdit}
          />
          <Field
            label="Home address"
            name="father.homeAddress.line1"
            component={renderFieldReview}
            valueRenderer={() => formatAddress(formState.father.homeAddress)}
            section="father-details"
            onEdit={onEdit}
          />
          <Field
            label="Is the father a descendant of a New Zealand Māori?"
            name="father.maoriDescendant"
            component={renderFieldReview}
            valueRenderer={getOptionDisplay(yesNoNotSure)}
            section="father-details"
            onEdit={onEdit}
          />
          <Field
            label="Which ethnic group(s) does the father belong to?"
            name="father.ethnicGroups"
            component={renderFieldReview}
            valueRenderer={value => value.join(', ')}
            section="father-details"
            onEdit={onEdit}
          />
          { formState.father.ethnicGroups && formState.father.ethnicGroups.indexOf('Other') > -1 &&
            <Field
              label="Please describe the father’s ethnicity"
              name="father.ethnicityDescription"
              component={renderFieldReview}
              section="father-details"
              onEdit={onEdit}
            />
          }
          <Field
            label="Is the father a New Zealand citizen?"
            name="father.isCitizen"
            component={renderFieldReview}
            valueRenderer={getOptionDisplay(yesNo)}
            section="father-details"
            onEdit={onEdit}
          />
          { isCitizen === 'no' &&
            <div className="review-subfields">
              <Field
                label="Is the father a New Zealand permanent resident?"
                name="father.isPermanentResident"
                component={renderSubFieldReview}
                valueRenderer={getOptionDisplay(yesNo)}
                section="father-details"
              />
              <Field
                label="Is the father a resident of the Cook Islands, Niue or Tokelau?"
                name="father.isNZRealmResident"
                component={renderSubFieldReview}
                valueRenderer={getOptionDisplay(yesNo)}
                section="father-details"
              />
              <Field
                label="Is the father an Australian citizen or permanent resident of Australia?"
                name="father.isAuResidentOrCitizen"
                component={renderSubFieldReview}
                valueRenderer={getOptionDisplay(yesNo)}
                section="father-details"
              />
              <Field
                label="Passport/travel document number the father entered New Zealand on:"
                name="father.nonCitizenDocNumber"
                component={renderSubFieldReview}
                section="father-details"
              />
            </div>
          }

          { isCitizen === 'yes' &&
            <div className="review-subfields">
              <Field
                label="Father is"
                name="father.citizenshipSource"
                component={renderSubFieldReview}
                valueRenderer={getOptionDisplay(citizenshipSources)}
                section="father-details"
              />
              { (citizenshipSource === 'bornInNiue' ||
                 citizenshipSource === 'bornInCookIslands' ||
                 citizenshipSource === 'bornInTokelau') &&
                <Field
                  label="Father's New Zealand passport number:"
                  name="father.citizenshipPassportNumber"
                  component={renderSubFieldReview}
                  section="father-details"
                />
              }
            </div>
          }

          <Field
            name="father.citizenshipWarning"
            component={renderWarning}
          />

          <Field
            name="father.daytimePhone"
            label="Daytime contact phone number"
            component={renderFieldReview}
            section="father-details"
            onEdit={onEdit}
          />

          <Field
            name="father.alternativePhone"
            label="Alternative contact phone number"
            component={renderFieldReview}
            section="father-details"
            onEdit={onEdit}
          />

          <Field
            name="father.email"
            label="Email address"
            component={renderFieldReview}
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
