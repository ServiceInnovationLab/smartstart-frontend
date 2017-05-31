import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import get from 'lodash/get'
import set from 'lodash/set'
import Accordion from './accordion'
import renderField from './render-field'
import renderSelect from './render-select'
import renderCheckbox from './render-checkbox'
import renderRadioGroup from './render-radio-group'
import {
  yesNo as yesNoOptions
} from './options'
import { required, requiredWithMessage, validIrd, validMsd } from './validate'
import { REQUIRE_IRD_ADDRESS, REQUIRE_AT_LEAST_ONE_MSD } from './validation-messages'

const validate = (values) => {
  const errors = {}
  const motherMsd = get(values, 'msd.mothersClientNumber')
  const fatherMsd = get(values, 'msd.fathersClientNumber')

  if (!motherMsd && !fatherMsd) {
    set(errors, 'msd.fathersClientNumber', REQUIRE_AT_LEAST_ONE_MSD)
  }

  return errors
}

class IrdMsdSharingForm extends Component {
  render() {
    const { applyForNumber, numberDeliveryAddress, msdNotify, handleSubmit, submitting } = this.props

    return (
      <div>
        <h2><span className="visuallyhidden">Step</span> <span className="step-number">5</span> Te Reo Title <br/> Other services</h2>
        <div className="informative-text">
          If you wish, you can use this form to share your child's birth with government agencies.
        </div>
        <form onSubmit={handleSubmit(this.props.onSubmit)}>
          <h4>Apply for an IRD number for your child</h4>
          <div className="informative-text">
            The easiest way to apply for an IRD number is using this birth registration form. It is free to apply for an IRD number and it saves you having to get another set of forms to apply for it later. If you apply for one now, you should receive it within 15 working days of submitting a correct and complete birth registration form. The IRD number will arrive separately to the birth certificate (if you're ordering one).
          </div>

          <div className="expandable-group secondary">
            <Accordion>
              <Accordion.Toggle>
                Who is eligible to apply for an IRD number for their child?
              </Accordion.Toggle>
              <Accordion.Content>
                <p>If one of the parents is a New Zealand or Australian citizen, or has New Zealand or Australian permanent residency, or is a resident of the Cook Islands, Tokelau, or Niue, then you can apply for an IRD number for the child from Inland Revenue.</p>
                <p>If none of the parents are New Zealand or Australian citizens, or have New Zealand or Australian permanent residency, or are a resident of the Cook Islands, Tokelau, or Niue, then you are not be able to apply for an IRD number using this birth registration form.</p>
              </Accordion.Content>
            </Accordion>

            <Accordion>
              <Accordion.Toggle>
                Why should I apply for an IRD number for my child?
              </Accordion.Toggle>
              <Accordion.Content>
                <p>You will need an IRD number for your child if you wish to open a bank account or Kiwisaver in their name, or if you are applying for Working for Families Tax Credits.</p>
                <p>If you have already applied for Working for Families tax credit for your child, make sure you include your IRD number below. Inland Revenue needs this to give you the payments. When your child is given an IRD number, Inland Revenue will add it to your Working for Families registration details for you.</p>
                <p>If you apply for your child's IRD number, Births, Deaths and Marriages will provide Birth Registration information to Inland Revenue so that it can create your child’s IRD number and help protect it from misuse.</p>
                <p>
                  For more information:
                  <br/>
                  on how this information is used and protected go to <a href="https://www.ird.govt.nz/privacy" target="_blank" rel="noreferrer noopener">www.ird.govt.nz/privacy</a>
                  <br/>
                  about applying for an IRD number go to: <a href="https://www.ird.govt.nz" target="_blank" rel="noreferrer noopener">www.ird.govt.nz</a> (search keyword "IRD number")
                  <br/>
                  phone Inland Revenue on 0800 775 247 - keyword "newborn IRD number"
                </p>
              </Accordion.Content>
            </Accordion>
          </div>

          <Field
            name="ird.applyForNumber"
            component={renderRadioGroup}
            label="Do you wish to apply for an IRD number for your child?"
            options={yesNoOptions}
            validate={[required]}
          />

          { applyForNumber &&
            <div className="conditional-field">
              <Field
                name="ird.numberDeliveryAddress"
                component={renderSelect}
                options={[
                  { value: 'motherAddress', display: 'Mother\'s' },
                  { value: 'fatherAddress', display: 'Father\'s' },
                  { value: 'birthCertificateAddress', display: 'Birth Certificate (if you order one)' },
                ]}
                label="Please choose an address Inland Revenue should post your child's IRD number to"
                validate={[requiredWithMessage(REQUIRE_IRD_ADDRESS)]}
              />
              {
                numberDeliveryAddress &&
                <Field
                  name="ird.numberByEmail"
                  component={renderRadioGroup}
                  label="Do you also wish to receive your child's IRD number by email?"
                  options={yesNoOptions}
                  validate={[required]}
                />
              }

              <Field
                name="ird.taxCreditIRDNumber"
                component={renderField}
                type="number"
                instructionText="This will allow Inland Revenue to add the child's IRD number to your Working for Families details"
                label="If you have applied for Working for Families Tax Credits for this child please provide your IRD number"
                validate={[validIrd]}
              />
            </div>
          }

          <h4>Notify the Ministry of Social Development (MSD) of the birth</h4>
          <div className="informative-text">
            If you're an existing MSD client, you should notify MSD to see how your new baby may affect your benefits and services.
          </div>

          <div className="expandable-group secondary">
            <Accordion>
              <Accordion.Toggle>
                Why should let I MSD know about the birth of my child?
              </Accordion.Toggle>
              <Accordion.Content>
                <p>If you're an existing Ministry of Social Development (MSD) client, you should notify MSD to see how your new baby may affect your benefits and services.</p>
                <p>Birth, Deaths and Marriages (BDM) can notify MSD for you when the birth is registered, if you want us to.</p>
                <p>If you do this, you don't need to provide a birth certificate to MSD, and may not need to visit an MSD office.</p>
                <p>For more information about the information you provide and your privacy see:</p>
                <ul>
                  <li><a href="https://smartstart.services.govt.nz/your-privacy" target="_blank" rel="noreferrer noopener">Birth Registration - Privacy</a></li>
                  <li><a href="https://www.workandincome.govt.nz/about-this-site/privacy-disclaimer-and-copyright-information.html" target="_blank" rel="noreferrer noopener">Work and Income- Privacy</a></li>
                </ul>
              </Accordion.Content>
            </Accordion>
            <Accordion>
              <Accordion.Toggle>
                How does MSD use the birth information about my child?
              </Accordion.Toggle>
              <Accordion.Content>
                <p>The Ministry of Social Development (MSD) will use the birth of child information that you agreed to provide to MSD to determine eligibility to payments and or services. MSD may need to contact you and / or ask for further verification to help them determine this. The Ministry of Social Development includes Work and Income, MSD Housing Assessment, Senior Services, StudyLink and other service lines. The legislation administered by the Ministry of Social Development allows MSD to check the information that you provide. This may happen when you apply for assistance and at any time after that.</p>
              </Accordion.Content>
            </Accordion>
          </div>

          <Field
            name="msd.notify"
            label="I give permission for Births, Deaths and Marriages to notify the Ministry of Social Development of the birth of my child."
            component={renderCheckbox}
          />

          { msdNotify &&
            <div className="conditional-field">
              <Field
                name="msd.mothersClientNumber"
                component={renderField}
                type="number"
                label="Mother's MSD client number"
                instructionText="Please provide the MSD client number for at least one parent"
                validate={[validMsd]}
              />
              <Field
                name="msd.fathersClientNumber"
                component={renderField}
                type="number"
                label="Father/Other parent's MSD client number"
                instructionText="Please provide the MSD client number for at least one parent"
                validate={[validMsd]}
              />
            </div>
          }

          <div className="form-actions">
            <button type="button" className="previous" onClick={this.props.onPrevious}>Back</button>
            <button type="submit" className="next" disabled={submitting}>Next</button>
          </div>
        </form>
      </div>
    )
  }
}

IrdMsdSharingForm.propTypes = {
  applyForNumber: PropTypes.string,
  numberDeliveryAddress: PropTypes.string,
  msdNotify: PropTypes.bool,
  onSubmit: PropTypes.func,
  onPrevious: PropTypes.func,
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  pristine: PropTypes.bool,
}

IrdMsdSharingForm = reduxForm({
  form: 'registration',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate
})(IrdMsdSharingForm)


const selector = formValueSelector('registration')

IrdMsdSharingForm = connect(
  state => ({
    applyForNumber: selector(state, 'ird.applyForNumber'),
    numberDeliveryAddress: selector(state, 'ird.numberDeliveryAddress'),
    msdNotify: selector(state, 'msd.notify')
  })
)(IrdMsdSharingForm)

export default IrdMsdSharingForm


