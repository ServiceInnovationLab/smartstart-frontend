import React, { PropTypes } from 'react'
import { Field } from 'redux-form'
import get from 'lodash/get'
import makeMandatoryLabel from 'components/form/hoc/make-mandatory-label'
import renderTextarea from 'components/form/fields/render-textarea'
import renderFieldReview from 'components/form/fields/render-review-field'
import renderReviewValidation from 'components/form/fields/render-review-validation'
import { formatAddress, formatDate } from './utils'
import {
  sexes,
  yesNo,
  yesNoNotSure,
  ethnicGroups,
  getOptionDisplay
} from '../../options'
import { requiredWithMessage } from 'components/form/validators'
import { validCharRelax } from '../../validate'
import {
  REQUIRE_EXPLAINATION
} from '../../validation-messages'
import { maxLength } from 'components/form/normalizers'
import schema from '../schemas/step1'
import getFieldReviewProps from './get-field-review-props'

const renderBirthPlace = formState => category => {
  if (category === 'hospital') {
    return formState.birthPlace.hospital
  } else if (category === 'home') {
    return formatAddress(formState.birthPlace.home)
  } else {
    return formState.birthPlace.other
  }
}

export const renderEthnicGroupsValue = (formState, target) => value => {
  let ethnicGroupDisplays

  if (value && value.indexOf('other') > -1) {
    value = value.filter(val => val !== 'other')
    ethnicGroupDisplays = value.map(getOptionDisplay(ethnicGroups))
    ethnicGroupDisplays.push(formState[target].ethnicityDescription)
  } else {
    ethnicGroupDisplays = value.map(getOptionDisplay(ethnicGroups))
  }

  return ethnicGroupDisplays.join(', ')
}

const renderStep1Review = ({formState, submitErrors, onEdit}) => {
  const firstNamesWarning = get(submitErrors, 'child.firstNames')
  const surnameWarning = get(submitErrors, 'child.surname')

  return <div className="review-section">
    <div className="section-heading">
      <h3>
        Tamaiti <br/>
        <span className="subtitle">Child</span>
      </h3>
      <button type="button" onClick={() => onEdit('child-details')} className="section-edit-btn">Edit</button>
    </div>

    <Field
      {...getFieldReviewProps(schema, 'child.firstNames')}
      component={renderFieldReview}
      section="child-details"
      onEdit={onEdit}
    />
    <Field
      {...getFieldReviewProps(schema, 'child.surname')}
      component={renderFieldReview}
      section="child-details"
      onEdit={onEdit}
    />
    { (firstNamesWarning || surnameWarning) &&
      <div className="conditional-field">
        <Field
          label={makeMandatoryLabel("Please explain (600 characters)")}
          placeholder="Give your reasons for wanting this name for your child"
          name="child.nameExplaination"
          component={renderTextarea}
          validate={[requiredWithMessage(REQUIRE_EXPLAINATION), validCharRelax]}
          normalize={maxLength(600)}
        />
      </div>
    }
    <Field
      {...getFieldReviewProps(schema, 'child.sex')}
      component={renderFieldReview}
      valueRenderer={getOptionDisplay(sexes)}
      section="child-details"
      onEdit={onEdit}
    />
    <Field
      {...getFieldReviewProps(schema, 'child.aliveAtBirth')}
      component={renderFieldReview}
      valueRenderer={getOptionDisplay(yesNo)}
      section="child-details"
      onEdit={onEdit}
    />
    <Field
      {...getFieldReviewProps(schema, 'child.birthDate')}
      component={renderFieldReview}
      valueRenderer={formatDate}
      section="child-details"
      onEdit={onEdit}
    />
    <Field
      {...getFieldReviewProps(schema, 'child.oneOfMultiple')}
      component={renderFieldReview}
      valueRenderer={getOptionDisplay(yesNo)}
      section="child-details"
      onEdit={onEdit}
    />
    { formState.child.oneOfMultiple === 'yes' &&
      <Field
        {...getFieldReviewProps(schema, 'child.multipleBirthOrder')}
        component={renderFieldReview}
        section="child-details"
        onEdit={onEdit}
      />
    }
    <Field
      {...getFieldReviewProps(schema, 'birthPlace.category')}
      component={renderFieldReview}
      valueRenderer={renderBirthPlace(formState)}
      section="child-details"
      onEdit={onEdit}
    />
    <Field name="birthPlace.home.line1" component={renderReviewValidation} />
    <Field name="birthPlace.home.suburb" component={renderReviewValidation} />
    <Field name="birthPlace.home.line2" component={renderReviewValidation} />
    <Field name="birthPlace.other" component={renderReviewValidation} />
    <Field
      {...getFieldReviewProps(schema, 'child.maoriDescendant')}
      component={renderFieldReview}
      valueRenderer={getOptionDisplay(yesNoNotSure)}
      section="child-details"
      onEdit={onEdit}
    />
    <Field
      {...getFieldReviewProps(schema, 'child.ethnicGroups')}
      component={renderFieldReview}
      valueRenderer={renderEthnicGroupsValue(formState, 'child')}
      section="child-details"
      onEdit={onEdit}
    />
  </div>
}

renderStep1Review.propTypes = {
  formState: PropTypes.object,
  submitErrors: PropTypes.object,
  onEdit: PropTypes.func
}
export default renderStep1Review;
