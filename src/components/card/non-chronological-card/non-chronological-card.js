import 'components/richtext/expandable.scss' // depends on the normal expandable styles
import './non-chronological-card.scss'

import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import Card from 'components/card/card' // we subclass this component
import { piwikTrackPost } from 'actions/application'
import ScrollableAnchor from 'react-scrollable-anchor'

export class NonChronologicalCard extends Card {
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
    }, () => {
      if (this.state.isExpanded) {
        let piwikEvent = {
          'category': 'Non Chronological Card',
          'action': 'Opened',
          'name': this.props.title
        }
        // track the event
        this.props.dispatch(piwikTrackPost('Non Chronological Card', piwikEvent))
      }
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
      <ScrollableAnchor id={id.toString()} >
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
      </ScrollableAnchor>

    )
  }
}

function mapStateToProps () {
  return {}
}

NonChronologicalCard.propTypes = {
  title: PropTypes.string.isRequired,
  elements: PropTypes.array.isRequired,
  id: PropTypes.number.isRequired
}

export default connect(mapStateToProps)(NonChronologicalCard)
