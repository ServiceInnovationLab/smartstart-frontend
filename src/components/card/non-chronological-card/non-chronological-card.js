import 'components/richtext/expandable.scss' // depends on the normal expandable styles
import './non-chronological-card.scss'

import React, { PropTypes } from 'react'
import Card from 'components/card/card' // we subclass this component
import classNames from 'classnames'

class NonChronologicalCard extends Card {
  constructor (props) {
    super(props)

    this.state = {
      isExpandable: false,
      isExpanded: false,
      expandableVerb: 'expand'
    }
  }

  expandableToggle () {
    this.setState({
      isExpanded: !this.state.isExpanded,
      expandableVerb: this.state.expandableVerb !== 'expand' ? 'expand' : 'collapse'
    })
  }

  expandableKeyPress (event) {
    if (event.key === 'Enter') {
      this.expandableToggle()
    }
  }

  render () {
    const { id, title, elements } = this.props
    let contentId = 'content-' + id
    let nonchronologicalClasses = classNames(
      'card',
      'non-chronological',
      'expandable',
      { 'is-expanded': this.state.isExpanded }
    )

    return (
      <div className={nonchronologicalClasses} data-test='non-chronological-card'>
        <div className='expandable-title-wrapper'><h3
          data-test='cardTitle'
          className='expandable-title'
          aria-controls={contentId}
          aria-expanded={this.state.isExpanded}
          tabIndex='0'
          onClick={this.expandableToggle.bind(this)}
          onKeyPress={this.expandableKeyPress.bind(this)}
        >
          {title}
          <span className='visuallyhidden'> - {this.state.expandableVerb} this content</span>
        </h3></div>

        <div id={contentId} aria-hidden={!this.state.isExpanded} className='content'>
          {elements.map(element =>
            this.elementType(element)
          )}
        </div>
      </div>
    )
  }
}

NonChronologicalCard.propTypes = {
  title: PropTypes.string.isRequired,
  elements: PropTypes.array.isRequired
}

export default NonChronologicalCard
