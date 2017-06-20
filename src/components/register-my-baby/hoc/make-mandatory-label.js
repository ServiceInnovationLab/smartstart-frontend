import React from 'react'

/**
 * Suffix any arbitrary string with a .visuallyhidden "required" text
 */
const makeMandatoryLabel = (label) => {
  return <span>
    <span>{label}</span>
    <span className="visuallyhidden">(required)</span>
  </span>
}

export default makeMandatoryLabel

