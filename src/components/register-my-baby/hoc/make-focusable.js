import React, { Component, PropTypes } from 'react'
import { animateScroll } from 'react-scroll'
import { findClosestDomElement } from '../../../utils'

const focusToField = (fieldName) => {
  const node = document.querySelector(`[name="${fieldName}"], [name="${fieldName}[0]"], [name="${fieldName}-group"], [name="${fieldName}-day"]`)

  if (!node) {
    return
  }

  const inputGroup = findClosestDomElement(node, '.input-group, fieldset')

  const bodyRect = document.body.getBoundingClientRect()
  const elemRect = inputGroup.getBoundingClientRect()
  const offset = elemRect.top - bodyRect.top - 20

  animateScroll.scrollTo(offset, { smooth: true })

  node.focus()
}

const focusToFirstField = () => {
  const node = document.querySelector('form *[name]')

  if (!node) {
    return
  }

  node.focus();
}

/**
 * A Higher Order Component to add the scroll-and-focus behavior to an existing component.
 * It needs the `autoFocusField` props, and if specified, will scroll-and-focus to that field when mounted
 */
function makeFocusable(WrappedComponent) {
  class FocusableForm extends Component {
    componentDidMount() {
      const { autoFocusField } = this.props
      if (autoFocusField) {
        // we need to wait for all the elements are rendered & ready for calculating position
        window.setTimeout(() => {
          focusToField(autoFocusField)
        }, 300)
      } else {
        window.setTimeout(() => {
          focusToFirstField()
        }, 300)
      }
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }

  FocusableForm.propTypes = {
    autoFocusField: PropTypes.string
  }

  return FocusableForm
}

export default makeFocusable
