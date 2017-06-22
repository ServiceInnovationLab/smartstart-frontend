import React, { PropTypes, Component } from 'react'

class FieldReview extends Component {
  render() {
    const { label, name, value, section, onEdit } = this.props;
    return <div className="review-field">
      <div>
        <strong>{label}</strong>
        { value ?
          <span>{value}</span> :
          <em>Not applicable</em>
        }
      </div>
      <button type="button" onClick={() => onEdit(section, name)} className="field-edit-btn">Edit</button>
    </div>
  }
}

FieldReview.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.node,
  section: PropTypes.string,
  onEdit: PropTypes.func
}

export default FieldReview
