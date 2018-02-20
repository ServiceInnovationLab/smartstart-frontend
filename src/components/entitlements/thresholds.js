// A collection of functions that take a combined annual income
// plus any other modifiers and return a boolean to indicate
// if the applicant is under a given threshold (true) or over
// it (false).

export function ChildCareSubsidy (income, numberOfChildren) {
  let weeklyIncome = income / 52

  if (!numberOfChildren) return false

  switch (numberOfChildren) {
    case 1:
      if (weeklyIncome < 1400) return true
      break
    case 2:
      if (weeklyIncome < 1600) return true
      break
    default: // 3+
      if (weeklyIncome < 1800) return true
  }
  return false
}

export function isCommunityServicesCard (income) {
  // this one is a simplification of a very complex table
  return income < 68682
}

export function JobSeekerSupport (income) {
  return (income / 52) < 570
}

export function SoleParentSupport (income) {
  return (income / 52) < 628
}

export function AccommodationSupplement (income) {
  // married, civil union or de facto couple, 1+ children in Area 1 (AKL)
  return income < 79144
}

export function workingForFamiliesMinTaxCredit
 (income) {
  return income < 23816
}

export function WorkingForFamiliesInWorkTaxCredit (income, numberOfChildren) {
  if (!numberOfChildren) return false

  switch (numberOfChildren) {
    case 1:
      if (income < 74537) return true
      break
    case 2:
      if (income < 89430) return true
      break
    case 3:
      if (income < 104323) return true
      break
    case 4:
      if (income < 122683) return true
      break
    case 5:
      if (income < 141043) return true
      break
    default: // 6+
      if (income < 159403) return true
  }
  return false
}

export function WorkingForFamiliesFamilyTaxCredit (income,  numberOfChildren) {
  if (!numberOfChildren) return false

  switch (numberOfChildren) {
    case 1:
      if (income < 57781) return true
      break
    case 2:
      if (income < 72674) return true
      break
    case 3:
      if (income < 87568) return true
      break
    case 4:
      if (income < 102461) return true
      break
    case 5:
      if (income < 117354) return true
      break
    default: // 6+
      if (income < 132248) return true
  }
  return false
}

export function workingForFamiliesParentalTaxCredit (income,  numberOfChildren) {
  if (!numberOfChildren) return false

  switch (numberOfChildren) {
    case 1:
      if (income < 84314) return true
      break
    case 2:
      if (income < 99208) return true
      break
    case 3:
      if (income < 114101) return true
      break
    case 4:
      if (income < 132461) return true
      break
    case 5:
      if (income < 150821) return true
      break
    default: // 6+
      if (income < 169181) return true
  }
  return false
}

export function SupportedLivingPayment (income, hasPartner) {
  if (hasPartner) {
    return (income / 52) < 826
  }
  return (income / 52) < 692
}

export function YoungParentPayment (income) {
  return (income / 52) < 214.30
}
