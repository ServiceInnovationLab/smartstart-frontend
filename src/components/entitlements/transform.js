import deepMap from 'deep-map'
import get from 'lodash/get'
import set from 'lodash/set'
import unset from 'lodash/set'

// 1. change all strings to booleans, numbers etc
// 2. if key is in schema, add to object to be sent
// 3. if key is not is schema, use it to infer keyvalues to send instead
// 4. if object to be sent has keyvalues that shouldn't be sent b/c of other conditions, remove them

const transformType = (value) => {
  if (value === 'true') {
    return true
  } else if (value === 'false') {
    return false
  } else if (!isNaN(parseInt(value, 10))) {
    return parseInt(value, 10)
  }
  return value
}

const transform = (data, schema) => {
  let body = {}

  // 1.
  data = deepMap(data, value => transformType(value))

  // 2.
  schema.forEach(atom => {
    let valueFromForm = get(data, atom.name, null)

    if (valueFromForm !== null) {
      set(body, atom.name, valueFromForm)
    }
  })

  // 3.
  // 3.a. assume normallyLivesInNZ === hasLivedInNZfor2Years
  if (data.applicant && data.applicant.normallyLivesInNZ) {
    set(body, 'applicant.hasLivedInNZfor2Years', true)
    set(body, 'applicant.hasLivedInNZfor3Years', true)
  }
  // 3.b. infer child.isDependent from numberOfChildren
  if (data.applicant && data.applicant.numberOfChildren && data.applicant.numberOfChildren !== '0') {
    set(body, 'child.isDependent', true)
  }
  // 3.c. set child.Age based on the lowest provided value for children.ages
  // and set dependentsUnder14 using the same
  if (data.children && data.children.ages && data.children.ages.length) {
    // first element in the array is the lowest
    set(body, 'child.Age', data.children.ages[0])
    if (data.children.ages[0] < 14) {
      // we don't need to provide the full number of dependents, just need at least 1
      set(body, 'children.dependentsUnder14', 1)
    }
  }
  // 3.d. lower child.Age as needed if child.constantCareUnderSix
  // this is a spurious made up value to just get us under the threshold as appropriate
  if (body.child.Age > 5 && data.child.constantCareUnderSix) {
    set(body, 'child.Age', 5)
  }
  // 3.f. we don't provide any cash threshold values, so just set them to true
  set(body, 'threshold.cash.AccommodationSupplement', true)

  // 4.
  // 4.a hasDisability
  if (data.applicant && !data.applicant.hasDisability) {
    unset(body, 'applicant.hasSeriousDisability')
  }
  // 4.b. relationshipStatus
  if (data.applicant && data.applicant.relationshipStatus === 'single') {
    unset(body, 'applicant.isInadequatelySupportedByPartner')
  }
  // 4.c. needsDomesticSupport
  if (data.applicant && data.applicant.numberOfChildren && parseInt(data.applicant.numberOfChildren, 10) < 3) {
    unset(body, 'applicant.needsDomesticSupport﻿')
  }
  // 4.d. financiallyIndependant
  if (data.children.ages && data.children.ages.length && data.children.ages[data.children.ages.length - 1] < 16) {
    unset(body, 'children.financiallyIndependant﻿')
  }
  // 4.e requiresConstantCare
  if (data.child && !data.child.hasSeriousDisability) {
    unset(body, 'child.requiresConstantCare')
  }

  return body
}

export default transform
