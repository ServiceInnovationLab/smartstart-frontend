import React, { PropTypes } from 'react'
import { Field } from 'redux-form'
import get from 'lodash/get'
import makeMandatoryLabel from '../../hoc/make-mandatory-label'
import renderTextarea from '../../fields/render-textarea'
import renderFieldReview from '../../fields/render-review-field'
import { formatAddress, formatDate } from './utils'
import {
  sexs,
  yesNo,
  yesNoNotSure,
  getOptionDisplay
} from '../../options'
import { requiredWithMessage } from '../../validate'
import {
  REQUIRE_EXPLAINATION
} from '../../validation-messages'
import { maxLength } from '../../normalize'

const renderBirthPlace = formState => category => {
  if (category === 'hospital') {
    return formState.birthPlace.hospital
  } else if (category === 'home') {
    return formatAddress(formState.birthPlace.home)
  } else {
    return formState.birthPlace.other
  }
}

const renderStep1Review = ({formState, submitErrors, onEdit}) => {
  const firstNamesWarning = get(submitErrors, 'child.firstNames')
  const surnameWarning = get(submitErrors, 'child.surname')

  return <div className="review-section">
    <div className="section-heading">
      <h3>Tamaiti <br/> Child</h3>
      <button type="button" onClick={() => onEdit('child-details')} className="section-edit-btn">Edit</button>
    </div>

    <Field
      label="Child's given names"
      name="child.firstNames"
      component={renderFieldReview}
      section="child-details"
      onEdit={onEdit}
    />
    <Field
      label="Child's surname"
      name="child.surname"
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
          validate={[requiredWithMessage(REQUIRE_EXPLAINATION)]}
          normalize={maxLength(600)}
        />
      </div>
    }
    <Field
      label="Sex of child"
      name="child.sex"
      component={renderFieldReview}
      valueRenderer={getOptionDisplay(sexs)}
      section="child-details"
      onEdit={onEdit}
    />
    <Field
      label="Was this child alive at birth?"
      name="child.stillBorn"
      component={renderFieldReview}
      valueRenderer={getOptionDisplay(yesNo)}
      section="child-details"
      onEdit={onEdit}
    />
    <Field
      label="The child's date of birth"
      name="child.birthDate"
      component={renderFieldReview}
      valueRenderer={formatDate}
      section="child-details"
      onEdit={onEdit}
    />
    <Field
      label="Is this child one of a multiple birth (twins, triplets, etc)"
      name="child.oneOfMultiple"
      component={renderFieldReview}
      valueRenderer={getOptionDisplay(yesNo)}
      section="child-details"
      onEdit={onEdit}
    />
    { formState.child.oneOfMultiple === 'yes' &&
      <Field
        label="What is the birth order for this child?"
        name="child.multipleBirthOrder"
        component={renderFieldReview}
        section="child-details"
        onEdit={onEdit}
      />
    }
    <Field
      label="Where was the child born?"
      name="birthPlace.category"
      component={renderFieldReview}
      valueRenderer={renderBirthPlace(formState)}
      section="child-details"
      onEdit={onEdit}
    />
    <Field
      label="Is this child a descendant of a New Zealand Māori?"
      name="child.maoriDescendant"
      component={renderFieldReview}
      valueRenderer={getOptionDisplay(yesNoNotSure)}
      section="child-details"
      onEdit={onEdit}
    />
    <Field
      label="Which ethnic group(s) does this child belong to?"
      name="child.ethnicGroups"
      component={renderFieldReview}
      valueRenderer={value => value.join(', ')}
      section="child-details"
      onEdit={onEdit}
    />
    { formState.child.ethnicGroups && formState.child.ethnicGroups.indexOf('Other') > -1 &&
      <Field
        label="Please describe the child’s ethnicity"
        name="child.ethnicityDescription"
        component={renderFieldReview}
        section="child-details"
        onEdit={onEdit}
      />
    }
  </div>
}

renderStep1Review.propTypes = {
  formState: PropTypes.object,
  submitErrors: PropTypes.object,
  onEdit: PropTypes.func
}
export default renderStep1Review;
