import './expandable.scss'

import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { piwikTrackPost } from 'actions/actions'

class Richtext extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isExpandable: false,
      isExpanded: false,
      showExpandableHeader: false,
      expandableVerb: 'expand'
    }

    this.checkIfExpandable = this.checkIfExpandable.bind(this)
    this.contentClick = this.contentClick.bind(this)
  }

  componentWillMount () {
    this.checkIfExpandable(this.props.tags, this.props.title)
  }

  componentWillReceiveProps (nextProps) {
    this.checkIfExpandable(nextProps.tags, nextProps.title)
  }

  checkIfExpandable (tags, title) {
    // check if it's expandable content
    for (var tag of tags) {
      if (tag === 'boac_presentation::auxiliary' && title) { // expandable content requires a title
        this.setState({
          showExpandableHeader: true,
          isExpandable: true
        })
        break
      }
    }
  }

  expandableToggle () {
    this.setState({
      isExpanded: !this.state.isExpanded,
      expandableVerb: this.state.expandableVerb !== 'expand' ? 'expand' : 'collapse'
    }, () => {
      if (this.state.isExpanded) {
        let piwikEvent = {
          'category': 'Accordion',
          'action': 'Opened',
          'name': this.props.title
        }
        // track the event
        this.props.dispatch(piwikTrackPost('Accordion', piwikEvent))
      }
    })
  }

  expandableKeyPress (event) {
    if (event.key === 'Enter') {
      this.expandableToggle()
    }
  }

  contentClick (event) {
    if (event.target && event.target.tagName === 'A') {
      event.preventDefault()

      let destination = event.target.getAttribute('href')

      // track the event
      this.props.dispatch(piwikTrackPost('Link', destination))

      // match standard piwik outlink delay
      window.setTimeout(() => {
        window.location = destination
      }, 200)
    }
  }

  render () {
    const markup = {
      __html: this.props.text
    }

    let richtextClasses = classNames(
      'richtext',
      { 'expandable': this.state.isExpandable },
      { 'is-expanded': this.state.isExpanded }
    )
    let expandableHeader = null
    let contentId = 'content-' + this.props.id
    let contentProperties = {
      id: contentId,
      dangerouslySetInnerHTML: markup
    }

    if (this.state.showExpandableHeader) {
      expandableHeader = <div className='expandable-title-wrapper'><h4
        className='expandable-title'
        aria-controls={contentId}
        aria-expanded={this.state.isExpanded}
        onClick={this.expandableToggle.bind(this)}
        tabIndex='0'
        onKeyPress={this.expandableKeyPress.bind(this)}
      >
        {this.props.title}
        <span className='visuallyhidden'> - {this.state.expandableVerb} this content</span>
      </h4></div>
    }

    if (this.state.isExpandable) {
      contentProperties['aria-hidden'] = !this.state.isExpanded
    }

    return (
      <div className={richtextClasses}>
        {expandableHeader}
        <div
          {...contentProperties}
          className='content'
          onClick={this.contentClick}
        />
      </div>
    )
  }
}

Richtext.propTypes = {
  title: PropTypes.string, // isRequired only for expandable
  text: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  tags: PropTypes.array
}

function mapStateToProps (state) {
  return {}
}

export default connect(mapStateToProps)(Richtext)
