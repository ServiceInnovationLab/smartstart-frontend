import React, { Component, PropTypes } from 'react'
import uuid from 'uuid'

class Accordion extends Component {
  constructor(props) {
    super(props)
    this.toggle = this.toggle.bind(this)
    this.state = {
      isExpanded: false,
      expandableVerb: 'expand',
      contentId: uuid.v4() // we need to give each accordian a unique id for aria-controls accessibility feature
    }
  }

  toggle(e) {
    if (e) {
      e.preventDefault()
    }
    this.setState({ isExpanded: !this.state.isExpanded })
  }

  renderChildren() {
    return React.Children.map(this.props.children, child =>
      React.cloneElement(child, {
        toggle: this.toggle,
        isExpanded: this.state.isExpanded,
        contentId: this.state.contentId
      })
    )
  }

  render() {
    return <div className={`expandable ${this.state.isExpanded ? 'is-expanded' : ''}`}>
      {this.renderChildren()}
    </div>
  }
}

Accordion.propTypes = {
  children: PropTypes.any
}

Accordion.Toggle = ({ contentId, children, toggle, isExpanded }) =>
  <a href="#" className="expandable-title-wrapper" aria-controls={contentId} aria-expanded={isExpanded} onClick={toggle}>
    <span className="expandable-title">
      {children}
      <span className='visuallyhidden'> - {isExpanded ? 'collapse' : 'expand'} this content</span>
    </span>
  </a>

Accordion.Toggle.propTypes = {
  children: PropTypes.any,
  contentId: PropTypes.string,
  toggle: PropTypes.func,
  isExpanded: PropTypes.bool
}

Accordion.Toggle.displayName = 'Accordion.Toggle'

Accordion.Content = ({ contentId, isExpanded, children }) =>
  <div id={contentId} className="content" aria-hidden={!isExpanded}>
    {children}
  </div>

Accordion.Content.propTypes = {
  children: PropTypes.any,
  contentId: PropTypes.string,
  isExpanded: PropTypes.bool
}

Accordion.Content.displayName = 'Accordion.Content'

export default Accordion

