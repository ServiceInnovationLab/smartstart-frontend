import { transform } from './transform'
import keys from 'lodash/keys'
import moment from 'moment'

describe('Form Data Transformation', () => {
  describe('child.birthOrderNumber & child.birthOrderTotal', () => {
    test('value is derived from child.multipleBirthOrder', () => {
      const transformedData = transform({
        child: {
          multipleBirthOrder: '1 of 2'
        }
      });

      expect(transformedData.child.birthOrderNumber).toEqual(1)
      expect(transformedData.child.birthOrderTotal).toEqual(2)
    })

    test('value is 0 when child.multipleBirthOrder is empty', () => {
      const transformedData = transform({
        child: {
          multipleBirthOrder: ''
        }
      });

      expect(transformedData.child.birthOrderNumber).toEqual(0)
      expect(transformedData.child.birthOrderTotal).toEqual(0)
    })

    test('should remove child.multipleBirthOrder property', () => {
      const transformedData = transform({
        child: {
          multipleBirthOrder: '1 of 2'
        }
      });

      expect(keys(transformedData.child).indexOf('multipleBirthOrder')).toEqual(-1)
    })
  })

  describe('formatting dates to yyyy-MM-dd', () => {
    test('format child.birthDate', () => {
      const transformedData = transform({
        child: {
          birthDate: moment('2017-06-23')
        }
      });

      expect(transformedData.child.birthDate).toEqual('2017-06-23')
    })

    test('format mother.dateOfBirth', () => {
      const transformedData = transform({
        mother: {
          dateOfBirth: moment('1989-06-23')
        }
      });

      expect(transformedData.mother.dateOfBirth).toEqual('1989-06-23')
    })

    test('format father.dateOfBirth', () => {
      const transformedData = transform({
        father: {
          dateOfBirth: moment('1989-06-23')
        }
      });

      expect(transformedData.father.dateOfBirth).toEqual('1989-06-23')
    })

    test('format siblings dateOfBirth', () => {
      const transformedData = transform({
        siblings: [
          { dateOfBirth: moment('2000-01-22') },
          { dateOfBirth: moment('2005-02-09') },
          { dateOfBirth: moment('2009-03-11') },
        ]
      });

      expect(transformedData.siblings[0].dateOfBirth).toEqual('2000-01-22')
      expect(transformedData.siblings[1].dateOfBirth).toEqual('2005-02-09')
      expect(transformedData.siblings[2].dateOfBirth).toEqual('2009-03-11')
    })

    test('format parentRelationshipDate', () => {
      const transformedData = transform({
        parentRelationshipDate: moment('2000-06-23')
      });

      expect(transformedData.parentRelationshipDate).toEqual('2000-06-23')
    })
  })

  describe('transform ethnicGroups', () => {
    test('transform child\'s ethnicGroups', () => {
      const transformedData = transform({
        child: {
          ethnicGroups: ['nzEuropean', 'maori', 'other'],
          ethnicityDescription: 'foo'
        }
      })

      expect(transformedData.child.ethnicGroups).toEqual({
        nzEuropean: true,
        maori: true,
        samoan: false,
        cookIslandMaori: false,
        tongan: false,
        niuean: false,
        chinese: false,
        indian: false,
        other: 'foo'
      })
    })

    test('transform mother\'s ethnicGroups', () => {
      const transformedData = transform({
        mother: {
          ethnicGroups: ['maori'],
          ethnicityDescription: ''
        }
      })

      expect(transformedData.mother.ethnicGroups).toEqual({
        nzEuropean: false,
        maori: true,
        samoan: false,
        cookIslandMaori: false,
        tongan: false,
        niuean: false,
        chinese: false,
        indian: false,
        other: ''
      })
    })

    test('transform father\'s ethnicGroups', () => {
      const transformedData = transform({
        father: {
          ethnicGroups: ['other'],
          ethnicityDescription: 'foobar'
        }
      })

      expect(transformedData.father.ethnicGroups).toEqual({
        nzEuropean: false,
        maori: false,
        samoan: false,
        cookIslandMaori: false,
        tongan: false,
        niuean: false,
        chinese: false,
        indian: false,
        other: 'foobar'
      })
    })

    test('remove helper properties: ethnicityDescription', () => {
      const transformedData = transform({
        child: {
          ethnicGroups: ['nzEuropean', 'maori', 'other'],
          ethnicityDescription: 'foo'
        },
        mother: {
          ethnicGroups: ['maori'],
          ethnicityDescription: ''
        },
        father: {
          ethnicGroups: ['other'],
          ethnicityDescription: 'foobar'
        }
      })
      expect(keys(transformedData.child).indexOf('ethnicityDescription')).toEqual(-1)
      expect(keys(transformedData.mother).indexOf('ethnicityDescription')).toEqual(-1)
      expect(keys(transformedData.father).indexOf('ethnicityDescription')).toEqual(-1)
    })
  })

  describe('transform yes/no to boolean', () => {
    test('child.stillBorn', () => {
      let transformedData = transform({
        child: { stillBorn: 'yes' }
      })
      expect(transformedData.child.stillBorn).toEqual(true)

      transformedData = transform({
        child: { stillBorn: 'no' }
      })
      expect(transformedData.child.stillBorn).toEqual(false)
    })
    test('child.oneOfMultiple', () => {
      let transformedData = transform({
        child: { oneOfMultiple: 'yes' }
      })
      expect(transformedData.child.oneOfMultiple).toEqual(true)

      transformedData = transform({
        child: { oneOfMultiple: 'no' }
      })
      expect(transformedData.child.oneOfMultiple).toEqual(false)
    })
    test('mother.isCitizen', () => {
      let transformedData = transform({
        mother: { isCitizen: 'yes' }
      })
      expect(transformedData.mother.isCitizen).toEqual(true)

      transformedData = transform({
        mother: { isCitizen: 'no' }
      })
      expect(transformedData.mother.isCitizen).toEqual(false)
    })
    test('father.isCitizen', () => {
      let transformedData = transform({
        father: { isCitizen: 'yes' }
      })
      expect(transformedData.father.isCitizen).toEqual(true)

      transformedData = transform({
        father: { isCitizen: 'no' }
      })
      expect(transformedData.father.isCitizen).toEqual(false)
    })
    test('fatherKnown', () => {
      let transformedData = transform({ fatherKnown: 'yes' })
      expect(transformedData.fatherKnown).toEqual(true)
      transformedData = transform({ fatherKnown: 'no' })
      expect(transformedData.fatherKnown).toEqual(false)
    })
    test('ird.applyForNumber', () => {
      let transformedData = transform({ ird: { applyForNumber: 'yes' } })
      expect(transformedData.ird.applyForNumber).toEqual(true)
      transformedData = transform({ ird: { applyForNumber: 'no' } })
      expect(transformedData.ird.applyForNumber).toEqual(false)
    })
    test('ird.numberByEmail', () => {
      let transformedData = transform({ ird: { numberByEmail: 'yes' } })
      expect(transformedData.ird.numberByEmail).toEqual(true)
      transformedData = transform({ ird: { numberByEmail: 'no' } })
      expect(transformedData.ird.numberByEmail).toEqual(false)
    })
    test('msd.notify', () => {
      let transformedData = transform({ msd: { notify: 'yes' } })
      expect(transformedData.msd.notify).toEqual(true)
      transformedData = transform({ msd: { notify: 'no' } })
      expect(transformedData.msd.notify).toEqual(false)
    })
    test('declarationMade', () => {
      let transformedData = transform({ declarationMade: 'yes' })
      expect(transformedData.declarationMade).toEqual(true)
      transformedData = transform({ declarationMade: 'no' })
      expect(transformedData.declarationMade).toEqual(false)
    })
    test('certificateOrder.courierDelivery', () => {
      let transformedData = transform({ certificateOrder: { courierDelivery: 'yes' } })
      expect(transformedData.certificateOrder.courierDelivery).toEqual(true)
      transformedData = transform({ certificateOrder: { courierDelivery: 'no' } })
      expect(transformedData.certificateOrder.courierDelivery).toEqual(false)
    })
  })


  describe('mother.nonCitizenshipSource', () => {
    test('when isPermanentResident = true', () => {
      let transformedData = transform({ mother: { isPermanentResident: true } })
      expect(transformedData.mother.nonCitizenshipSource).toEqual('permanentResident')
    })
    test('when isNZRealmResident = true', () => {
      let transformedData = transform({ mother: { isNZRealmResident: true } })
      expect(transformedData.mother.nonCitizenshipSource).toEqual('pacificIslandResident')
    })
    test('when isAuResidentOrCitizen = true', () => {
      let transformedData = transform({ mother: { isAuResidentOrCitizen: true } })
      expect(transformedData.mother.nonCitizenshipSource).toEqual('australian')
    })
    test('when isPermanentResident & isNZRealmResident & isAuResidentOrCitizen are both false', () => {
      let transformedData = transform({
        mother: {
          isPermanentResident: false,
          isNZRealmResident: false,
          isAuResidentOrCitizen: false
        }
      })
      expect(transformedData.mother.nonCitizenshipSource).toEqual('none')
    })
    test('remove helper properties: isPermanentResident/isNZRealmResident/isAuResidentOrCitizen', () => {
      let transformedData = transform({
        mother: {
          isPermanentResident: true,
          isNZRealmResident: false,
          isAuResidentOrCitizen: false
        }
      })
      expect(keys(transformedData.mother).indexOf('isPermanentResident')).toEqual(-1)
      expect(keys(transformedData.mother).indexOf('isNZRealmResident')).toEqual(-1)
      expect(keys(transformedData.mother).indexOf('isAuResidentOrCitizen')).toEqual(-1)
    })
  })

  describe('Father known/HART', () => {
    test('assistedHumanReproduction & man consented', () => {
      let transformedData = transform({
        assistedHumanReproduction: 'yes',
        assistedHumanReproductionManConsented: true,
        assistedHumanReproductionWomanConsented: false,
        assistedHumanReproductionSpermDonor: false
      })

      expect(transformedData.fatherKnown).toEqual(true)
      expect(transformedData.assistedReproductionFemaleParents).toEqual(false)
    })
    test('assistedHumanReproduction & woman consented', () => {
      let transformedData = transform({
        assistedHumanReproduction: 'yes',
        assistedHumanReproductionManConsented: false,
        assistedHumanReproductionWomanConsented: true,
        assistedHumanReproductionSpermDonor: false
      })
      expect(transformedData.fatherKnown).toEqual(true)
      expect(transformedData.assistedReproductionFemaleParents).toEqual(true)
    })
    test('assistedHumanReproduction & sperm donor', () => {
      let transformedData = transform({
        assistedHumanReproduction: 'yes',
        assistedHumanReproductionManConsented: false,
        assistedHumanReproductionWomanConsented: false,
        assistedHumanReproductionSpermDonor: true
      })
      expect(transformedData.fatherKnown).toEqual(false)
      expect(transformedData.assistedReproductionFemaleParents).toEqual(false)
    })
    test('should convert fatherKnown to boolean when assistedHumanReproduction = no', () => {
      let transformedData = transform({
        assistedHumanReproduction: 'no',
        assistedHumanReproductionManConsented: false,
        assistedHumanReproductionWomanConsented: false,
        assistedHumanReproductionSpermDonor: true,
        fatherKnown: 'yes'
      })
      expect(transformedData.fatherKnown).toEqual(true)
    })

    test('remove helper properties', () => {
      let transformedData = transform({
        assistedHumanReproduction: 'yes',
        assistedHumanReproductionManConsented: false,
        assistedHumanReproductionWomanConsented: false,
        assistedHumanReproductionSpermDonor: true
      })
      expect(keys(transformedData).indexOf('assistedHumanReproduction')).toEqual(-1)
      expect(keys(transformedData).indexOf('assistedHumanReproductionManConsented')).toEqual(-1)
      expect(keys(transformedData).indexOf('assistedHumanReproductionWomanConsented')).toEqual(-1)
      expect(keys(transformedData).indexOf('assistedHumanReproductionSpermDonor')).toEqual(-1)
    })
  })

  describe('Certificate order', () => {
    test('remove helper property: certificateOrder.deliveryAddressType', () => {
      let transformedData = transform({
        certificateOrder: {
          deliveryAddressType: 'mother'
        }
      })
      expect(keys(transformedData.certificateOrder).indexOf('deliveryAddressType')).toEqual(-1)
    })

    test('copy deliveryAddress.line2 to deliveryAddress.suburbTownPostCode', () => {
      let transformedData = transform({
        certificateOrder: {
          deliveryAddress: {
            line1: 'street address',
            suburb: 'suburb name',
            line2: 'town postalcode'
          }
        }
      })
      expect(transformedData.certificateOrder.deliveryAddress.suburbTownPostCode).toEqual('town postalcode')
    })
    test('copy deliveryAddress.suburb to deliveryAddress.line2', () => {
      let transformedData = transform({
        certificateOrder: {
          deliveryAddress: {
            line1: 'street address',
            suburb: 'suburb name',
            line2: 'town postalcode'
          }
        }
      })
      expect(transformedData.certificateOrder.deliveryAddress.line2).toEqual('suburb name')
    })
    test('should remove deliveryAddress.suburb property', () => {
      let transformedData = transform({
        certificateOrder: {
          deliveryAddress: {
            line1: 'street address',
            suburb: 'suburb name',
            line2: 'town postalcode'
          }
        }
      })
      expect(keys(transformedData.certificateOrder.deliveryAddress).indexOf('suburb')).toEqual(-1)
    })
  })

  describe('Remove uneccessary fields', () => {
    test('remove parentSameAddress', () => {
      let transformedData = transform({ parentSameAddress: 'yes' })
      expect(keys(transformedData).indexOf('parentSameAddress')).toEqual(-1)
    })
  })
})
