import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'

class Services extends Component {
  render () {
    return (
      <div>
        <h2>Services directory</h2>
      </div>
    )
  }
}

function mapStateToProps () {
  return {}
}

Services.propTypes = {
  dispatch: PropTypes.func
}

export default connect(mapStateToProps)(Services)
