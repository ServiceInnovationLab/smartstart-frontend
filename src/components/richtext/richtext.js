import './richtext.scss'

import React from 'react'
import classNames from 'classnames'

class Richtext extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      isExpandable: false,
      isExpanded: false,
      showExpandableHeader: false,
      expandableVerb: 'expand'
    }
  }

  componentWillMount () {
    // check if it's expandable content
    for (var tag of this.props.tags) {
      if (tag === 'boac_presentation::auxiliary' && this.props.title) { // expandable content requires a title
        this.setState({showExpandableHeader: true})
        this.setState({isExpandable: true})
        break
      }
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

    if (this.state.showExpandableHeader) {
      expandableHeader = <h4
        className='expandable-title'
        aria-controls={contentId}
        onClick={this.expandableToggle.bind(this)}
        tabIndex='0'
        onKeyPress={this.expandableKeyPress.bind(this)}
      >
        {this.props.title}
        <span className='visuallyhidden'> - {this.state.expandableVerb} this content</span>
      </h4>
    }

    return (
      <div className={richtextClasses}>
        {expandableHeader}
        <div id={contentId} className='content' dangerouslySetInnerHTML={markup} />
      </div>
    )
  }
}

export default Richtext
