import React, { PropTypes, Component } from 'react'
import { Field } from 'redux-form'
import Accordion from './accordion'
import getFieldProps from './steps/get-field-props'

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
    const { schema, target, isCitizen, isPermanentResident, isNZRealmResident, isAuResidentOrCitizen, citizenshipSource } = this.props

    return (
      <div className="component-grouping">
        <Field {...getFieldProps(schema, prefix(target, 'isCitizen'))} onChange={this.onIsCitizenChange} />

        <div className="expandable-group secondary">
          <Accordion>
            <Accordion.Toggle>
              Is your child entitled to be a New Zealand Citizen?
            </Accordion.Toggle>
            <Accordion.Content>
              <p>A child born in New Zealand is a New Zealand citizen at birth only if at least one parent is:</p>
              <ul>
                <li>A New Zealand citizen; or</li>
                <li>Entitled under the Immigration Act 2009 to be in NZ indefinitely (a permanent resident); or</li>
                <li>Entitled to reside indefinitely in the Cook Islands, Niue or Tokelau.</li>
              </ul>
              <p>
                If you are unsure about your citizenship status, try our citizenship tool
                <a href="https://www.govt.nz/browse/nz-passports-and-citizenship/getting-nz-citizenship/check-if-you-are-a-citizen/" target="_blank" rel="noreferrer noopener">https://www.govt.nz/browse/nz-passports-and-citizenship/getting-nz-citizenship/check-if-you-are-a-citizen/</a>
                or contact the Citizenship Office: Freephone <strong>0800 22 51 51</strong>.
              </p>
            </Accordion.Content>
          </Accordion>
        </div>

        { isCitizen === 'no' &&
          <Field {...getFieldProps(schema, prefix(target, 'isPermanentResident'))} onChange={this.onCitizenshipSourceChange('isPermanentResident')} />
        }
        { isCitizen === 'no' &&
          <Field {...getFieldProps(schema, prefix(target, 'isNZRealmResident'))} onChange={this.onCitizenshipSourceChange('isNZRealmResident')} />
        }
        { isCitizen === 'no' &&
          <Field {...getFieldProps(schema, prefix(target, 'isAuResidentOrCitizen'))} onChange={this.onCitizenshipSourceChange('isAuResidentOrCitizen')} />
        }

        { isCitizen === 'no' &&
          (
            isPermanentResident === 'yes' ||
            isNZRealmResident === 'yes' ||
            isAuResidentOrCitizen === 'yes'
          ) &&
          <Field {...getFieldProps(schema, prefix(target, 'nonCitizenDocNumber'))} />
        }

        <Field {...getFieldProps(schema, prefix(target, 'citizenshipWarning'))} />

        { isCitizen === 'yes' &&
          <Field {...getFieldProps(schema, prefix(target, 'citizenshipSource'))} />
        }

        { isCitizen === 'yes' &&
          (
            citizenshipSource === 'bornInNiue' ||
            citizenshipSource === 'bornInCookIslands' ||
            citizenshipSource === 'bornInTokelau'
          ) &&
          <Field {...getFieldProps(schema, prefix(target, 'citizenshipPassportNumber'))} />
        }
      </div>
    )
  }
}


CitizenshipQuestions.propTypes = {
  schema: PropTypes.object,
  target: PropTypes.string, // the target field that the citizenship form bind to (eg. mother or father)
  isCitizen: PropTypes.string,
  isPermanentResident: PropTypes.string,
  isNZRealmResident: PropTypes.string,
  isAuResidentOrCitizen: PropTypes.string,
  citizenshipSource: PropTypes.string,
  change: PropTypes.func
}

export default CitizenshipQuestions;
