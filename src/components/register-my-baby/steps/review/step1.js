import React, { PropTypes } from 'react'
import FieldReview from './field-review'
import { formatAddress, formatDate } from './utils'
import {
  sexs,
  yesNo,
  yesNoNotSure,
  getOptionDisplay
} from '../../options'

const renderStep1Review = ({formState, onEdit}) => {
  const birthPlaceCategory = formState.birthPlace.category
  let birthPlaceValue;

  if (birthPlaceCategory === 'hospital') {
    birthPlaceValue = formState.birthPlace.hospital
  } else if (birthPlaceCategory === 'home') {
    birthPlaceValue = formatAddress(formState.birthPlace.home)
  } else {
    birthPlaceValue = formState.birthPlace.other
  }

  return <div className="review-section">
    <div className="section-heading">
      <h3>Tamaiti <br/> Child</h3>
      <button type="button" onClick={() => onEdit('child-details')} className="section-edit-btn">Edit</button>
    </div>

    <FieldReview
      label="Child's given names"
      name="child.firstNames"
      value={formState.child.firstNames}
      section="child-details"
      onEdit={onEdit}
    />
    <FieldReview
      label="Child's surname"
      name="child.surname"
      value={formState.child.surname}
      section="child-details"
      onEdit={onEdit}
    />
    <FieldReview
      label="Sex of child"
      name="child.sex"
      value={getOptionDisplay(sexs, formState.child.sex)}
      section="child-details"
      onEdit={onEdit}
    />
    <FieldReview
      label="Was this child alive at birth?"
      name="child.stillBorn"
      value={getOptionDisplay(yesNo, formState.child.stillBorn)}
      section="child-details"
      onEdit={onEdit}
    />
    <FieldReview
      label="The child's date of birth"
      name="child.birthDate"
      value={formatDate(formState.child.birthDate)}
      section="child-details"
      onEdit={onEdit}
    />
    <FieldReview
      label="Is this child one of a multiple birth (twins, triplets, etc)"
      name="child.oneOfMultiple"
      value={getOptionDisplay(yesNo, formState.child.oneOfMultiple)}
      section="child-details"
      onEdit={onEdit}
    />
    { formState.child.oneOfMultiple === 'yes' &&
      <FieldReview
        label="What is the birth order for this child?"
        name="child.multipleBirthOrder"
        value={formState.child.multipleBirthOrder}
        section="child-details"
        onEdit={onEdit}
      />
    }
    <FieldReview
      label="Where was the child born?"
      name="birthPlace.category"
      value={birthPlaceValue}
      section="child-details"
      onEdit={onEdit}
    />
    <FieldReview
      label="Is this child a descendant of a New Zealand Māori?"
      name="child.maoriDescendant"
      value={getOptionDisplay(yesNoNotSure, formState.child.maoriDescendant)}
      section="child-details"
      onEdit={onEdit}
    />
    <FieldReview
      label="Which ethnic group(s) does this child belong to?"
      name="child.ethnicGroups"
      value={formState.child.ethnicGroups.join(', ')}
      section="child-details"
      onEdit={onEdit}
    />
    { formState.child.ethnicGroups && formState.child.ethnicGroups.indexOf('Other') > -1 &&
      <FieldReview
        label="Please describe the child’s ethnicity"
        name="child.ethnicityDescription"
        value={formState.child.ethnicityDescription}
        section="child-details"
        onEdit={onEdit}
      />
    }
  </div>
}

renderStep1Review.propTypes = {
  formState: PropTypes.object,
  onEdit: PropTypes.func
}
export default renderStep1Review;
