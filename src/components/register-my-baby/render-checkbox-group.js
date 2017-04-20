import React, { PropTypes } from 'react'

const renderCheckboxGroup = ({ input, name, label, instructionText, options, meta: { touched, error } }) => (
  <fieldset>
    { label && <legend>{label}</legend> }
    { instructionText && <div className="instruction-text">{instructionText}</div> }
    <div className={`checkbox-group ${(touched && error) ? 'has-error' : ''}`}>
      <div>
        <div>
          { options.map((option, index) => (
              <label key={index}>
                <input type="checkbox"
                       name={`${name}[${index}]`}
                       value={option.value}
                       checked={input.value.indexOf(option.value) !== -1}
                       onChange={event => {
                         const newValue = [...input.value]
                         if(event.target.checked) {
                           newValue.push(option.value)
                         } else {
                           newValue.splice(newValue.indexOf(option.value), 1)
                         }

                         return input.onChange(newValue)
                       }}/>
                <span>{option.display}</span>
              </label>
            ))
          }
        </div>
        {touched && error && <span>{error}</span>}
      </div>
    </div>
  </fieldset>
)

renderCheckboxGroup.propTypes = {
  input: PropTypes.object,
  name: PropTypes.string,
  label: PropTypes.string,
  instructionText: PropTypes.string,
  options: PropTypes.object,
  type: PropTypes.string,
  meta: PropTypes.object
}

export default renderCheckboxGroup
