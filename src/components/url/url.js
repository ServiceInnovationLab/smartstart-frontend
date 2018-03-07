import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { piwikOutlinkTrack } from 'actions/piwik'

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
    piwikOutlinkTrack(event, this.props.dispatch)
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

function mapStateToProps () {
  return {}
}

Url.propTypes = {
  label: PropTypes.string, // needs EITHER label or linkLabel
  linkLabel: PropTypes.string,
  url: PropTypes.string.isRequired,
  tags: PropTypes.array,
  dispatch: PropTypes.func
}

export default connect(mapStateToProps)(Url)
