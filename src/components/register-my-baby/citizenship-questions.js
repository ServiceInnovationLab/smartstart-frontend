import React, { PropTypes, Component } from 'react'
import { Field } from 'redux-form'
import capitalize from 'lodash/capitalize'
import makeMandatoryLabel from './hoc/make-mandatory-label'
import { required } from './validate'
import Accordion from './accordion'
import renderField from './fields/render-field'
import renderWarning from './fields/render-warning'
import renderRadioGroup from './fields/render-radio-group'
import renderSelect from './fields/render-select'

import {
  yesNo as yesNoOptions,
  citizenshipSources as citizenshipSourceOptions
} from './options'

const prefix = (prefix, field) => prefix ? `${prefix}.${field}` : field

class CitizenshipQuestions extends Component {
  constructor(props) {
    super(props)
    this.onCitizenshipSourceChange = this.onCitizenshipSourceChange.bind(this)
    this.onIsCitizenChange = this.onIsCitizenChange.bind(this)
  }

  onCitizenshipSourceChange(source) {
    return (e, newVal) => {
      const { target, isPermanentResident, isNZRealmResident, isAuResidentOrCitizen } = this.props;
      if (source === 'isPermanentResident') {
        if (newVal === 'yes') {
          this.props.change(prefix(target, 'isNZRealmResident'), 'no')
          this.props.change(prefix(target, 'isAuResidentOrCitizen'), 'no')
        } else if (isNZRealmResident === 'no' && isAuResidentOrCitizen === 'no') {
          this.props.change(prefix(target, 'nonCitizenDocNumber'), '')
        }
      }
      if (source === 'isNZRealmResident') {
        if (newVal === 'yes') {
          this.props.change(prefix(target, 'isPermanentResident'), 'no')
          this.props.change(prefix(target, 'isAuResidentOrCitizen'), 'no')
        } else if (isPermanentResident === 'no' && isAuResidentOrCitizen === 'no') {
          this.props.change(prefix(target, 'nonCitizenDocNumber'), '')
        }
      }
      if (source === 'isAuResidentOrCitizen') {
        if (newVal === 'yes') {
          this.props.change(prefix(target, 'isPermanentResident'), 'no')
          this.props.change(prefix(target, 'isNZRealmResident'), 'no')
        } else if (isPermanentResident === 'no' && isNZRealmResident === 'no') {
          this.props.change(prefix(target, 'nonCitizenDocNumber'), '')
        }
      }
    }
  }

  onIsCitizenChange(e, newVal) {
    const { target } = this.props;

    if (newVal === 'yes') {
      this.props.change(prefix(target, 'isPermanentResident'), '')
      this.props.change(prefix(target, 'isNZRealmResident'), '')
      this.props.change(prefix(target, 'isAuResidentOrCitizen'), '')
      this.props.change(prefix(target, 'nonCitizenDocNumber'), '')
    } else {
      this.props.change(prefix(target, 'citizenshipSource'), '')
      this.props.change(prefix(target, 'citizenshipPassportNumber'), '')
    }
  }

  render() {
    const { target, isCitizen, isPermanentResident, isNZRealmResident, isAuResidentOrCitizen, citizenshipSource } = this.props

    return (
      <div className="component-grouping">
        <Field
          name={prefix(target, 'isCitizen')}
          component={renderRadioGroup}
          label={makeMandatoryLabel(`Is the ${target} a New Zealand citizen?`)}
          instructionText={`Please indicate the ${target}'s citizenship or immigration status.`}
          options={yesNoOptions}
          validate={[required]}
          onChange={this.onIsCitizenChange}
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
            label={makeMandatoryLabel(`Is the ${target} a New Zealand permanent resident?`)}
            options={yesNoOptions}
            validate={[required]}
            onChange={this.onCitizenshipSourceChange('isPermanentResident')}
          />
        }
        { isCitizen === 'no' &&
          <Field
            name={prefix(target, 'isNZRealmResident')}
            component={renderRadioGroup}
            label={makeMandatoryLabel(`Is the ${target} a resident of the Cook Islands, Niue or Tokelau?`)}
            options={yesNoOptions}
            validate={[required]}
            onChange={this.onCitizenshipSourceChange('isNZRealmResident')}
          />
        }
        { isCitizen === 'no' &&
          <Field
            name={prefix(target, 'isAuResidentOrCitizen')}
            component={renderRadioGroup}
            label={makeMandatoryLabel(`Is the ${target} an Australian citizen or permanent resident of Australia?`)}
            options={yesNoOptions}
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
            label={makeMandatoryLabel(`Enter the passport/travel document number the ${target} entered New Zealand on:`)}
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
            label={makeMandatoryLabel(`${capitalize(target)} is either`)}
            instructionText={`Please indicate how the ${target} is a New Zealand citizen`}
            options={citizenshipSourceOptions}
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
            label={makeMandatoryLabel(`Enter the ${target}'s New Zealand passport number`)}
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
