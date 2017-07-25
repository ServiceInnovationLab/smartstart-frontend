import moment from 'moment'
import get from 'lodash/get'
import set from 'lodash/set'
import has from 'lodash/has'
import keys from 'lodash/keys'
import unset from 'lodash/unset'
import cloneDeep from 'lodash/cloneDeep'
import lodashUpdate from 'lodash/update'
import invert from 'lodash/invert'
import forOwn from 'lodash/forOwn'

/**
 * STEP 1
 * [x] child.multipleBirthOrder --> birthOrderNumber / birthOrderTotal
 * [x] normalize birth date to correct format
 * [x] transform child.ethnicGroups, move child.ethnicityDescription to child.ethnicGroups.other
 *
 * STEP 2
 * [x] transform mother.ethnicGroups, move ethnicityDescription to ethnicGroups.other
 * [x] normalize birth date to correct format
 * [x] convert isPermanentResident/isNZRealmResident/isAuResidentOrCitizen to `nonCitizenSource`
 *
 *
 * STEP 3
 * [x] transform father.ethnicGroups, move ethnicityDescription to ethnicGroups.other
 * [x] normalize birth date to correct format
 * [x] convert isPermanentResident/isNZRealmResident/isAuResidentOrCitizen to `nonCitizenSource`
 * [x] depends on:
 *
 *      - assistedHumanReproduction
 *      - assistedHumanReproductionManConsented
 *      - assistedHumanReproductionWomanConsented
 *      - assistedHumanReproductionSpermDonor
 *
 *      we need to set correct value for `assistedReproductionFemaleParents` & `fatherKnown`
 *
 * STEP 4
 * [x] normalize siblings birthdate, parentRelationshipDate to correct format
 *
 * STEP 5
 *
 * STEP 6
 * [x] remove certificateOrder.deliveryAddressType
 * [x] convert certificateOrder.courierDelivery to boolean
 * [x] convert certificateOrder.deliveryAddress to match spec
 *
 * "deliveryAddress": {
 *   "line1": "string",                -> `streetAddress`
 *   "line2": "string",                -> `suburb`
 *   "suburbTownPostCode": "string",   -> `${town} ${postalCode}`
 *   "countryCode": "string"
 * }
 */

export const FRONTEND_FIELD_TO_SERVER_FIELD = {
  'birthPlace.home.suburb': 'birthPlace.home.line2',
  'birthPlace.home.line2': 'birthPlace.home.line3',
  'certificateOrder.deliveryAddress.line2': 'certificateOrder.deliveryAddress.suburbTownPostCode',
  'certificateOrder.deliveryAddress.suburb': 'certificateOrder.deliveryAddress.line2',
  'child.ethnicityDescription': 'child.ethnicGroups.other',
  'mother.ethnicityDescription': 'mother.ethnicGroups.other',
  'father.ethnicityDescription': 'father.ethnicGroups.other'
}

export const SERVER_FIELD_TO_FRONTEND_FIELD = invert(FRONTEND_FIELD_TO_SERVER_FIELD)

export const transform = data => {
  const transformedData = cloneDeep(data)

  const childMultipleBirthOrder = get(transformedData, 'child.multipleBirthOrder') || '0 of 0'
  const [birthOrderNumber, birthOrderTotal]  = childMultipleBirthOrder.split('of')
  set(transformedData, 'child.birthOrderNumber', parseInt(birthOrderNumber, 10))
  set(transformedData, 'child.birthOrderTotal', parseInt(birthOrderTotal, 10))
  unset(transformedData, 'child.multipleBirthOrder')

  update(transformedData, 'child.birthDate', formatDate)
  update(transformedData, 'mother.dateOfBirth', formatDate)
  update(transformedData, 'father.dateOfBirth', formatDate)
  update(transformedData, 'parentRelationshipDate', formatDate)
  const siblings = get(transformedData, 'siblings', [])
  siblings.forEach(sibling =>
    update(sibling, 'dateOfBirth', formatDate)
  )

  update(transformedData, 'child.stillBorn', yesNoToBoolean)
  update(transformedData, 'child.oneOfMultiple', yesNoToBoolean)
  update(transformedData, 'mother.isCitizen', yesNoToBoolean)
  update(transformedData, 'father.isCitizen', yesNoToBoolean)
  update(transformedData, 'fatherKnown', yesNoToBoolean)
  update(transformedData, 'ird.applyForNumber', yesNoToBoolean)
  update(transformedData, 'ird.numberByEmail', yesNoToBoolean)
  update(transformedData, 'msd.notify', yesNoToBoolean)
  update(transformedData, 'certificateOrder.courierDelivery', value => value === 'courier')

  transformEthnicGroups(transformedData.child)
  transformEthnicGroups(transformedData.mother)
  transformEthnicGroups(transformedData.father)

  transformCitizenshipSource(transformedData.mother)
  transformCitizenshipSource(transformedData.father)

  transformHart(transformedData)

  transformFrontendFieldToServerField(transformedData)

  cleanup(transformedData)

  return transformedData
}

export const transformFullSubmission = (data) => {
  const transformedData = transform(data)

  transformedData.otherInformation = [
    transformedData.child.nameExplaination || '',
    transformedData.otherInformation || ''
  ].join('\n')

  return transformedData
}

const update = (object, path, updater) => {
  if (has(object, path)) {
    lodashUpdate(object, path, updater)
  }
}

const formatDate = date =>
  date ? moment(date).format('YYYY-MM-DD') : ''

const yesNoToBoolean = value =>
  value === 'yes' ? true : false

const transformEthnicGroups = (target = {}) => {
  const ethnicGroupsObj = {
    nzEuropean: false,
    maori: false,
    samoan: false,
    cookIslandMaori: false,
    tongan: false,
    niuean: false,
    chinese: false,
    indian: false
  }

  keys(ethnicGroupsObj).forEach(key =>
    ethnicGroupsObj[key] = (target.ethnicGroups || []).indexOf(key) > -1
  )

  set(target, 'ethnicGroups', ethnicGroupsObj)

  // ethnicGroups.other will be transform in transformFrontendFieldToServerField

  return target
}

const transformCitizenshipSource = (target = {}) => {
  if (target.isPermanentResident) {
    set(target, 'nonCitizenSource', 'permanentResident')
  } else if (target.isNZRealmResident) {
    set(target, 'nonCitizenSource', 'pacificIslandResident')
  } else if (target.isAuResidentOrCitizen) {
    set(target, 'nonCitizenSource', 'australian')
  } else {
    set(target, 'nonCitizenSource', 'none')
  }

  unset(target, 'isPermanentResident')
  unset(target, 'isNZRealmResident')
  unset(target, 'isAuResidentOrCitizen')

  return target
}

const transformHart = data => {
  const assistedHumanReproduction = get(data, 'assistedHumanReproduction')
  const assistedHumanReproductionManConsented = get(data, 'assistedHumanReproductionManConsented')
  const assistedHumanReproductionWomanConsented = get(data, 'assistedHumanReproductionWomanConsented')
  const assistedHumanReproductionSpermDonor = get(data, 'assistedHumanReproductionSpermDonor')

  if (assistedHumanReproduction === 'yes') {
    if (assistedHumanReproductionManConsented || assistedHumanReproductionWomanConsented) {
      set(data, 'fatherKnown', true)
      if (assistedHumanReproductionManConsented) {
        set(data, 'assistedReproductionFemaleParents', false)
      }

      if (assistedHumanReproductionWomanConsented) {
        set(data, 'assistedReproductionFemaleParents', true)
      }
    } else if (assistedHumanReproductionSpermDonor) {
      set(data, 'fatherKnown', false)
      set(data, 'assistedReproductionFemaleParents', false)
    }
  }

  unset(data, 'assistedHumanReproduction')
  unset(data, 'assistedHumanReproductionManConsented')
  unset(data, 'assistedHumanReproductionWomanConsented')
  unset(data, 'assistedHumanReproductionSpermDonor')

  return data
}

const transformFrontendFieldToServerField = data => {
  const snapshot = cloneDeep(data)

  forOwn(FRONTEND_FIELD_TO_SERVER_FIELD, (serverField, frontendField) => {
    const value = get(snapshot, frontendField)
    set(data, serverField, value)
    unset(data, frontendField)
  })

  return data
}


const cleanup = data => {
  const birthPlaceCategory = get(data, 'birthPlace.category')
  const oneOfMultiple = get(data, 'child.oneOfMultiple')
  const fatherKnown = get(data, 'fatherKnown')
  const orderBirthCertificate = get(data, 'orderBirthCertificate')

  if (birthPlaceCategory === 'home') {
    unset(data, 'birthPlace.hospital')
    unset(data, 'birthPlace.other')
  } else if (birthPlaceCategory === 'hospital') {
    unset(data, 'birthPlace.home')
    unset(data, 'birthPlace.other')
  } else {
    unset(data, 'birthPlace.hospital')
    unset(data, 'birthPlace.home')
  }

  if (!oneOfMultiple) {
    unset(data, 'child.birthOrderNumber')
    unset(data, 'child.birthOrderTotal')
  }

  if (!fatherKnown) {
    unset(data, 'father')
    unset(data, 'parentRelationship')
    unset(data, 'parentRelationshipDate')
    unset(data, 'parentRelationshipPlace')
    unset(data, 'siblings')
  }

  if (orderBirthCertificate !== 'yes') {
    unset(data, 'certificateOrder')
  }

  unset(data, 'otherChildren')
  unset(data, 'certificateOrder.deliveryAddressType')
  unset(data, 'parentSameAddress')
  unset(data, 'orderBirthCertificate')
}
