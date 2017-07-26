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
import schema from '../schemas/step2'
import getFieldReviewProps from './get-field-review-props'

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
      {...getFieldReviewProps(schema, 'mother.firstNames')}
      component={renderFieldReview}
      section="mother-details"
      onEdit={onEdit}
    />
    <Field
      {...getFieldReviewProps(schema, 'mother.surname')}
      component={renderFieldReview}
      section="mother-details"
      onEdit={onEdit}
    />
    <Field
      {...getFieldReviewProps(schema, 'mother.firstNamesAtBirth')}
      component={renderFieldReview}
      section="mother-details"
      onEdit={onEdit}
    />
    <Field
      {...getFieldReviewProps(schema, 'mother.surnameAtBirth')}
      component={renderFieldReview}
      section="mother-details"
      onEdit={onEdit}
    />
    <Field
      {...getFieldReviewProps(schema, 'mother.occupation')}
      component={renderFieldReview}
      section="mother-details"
      onEdit={onEdit}
    />
    <Field
      {...getFieldReviewProps(schema, 'mother.dateOfBirth')}
      component={renderFieldReview}
      valueRenderer={formatDate}
      section="mother-details"
      onEdit={onEdit}
    />
    <Field
      {...getFieldReviewProps(schema, 'mother.placeOfBirth')}
      component={renderFieldReview}
      section="mother-details"
      onEdit={onEdit}
    />
    <Field
      {...getFieldReviewProps(schema, 'mother.countryOfBirth')}
      component={renderFieldReview}
      section="mother-details"
      onEdit={onEdit}
    />
    <Field
      {...getFieldReviewProps(schema, 'mother.homeAddress.line1')}
      component={renderFieldReview}
      valueRenderer={() => formatAddress(formState.mother.homeAddress)}
      section="mother-details"
      onEdit={onEdit}
    />
    <Field name="mother.homeAddress.suburb" component={renderReviewValidation} />
    <Field name="mother.homeAddress.line2" component={renderReviewValidation} />
    <Field
      {...getFieldReviewProps(schema, 'mother.maoriDescendant')}
      component={renderFieldReview}
      valueRenderer={getOptionDisplay(yesNoNotSure)}
      section="mother-details"
      onEdit={onEdit}
    />
    <Field
      {...getFieldReviewProps(schema, 'mother.ethnicGroups')}
      component={renderFieldReview}
      valueRenderer={value => value.map(getOptionDisplay(ethnicGroups)).join(', ')}
      section="mother-details"
      onEdit={onEdit}
    />
    { formState.mother.ethnicGroups && formState.mother.ethnicGroups.indexOf('other') > -1 &&
      <Field
        {...getFieldReviewProps(schema, 'mother.ethnicityDescription')}
        component={renderFieldReview}
        section="mother-details"
        onEdit={onEdit}
      />
    }
    <Field
      {...getFieldReviewProps(schema, 'mother.isCitizen')}
      component={renderFieldReview}
      valueRenderer={getOptionDisplay(yesNo)}
      section="mother-details"
      onEdit={onEdit}
    />
    { isCitizen === 'no' &&
      <div className="review-subfields">
        <Field
          {...getFieldReviewProps(schema, 'mother.isPermanentResident')}
          component={renderSubFieldReview}
          valueRenderer={getOptionDisplay(yesNo)}
          section="mother-details"
        />
        <Field
          {...getFieldReviewProps(schema, 'mother.isNZRealmResident')}
          component={renderSubFieldReview}
          valueRenderer={getOptionDisplay(yesNo)}
          section="mother-details"
        />
        <Field
          {...getFieldReviewProps(schema, 'mother.isAuResidentOrCitizen')}
          component={renderSubFieldReview}
          valueRenderer={getOptionDisplay(yesNo)}
          section="mother-details"
        />
        <Field
          {...getFieldReviewProps(schema, 'mother.nonCitizenDocNumber')}
          component={renderSubFieldReview}
          section="mother-details"
        />
      </div>
    }

    { isCitizen === 'yes' &&
      <div className="review-subfields">
        <Field
          {...getFieldReviewProps(schema, 'mother.citizenshipSource')}
          component={renderSubFieldReview}
          valueRenderer={getOptionDisplay(citizenshipSources)}
          section="mother-details"
        />
        { (citizenshipSource === 'bornInNiue' ||
           citizenshipSource === 'bornInCookIslands' ||
           citizenshipSource === 'bornInTokelau') &&
          <Field
            {...getFieldReviewProps(schema, 'mother.citizenshipPassportNumber')}
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
      {...getFieldReviewProps(schema, 'mother.daytimePhone')}
      component={renderFieldReview}
      section="mother-details"
      onEdit={onEdit}
    />

    <Field
      {...getFieldReviewProps(schema, 'mother.alternativePhone')}
      component={renderFieldReview}
      section="mother-details"
      onEdit={onEdit}
    />

    <Field
      {...getFieldReviewProps(schema, 'mother.email')}
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

