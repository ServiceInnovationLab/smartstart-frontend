import React, { PropTypes, Component } from 'react'

class SubFieldReview extends Component {
  render() {
    const { label, value } = this.props;
    return <div className="review-subfield">
      <strong>{label}</strong>
      { value ?
        <span>{value}</span> :
        <em>Not applicable</em>
      }
    </div>
  }
}

SubFieldReview.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.node,
  section: PropTypes.string
}

export default SubFieldReview
