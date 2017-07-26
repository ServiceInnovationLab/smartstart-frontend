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
  ethnicGroups,
  citizenshipSources,
  getOptionDisplay
} from '../../options'
import schema from '../schemas/step3'
import getFieldReviewProps from './get-field-review-props'

const renderStep3Review = ({ formState, onEdit }) => {
    const { isCitizen, citizenshipSource } = formState.father || {};
    return <div className="review-section">
      <div className="section-heading">
        <h3>Matua <br/> Father/Other parent</h3>
        <button type="button" onClick={() => onEdit('father-details')} className="section-edit-btn">Edit</button>
      </div>

      <Field
        {...getFieldReviewProps(schema, 'assistedHumanReproduction')}
        component={renderFieldReview}
        valueRenderer={getOptionDisplay(yesNo)}
        section="father-details"
        onEdit={onEdit}
      />

      { formState.assistedHumanReproduction === 'yes' &&
        <div className="review-subfields">
          <Field
            {...getFieldReviewProps(schema, 'assistedHumanReproductionManConsented')}
            component={renderSubFieldReview}
            valueRenderer={value => value ? 'Yes' : 'No'}
            section="father-details"
          />
          <Field
            {...getFieldReviewProps(schema, 'assistedHumanReproductionWomanConsented')}
            component={renderSubFieldReview}
            valueRenderer={value => value ? 'Yes' : 'No'}
            section="father-details"
          />
          <Field
            {...getFieldReviewProps(schema, 'assistedHumanReproductionSpermDonor')}
            component={renderSubFieldReview}
            valueRenderer={value => value ? 'Yes' : 'No'}
            section="father-details"
          />
        </div>
      }

      { formState.assistedHumanReproduction === 'no' &&
        <Field
          {...getFieldReviewProps(schema, 'fatherKnown')}
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
            {...getFieldReviewProps(schema, 'father.firstNames')}
            component={renderFieldReview}
            section="father-details"
            onEdit={onEdit}
          />
          <Field
            {...getFieldReviewProps(schema, 'father.surname')}
            component={renderFieldReview}
            section="father-details"
            onEdit={onEdit}
          />
          <Field
            {...getFieldReviewProps(schema, 'father.firstNamesAtBirth')}
            component={renderFieldReview}
            section="father-details"
            onEdit={onEdit}
          />
          <Field
            {...getFieldReviewProps(schema, 'father.surnameAtBirth')}
            component={renderFieldReview}
            section="father-details"
            onEdit={onEdit}
          />
          <Field
            {...getFieldReviewProps(schema, 'father.occupation')}
            component={renderFieldReview}
            section="father-details"
            onEdit={onEdit}
          />
          <Field
            {...getFieldReviewProps(schema, 'father.dateOfBirth')}
            component={renderFieldReview}
            valueRenderer={formatDate}
            section="father-details"
            onEdit={onEdit}
          />
          <Field
            {...getFieldReviewProps(schema, 'father.placeOfBirth')}
            component={renderFieldReview}
            section="father-details"
            onEdit={onEdit}
          />
          <Field
            {...getFieldReviewProps(schema, 'father.countryOfBirth')}
            component={renderFieldReview}
            section="father-details"
            onEdit={onEdit}
          />
          <Field
            {...getFieldReviewProps(schema, 'father.homeAddress.line1')}
            component={renderFieldReview}
            valueRenderer={() => formatAddress(formState.father.homeAddress)}
            section="father-details"
            onEdit={onEdit}
          />
          <Field name="father.homeAddress.suburb" component={renderReviewValidation} />
          <Field name="father.homeAddress.line2" component={renderReviewValidation} />
          <Field
            {...getFieldReviewProps(schema, 'father.maoriDescendant')}
            component={renderFieldReview}
            valueRenderer={getOptionDisplay(yesNoNotSure)}
            section="father-details"
            onEdit={onEdit}
          />
          <Field
            {...getFieldReviewProps(schema, 'father.ethnicGroups')}
            component={renderFieldReview}
            valueRenderer={value => value.map(getOptionDisplay(ethnicGroups)).join(', ')}
            section="father-details"
            onEdit={onEdit}
          />
          { formState.father.ethnicGroups && formState.father.ethnicGroups.indexOf('other') > -1 &&
            <Field
              {...getFieldReviewProps(schema, 'father.ethnicityDescription')}
              component={renderFieldReview}
              section="father-details"
              onEdit={onEdit}
            />
          }
          <Field
            {...getFieldReviewProps(schema, 'father.isCitizen')}
            component={renderFieldReview}
            valueRenderer={getOptionDisplay(yesNo)}
            section="father-details"
            onEdit={onEdit}
          />
          { isCitizen === 'no' &&
            <div className="review-subfields">
              <Field
                {...getFieldReviewProps(schema, 'father.isPermanentResident')}
                component={renderSubFieldReview}
                valueRenderer={getOptionDisplay(yesNo)}
                section="father-details"
              />
              <Field
                {...getFieldReviewProps(schema, 'father.isNZRealmResident')}
                component={renderSubFieldReview}
                valueRenderer={getOptionDisplay(yesNo)}
                section="father-details"
              />
              <Field
                {...getFieldReviewProps(schema, 'father.isAuResidentOrCitizen')}
                component={renderSubFieldReview}
                valueRenderer={getOptionDisplay(yesNo)}
                section="father-details"
              />
              <Field
                {...getFieldReviewProps(schema, 'father.nonCitizenDocNumber')}
                component={renderSubFieldReview}
                section="father-details"
              />
            </div>
          }

          { isCitizen === 'yes' &&
            <div className="review-subfields">
              <Field
                {...getFieldReviewProps(schema, 'father.citizenshipSource')}
                component={renderSubFieldReview}
                valueRenderer={getOptionDisplay(citizenshipSources)}
                section="father-details"
              />
              { (citizenshipSource === 'bornInNiue' ||
                 citizenshipSource === 'bornInCookIslands' ||
                 citizenshipSource === 'bornInTokelau') &&
                <Field
                  {...getFieldReviewProps(schema, 'father.citizenshipPassportNumber')}
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
            {...getFieldReviewProps(schema, 'father.daytimePhone')}
            component={renderFieldReview}
            section="father-details"
            onEdit={onEdit}
          />

          <Field
            {...getFieldReviewProps(schema, 'father.alternativePhone')}
            component={renderFieldReview}
            section="father-details"
            onEdit={onEdit}
          />

          <Field
            {...getFieldReviewProps(schema, 'father.email')}
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
