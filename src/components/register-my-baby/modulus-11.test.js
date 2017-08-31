import { validateIrdNumber, validateMsdNumber } from './modulus-11'

describe('IRD modulus-11 digit check', () => {
  test('valid 49091850: remainder = 0', () => {
    expect(validateIrdNumber(49091850)).toBeTruthy()
  })

  test('valid 35901981', () => {
    expect(validateIrdNumber(35901981)).toBeTruthy()
  })

  test('valid 49098576', () => {
    expect(validateIrdNumber(49098576)).toBeTruthy()
  })

  test('valid 136410132: 9 digits, first calculated check digit is 10, need secondary check', () => {
    expect(validateIrdNumber(136410132)).toBeTruthy()
  })

  test('invalid 136410133: 9 digits, need secondary check', () => {
    expect(validateIrdNumber(136410133)).toBeFalsy()
  })

  test('invalid 9125568: out of range', () => {
    expect(validateIrdNumber(9125568)).toBeFalsy()
  })

  test('invalid 999999999: valid number according to specs, but out of range', () => {
    expect(validateIrdNumber(999999999)).toBeFalsy()
  })
})

describe('MSD modulus-11 digit check', () => {
  test('valid 555012342: 9 digits, only first check', () => {
    expect(validateMsdNumber(555012342)).toBeTruthy()
  })
  test('invalid 555012343: 9 digits, only first check', () => {
    expect(validateMsdNumber(555012343)).toBeFalsy()
  })

  test('valid 555017121: 9 digits, need second check', () => {
    expect(validateMsdNumber(555017121)).toBeTruthy()
  })
  test('invalid 555017122: 9 digits, need second check', () => {
    expect(validateMsdNumber(555017122)).toBeFalsy()
  })

  test('valid 55501712: 8 digits, only first check', () => {
    expect(validateMsdNumber(55501712)).toBeTruthy()
  })
  test('invalid 55501711: 8 digits, only first check', () => {
    expect(validateMsdNumber(55501711)).toBeFalsy()
  })

  test('valid 55501780: 8 digits, need second check', () => {
    expect(validateMsdNumber(55501780)).toBeTruthy()
  })
  test('invalid 55501781: 8 digits, need second check', () => {
    expect(validateMsdNumber(55501781)).toBeFalsy()
  })
})
