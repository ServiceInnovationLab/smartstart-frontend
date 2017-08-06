import get from 'lodash/get'
import cloneDeep from 'lodash/cloneDeep'

export const yesNo = [
  { value: 'yes', display: 'Yes'},
  { value: 'no', display: 'No'}
]

export const yesNoNotSure = [
  { value: 'yes', display: 'Yes'},
  { value: 'no', display: 'No'},
  { value: 'unknown', display: 'Not sure'}
]

export const sexes = [
  { value: 'male', display: 'Male'},
  { value: 'female', display: 'Female'}
]

export const birthPlaceCategories = [
  { value: 'hospital', display: 'Hospital'},
  { value: 'home', display: 'Home'},
  { value: 'other', display: 'Other'}
]

export const ethnicGroups = [
  { value: 'nzEuropean', display: 'NZ European'},
  { value: 'maori', display: 'Māori'},
  { value: 'samoan', display: 'Samoan'},
  { value: 'cookIslandMaori', display: 'Cook Island Māori'},
  { value: 'tongan', display: 'Tongan'},
  { value: 'niuean', display: 'Niuean'},
  { value: 'chinese', display: 'Chinese'},
  { value: 'indian', display: 'Indian'},
  { value: 'other', display: 'Other'}
]

export const citizenshipSources = [
  { value: 'bornInNZ', display: 'Born in New Zealand' },
  { value: 'bornInNiue', display: 'Born in Niue' },
  { value: 'bornInCookIslands', display: 'Born in the Cook Islands' },
  { value: 'bornInTokelau', display: 'Born in Tokelau' },
  { value: 'byDescent', display: 'New Zealand citizen by Descent' },
  { value: 'byGrant', display: 'New Zealand citizen by Grant' }
]

export const childStatuses = [
  { value: 'born-alive', display: 'Alive'},
  { value: 'has-died-since', display: 'Since died'},
  { value: 'stillborne', display: 'Stillborn'}
]

export const parentRelationships = [
  { value: 'marriage', display: 'Marriage' },
  { value: 'civilUnion', display: 'Civil Union' },
  { value: 'deFacto', display: 'De Facto Relationship' },
  { value: 'none', display: 'None of the above' }
]

export const irdDeliveryAddresses = [
  { value: 'mothersAddress', display: 'Mother\'s' },
  { value: 'fathersAddress', display: 'Father\'s' },
  { value: 'birthCertificateAddress', display: 'Birth Certificate (if you order one)' }
]

export const getIrdDeliveryAddresses = otherParent => {
  if (!otherParent) {
    return irdDeliveryAddresses
  }
  return cloneDeep(irdDeliveryAddresses).map(opt => {
    if (opt.value === 'fathersAddress') {
      opt.display = 'Other parent\'s'
    }
    return opt
  })
}

export const birthCertificateDeliveryAddresses = [
  { value: 'mother', display: 'Mother\'s' },
  { value: 'father', display: 'Father\'s' },
  { value: 'other', display: 'Other' }
]

export const getBirthCertificateDeliveryAddresses = otherParent => {
  if (!otherParent) {
    return birthCertificateDeliveryAddresses
  }
  return cloneDeep(birthCertificateDeliveryAddresses).map(opt => {
    if (opt.value === 'father') {
      opt.display = 'Other parent\'s'
    }
    return opt
  })
}

export const products = [
  { value: 'ZBPD', label: 'All Blacks NZ (limited time only)', price: 35, imageSrc: '/assets/img/certificates/birth-certificate-allblacks.png' },
  { value: 'ZBFD', label: 'Forest', price: 35, imageSrc: '/assets/img/certificates/birth-certificate-forest.png' },
  { value: 'ZBBD', label: 'Beach', price: 35, imageSrc: '/assets/img/certificates/birth-certificate-beach.png' },
  { value: 'ZBBC', label: 'Standard', price: 33, imageSrc: '/assets/img/certificates/birth-certificate-standard.png' },
  { value: 'ZBPP', label: 'Standard & All Blacks NZ', subLabel: 'Two certificate package', price: 55, imageSrc: '/assets/img/certificates/birth-certificate-standard-and-allblacks.png' },
  { value: 'ZBFP', label: 'Standard & Forest', subLabel: 'Two certificate package', price: 55, imageSrc: '/assets/img/certificates/birth-certificate-standard-and-forest.png' },
  { value: 'ZBBP', label: 'Standard & Beach', subLabel: 'Two certificate package', price: 55, imageSrc: '/assets/img/certificates/birth-certificate-standard-and-beach.png' }
]

export const deliveryMethods = [
  { value: 'standard', display: 'Standard (Free)'},
  { value: 'courier', display: 'Courier ($5)'}
]

export const getOptionDisplay = options => value => {
  const option = options.find(option => option.value === value)
  return get(option, 'display');
}
