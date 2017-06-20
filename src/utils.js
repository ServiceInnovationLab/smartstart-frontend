/*
 * Common small utility functions. Has no default export, include only
 * the util(s) you need.
 */

// checkStatus
//
// Used as a step in a fetch promise chain, to check response codes.
//
// Arguments:
// 'response' (required) - the fetch HTTP response
export function checkStatus (response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

// isValidDate
//
// Check is a date string converts successfully to a date object,
// returns true or false.
//
// Arguments:
// 'dateString' (required) - the string to be converted
export function isValidDate (dateString) {
  let dateObject = new Date(dateString)
  return !isNaN(dateObject.getTime())
}

export function isValidEmail (email) {
  // simple email validation
  const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/

  if (typeof emailRegex.test === 'function') {
    return emailRegex.test(email)
  } else {
    // browser doesn't support regex, skip validation
    return true
  }
}

// routerScrollHandler
//
// Makes sure we scroll up to the the top of the page when changing route
// (but not for anchor links).
//
export function routerScrollHandler () {
  let {
    action
  } = this.state.location

  if (action === 'PUSH') {
    window.scrollTo(0, 0)
  }
}


// Get textContent out of a React's component
export function getTextContent(rootChild) {
  let res = ''

  const rr = (child) => {
    if (typeof child === 'string' || typeof child === 'number') {
      res += child
    } else if (Array.isArray(child)) {
      child.forEach(c => rr(c))
    } else if (child && child.props) {
      const { children } = child.props
      if (Array.isArray(children)) {
        children.forEach(c => rr(c) )
      } else {
        rr(children)
      }
    }
  }

  rr(rootChild)

  return res
}
