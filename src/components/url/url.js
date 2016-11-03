import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { piwikTrackPost } from 'actions/actions'

class Url extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isButton: false
    }

    this.checkIfButton = this.checkIfButton.bind(this)
    this.linkClick = this.linkClick.bind(this)
  }

  componentWillMount () {
    this.checkIfButton(this.props.tags)
  }

  componentWillReceiveProps (nextProps) {
    this.checkIfButton(nextProps.tags)
  }

  checkIfButton (tags) {
    // check if it's presented as a button
    if (tags.indexOf('boac_presentation::link-button') >= 0) {
      this.setState({isButton: true})
    }
  }

  linkClick (event) {
    event.preventDefault()
    const destination = this.link.getAttribute('href')

    // track the event
    this.props.dispatch(piwikTrackPost('Link', destination))

    // match standard piwik outlink delay
    window.setTimeout(() => {
      window.location = destination
    }, 200)
  }

  render () {
    // if there is no linkLabel use the regular label instead
    let linkText = this.props.linkLabel ? this.props.linkLabel : this.props.label
    let urlClasses = classNames(
      'url',
      { 'button': this.state.isButton }
    )

    return (
      <p>
        <a
          className={urlClasses}
          href={this.props.url}
          onClick={this.linkClick}
          ref={(ref) => { this.link = ref }}
        >
          {linkText}
        </a>
      </p>
    )
  }
}

Url.propTypes = {
  label: PropTypes.string, // needs EITHER label or linkLabel
  linkLabel: PropTypes.string,
  url: PropTypes.string.isRequired,
  tags: PropTypes.array
}

function mapStateToProps (state) {
  return {}
}

export default connect(mapStateToProps)(Url)
