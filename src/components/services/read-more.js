import React, { PropTypes, Component } from 'react'
import nl2br from 'react-nl2br'
import classNames from 'classnames'

import './read-more.scss'

const TRUNCATE_LENGTH = 150

class ReadMore extends Component {
  constructor (props) {
    super(props)

    this.state = {
      moreHidden: true
    }

    this.toggleMore = this.toggleMore.bind(this)
  }

  toggleMore () {
    this.setState({
      moreHidden: !this.state.moreHidden
    })
  }

  render () {
    const { text } = this.props
    const { moreHidden } = this.state

    let truncatedClasses = classNames(
      { 'hidden': !moreHidden }
    )

    let wholeClasses = classNames(
      { 'hidden': moreHidden }
    )

    let buttonClasses = classNames(
      'read-more',
      { 'hide': !moreHidden }
    )

    if (text.length < (TRUNCATE_LENGTH * 2)) {
      // DOUBLE what we truncate at so the read more doesn't hide a tiny amount of text
      return (
        <p>{nl2br(text)}</p>
      )
    } else {
      let remainder = text.substring(TRUNCATE_LENGTH, text.length)
      remainder = remainder.split(' ')[0]

      return (
        <div>
          <p className='visuallyhidden'>{nl2br(text)}</p>
          <p aria-hidden='true'>
            <span className={truncatedClasses}>
              {nl2br(text.substring(0, TRUNCATE_LENGTH) + remainder)}&hellip;
            </span>
            <span className={wholeClasses}>{nl2br(text)}</span>
            <button className={buttonClasses} onClick={this.toggleMore}>
              {moreHidden ? 'More information' : 'Hide information'}
            </button>
          </p>
        </div>
      )
    }
  }
}

ReadMore.propTypes = {
  text: PropTypes.string.isRequired
}

export default ReadMore
