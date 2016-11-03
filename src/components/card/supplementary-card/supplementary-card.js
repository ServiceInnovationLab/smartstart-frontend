import './supplementary-card.scss'

import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { activateSupplementary, piwikTrackPost } from 'actions/actions'
import Card from 'components/card/card'
import classNames from 'classnames'

class SupplementaryCard extends Card {
  constructor (props) {
    super(props)

    this.state = {
      isExpanded: false,
      expandableVerb: 'expand'
    }
  }

  expandableToggle () {
    // if it's not yet the active card, but it has stale state
    if ((this.props.activeSupplementary !== (this.props.id)) && this.state.isExpanded) {
      // it's already got the right state, just need to do dispatch
    } else { // otherwise perform the normal toggle
      this.setState({
        isExpanded: !this.state.isExpanded,
        expandableVerb: this.state.expandableVerb !== 'expand' ? 'expand' : 'collapse'
      }, () => {
        if (this.state.isExpanded) {
          let piwikEvent = {
            'category': 'Supplementary Card',
            'action': 'Opened',
            'name': this.props.title
          }
          // track the event
          this.props.dispatch(piwikTrackPost('Supplementary', piwikEvent))
        }
      })
    }

    // dispatch that this card has been activated (doesn't matter if open or close)
    // so we can trigger closing all the other supplementary cards
    this.props.dispatch(activateSupplementary(this.props.id))
  }

  expandableKeyPress (event) {
    if (event.key === 'Enter') {
      this.expandableToggle()
    }
  }

  render () {
    let supplementaryCardClasses = classNames(
      'card',
      'expandable',
      { 'is-expanded': this.state.isExpanded && this.props.activeSupplementary === (this.props.id) }
    )
    let contentId = 'content-' + this.props.id

    return (
      <div className={supplementaryCardClasses} data-test='card' id={this.props.id}>
        <div className='expandable-title-wrapper'><h3
          data-test='cardTitle'
          className='expandable-title'
          aria-controls={contentId}
          aria-expanded={this.state.isExpanded}
          tabIndex='0'
          onClick={this.expandableToggle.bind(this)}
          onKeyPress={this.expandableKeyPress.bind(this)}
        >
          {this.props.title}
          <span className='visuallyhidden'> - {this.state.expandableVerb} this content</span>
        </h3></div>

        <div id={contentId} aria-hidden={!this.state.isExpanded} className='content'>
          {this.props.elements.map(element =>
            this.elementType(element)
          )}
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  const {
    supplementaryContentActions
  } = state
  const {
    activeSupplementary
  } = supplementaryContentActions || {
    activeSupplementary: null
  }

  return {
    activeSupplementary
  }
}

SupplementaryCard.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  elements: PropTypes.array.isRequired
}

export default connect(mapStateToProps)(SupplementaryCard)
