import get from 'lodash/get'

export const yesNo = [
  { value: 'yes', display: 'Yes'},
  { value: 'no', display: 'No'}
]

export const yesNoNotSure = [
  { value: 'yes', display: 'Yes'},
  { value: 'no', display: 'No'},
  { value: 'notsure', display: 'Not sure'}
]

export const sexs = [
  { value: 'male', display: 'Male'},
  { value: 'female', display: 'Female'}
]

export const ethnicGroups = [
  { value: 'NZ European', display: 'NZ European'},
  { value: 'Māori', display: 'Māori'},
  { value: 'Samoan', display: 'Samoan'},
  { value: 'Cook Island Māori', display: 'Cook Island Māori'},
  { value: 'Tongan', display: 'Tongan'},
  { value: 'Niuean', display: 'Niuean'},
  { value: 'Chinese', display: 'Chinese'},
  { value: 'Indian', display: 'Indian'},
  { value: 'Other', display: 'Other'}
]

export const citizenshipSources = [
  { value: 'bornInNZ', display: 'Born in New Zealand' },
  { value: 'bornInNiue', display: 'Born in Niue' },
  { value: 'bornInCookIslands', display: 'Born in the Cook Islands' },
  { value: 'bornInTokelau', display: 'Born in Tokelau' },
  { value: 'citizenByDescent', display: 'New Zealand citizen by Descent' },
  { value: 'citizenByGrant', display: 'New Zealand citizen by Grant' }
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
  { value: 'none', display: 'Not married/in a Civil Union/De Facto Relationship' }
]

export const irdDeliveryAddresses = [
  { value: 'motherAddress', display: 'Mother\'s' },
  { value: 'fatherAddress', display: 'Father\'s' },
  { value: 'birthCertificateAddress', display: 'Birth Certificate (if you order one)' }
]

export const birthCertificateDeliveryAddresses = [
  { value: 'mother', display: 'Mother\'s' },
  { value: 'father', display: 'Father\'s' },
  { value: 'other', display: 'Other' }
]

export const products = [
  { value: 'BC05', label: 'All Blacks NZ (limited time only)', price: 35, imageSrc: '/assets/img/certificates/birth-certificate-allblacks.png' },
  { value: 'ZBFD', label: 'Forest', price: 35, imageSrc: '/assets/img/certificates/birth-certificate-forest.png' },
  { value: 'ZBBD', label: 'Beach', price: 35, imageSrc: '/assets/img/certificates/birth-certificate-beach.png' },
  { value: 'ZBBC', label: 'Standard', price: 33, imageSrc: '/assets/img/certificates/birth-certificate-standard.png' },
  { value: 'BC06', label: 'Standard & All Blacks NZ', subLabel: 'Two certificate package', price: 55, imageSrc: '/assets/img/certificates/birth-certificate-standard-and-allblacks.png' },
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
