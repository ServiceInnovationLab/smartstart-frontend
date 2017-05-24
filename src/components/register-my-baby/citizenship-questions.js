import React, { PropTypes, Component } from 'react'
import { Field } from 'redux-form'
import capitalize from 'lodash/capitalize'
import { required } from './validate'
import Accordion from './accordion'
import renderField from './render-field'
import renderWarning from './render-warning'
import renderRadioGroup from './render-radio-group'
import renderSelect from './render-select'

const prefix = (prefix, field) => prefix ? `${prefix}.${field}` : field

class CitizenshipQuestions extends Component {
  constructor(props) {
    super(props)
    this.onCitizenshipSourceChange = this.onCitizenshipSourceChange.bind(this)
  }

  onCitizenshipSourceChange(source) {
    return (e, newVal) => {
      const { target } = this.props;
      if (source === 'isPermanentResident' && newVal === 'yes') {
        this.props.change(prefix(target, 'isNZRealmResident'), 'no')
        this.props.change(prefix(target, 'isAuResidentOrCitizen'), 'no')
      }
      if (source === 'isNZRealmResident' && newVal === 'yes') {
        this.props.change(prefix(target, 'isPermanentResident'), 'no')
        this.props.change(prefix(target, 'isAuResidentOrCitizen'), 'no')
      }
      if (source === 'isAuResidentOrCitizen' && newVal === 'yes') {
        this.props.change(prefix(target, 'isPermanentResident'), 'no')
        this.props.change(prefix(target, 'isNZRealmResident'), 'no')
      }
    }
  }

  render() {
    const { target, isCitizen, isPermanentResident, isNZRealmResident, isAuResidentOrCitizen, citizenshipSource } = this.props

    return (
      <div className="component-grouping">
        <Field
          name={prefix(target, 'isCitizen')}
          component={renderRadioGroup}
          label={`Is the ${target} a New Zealand citizen?`}
          instructionText={`Please indicate the ${target}'s citizenship or immigration status.`}
          options={[
            { value: 'yes', display: 'Yes'},
            { value: 'no', display: 'No'}
          ]}
          validate={[required]}
        />

        <div className="expandable-group secondary">
          <Accordion>
            <Accordion.Toggle>
              What makes a child born a New Zealand citizen?
            </Accordion.Toggle>
            <Accordion.Content>
              <p>A child born in New Zealand is a New Zealand citizen at birth only if:</p>
              <ul>
                <li>at least one parent is a New Zealand citizen, or</li>
                <li>is entitled under the Immigration Act 2009 to be in New Zealand indefinitely (a permanent resident), or</li>
                <li>is entitled to reside indefinitely in the Cook Islands, Niue or Tokelau.</li>
              </ul>
              <p>If you are unsure about your citizenship status, contact the Citizenship Office: Freephone <strong>0800 22 51 51</strong>.</p>
            </Accordion.Content>
          </Accordion>
        </div>

        { isCitizen === 'no' &&
          <Field
            name={prefix(target, 'isPermanentResident')}
            component={renderRadioGroup}
            label={`Is the ${target} a New Zealand permanent resident?`}
            options={[
              { value: 'yes', display: 'Yes'},
              { value: 'no', display: 'No'}
            ]}
            validate={[required]}
            onChange={this.onCitizenshipSourceChange('isPermanentResident')}
          />
        }
        { isCitizen === 'no' &&
          <Field
            name={prefix(target, 'isNZRealmResident')}
            component={renderRadioGroup}
            label={`Is the ${target} a resident of the Cook Islands, Niue or Tokelau?`}
            options={[
              { value: 'yes', display: 'Yes'},
              { value: 'no', display: 'No'}
            ]}
            validate={[required]}
            onChange={this.onCitizenshipSourceChange('isNZRealmResident')}
          />
        }
        { isCitizen === 'no' &&
          <Field
            name={prefix(target, 'isAuResidentOrCitizen')}
            component={renderRadioGroup}
            label={`Is the ${target} an Australian citizen or permanent resident of Australia?`}
            options={[
              { value: 'yes', display: 'Yes'},
              { value: 'no', display: 'No'}
            ]}
            validate={[required]}
            onChange={this.onCitizenshipSourceChange('isAuResidentOrCitizen')}
          />
        }

        { isCitizen === 'no' &&
          (
            isPermanentResident === 'yes' ||
            isNZRealmResident === 'yes' ||
            isAuResidentOrCitizen === 'yes'
          ) &&
          <Field
            name={prefix(target, 'nonCitizenDocNumber')}
            component={renderField}
            label={`Enter the passport/travel document number the ${target} entered New Zealand on:`}
            type="text"
            validate={[required]}
          />
        }

        <Field
          name={prefix(target, 'citizenshipWarning')}
          component={renderWarning}
        />

        { isCitizen === 'yes' &&
          <Field
            name={prefix(target, 'citizenshipSource')}
            component={renderSelect}
            label={`${capitalize(target)} is either`}
            instructionText={`Please indicate how the ${target} is a New Zealand citizen`}
            options={[
              { value: 'bornInNZ', display: 'Born in New Zealand' },
              { value: 'bornInNiue', display: 'Born in Niue' },
              { value: 'bornInCookIslands', display: 'Born in the Cook Islands' },
              { value: 'bornInTokelau', display: 'Born in Tokelau' },
              { value: 'citizenByDescent', display: 'New Zealand citizen by Descent' },
              { value: 'citizenByGrant', display: 'New Zealand citizen by Grant' }
            ]}
            validate={[required]}
          />
        }

        { isCitizen === 'yes' &&
          (
            citizenshipSource === 'bornInNiue' ||
            citizenshipSource === 'bornInCookIslands' ||
            citizenshipSource === 'bornInTokelau'
          ) &&
          <Field
            name={prefix(target, 'citizenshipPassportNumber')}
            component={renderField}
            label={`Enter the ${target}'s New Zealand passport number`}
            type="text"
            validate={[required]}
          />
        }
      </div>
    )
  }
}


CitizenshipQuestions.propTypes = {
  target: PropTypes.string, // the target field that the citizenship form bind to (eg. mother or father)
  isCitizen: PropTypes.string,
  isPermanentResident: PropTypes.string,
  isNZRealmResident: PropTypes.string,
  isAuResidentOrCitizen: PropTypes.string,
  citizenshipSource: PropTypes.string,
  change: PropTypes.func
}

export default CitizenshipQuestions;
