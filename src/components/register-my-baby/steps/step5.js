import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import makeFocusable from '../hoc/make-focusable'
import Accordion from '../accordion'
import {
  irdDeliveryAddresses
} from '../options'
import validate from './validation'
import schema from './schemas/step5'
import getFieldProps from './get-field-props'


class IrdMsdSharingForm extends Component {
  render() {
    const {
      applyForNumber, deliveryAddress, numberByEmail, msdNotify, fatherKnown,
      assistedHumanReproduction, assistedHumanReproductionSpermDonor, handleSubmit, submitting
    } = this.props

    const hideFatherOption = fatherKnown === 'no' || (assistedHumanReproduction === 'yes' && assistedHumanReproductionSpermDonor)
    const deliveryAddresses = hideFatherOption ?
      irdDeliveryAddresses.filter(opt => opt.value !== 'fatherAddress') :
      irdDeliveryAddresses

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

          <Field {...getFieldProps(schema, 'ird.applyForNumber')} />

          { applyForNumber === 'yes' &&
            <div className="conditional-field">
              <Field {...getFieldProps(schema, 'ird.deliveryAddress')} options={deliveryAddresses} />
              {
                deliveryAddress &&
                <Field {...getFieldProps(schema, 'ird.numberByEmail')} />
              }

              {
                numberByEmail === 'yes' &&
                <span className="info">
                  By selecting <strong>Yes</strong> you agree to receive your child's IRD number by email. Inland Revenue will take all reasonable steps to reduce any risk of unauthorised access or release of confidential information. If you don’t provide consent, your IRD number will be mailed to the postal address you have provided.
                </span>
              }

              <Field {...getFieldProps(schema, 'ird.taxCreditIRDNumber')} />
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

          <Field {...getFieldProps(schema, 'msd.notify')} />

          { msdNotify &&
            <div className="conditional-field">
              <Field {...getFieldProps(schema, 'msd.mothersClientNumber')} />
              <Field {...getFieldProps(schema, 'msd.fathersClientNumber')} />
            </div>
          }

          <div className="form-actions">
            { this.props.isReviewing ?
              <button type="button" className="previous" onClick={handleSubmit(this.props.onPrevious)}>Back</button>:
              <button type="button" className="previous" onClick={this.props.onPrevious}>Back</button>
            }
            <div>
              { this.props.isReviewing &&
                <button type="button" className="review" onClick={handleSubmit(this.props.onComebackToReview)}>Return to review</button>
              }
              <button type="submit" className="next" disabled={submitting}>Next</button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

IrdMsdSharingForm.propTypes = {
  applyForNumber: PropTypes.string,
  deliveryAddress: PropTypes.string,
  numberByEmail: PropTypes.string,
  msdNotify: PropTypes.bool,
  fatherKnown: PropTypes.string,
  assistedHumanReproduction: PropTypes.string,
  assistedHumanReproductionSpermDonor: PropTypes.bool,
  onSubmit: PropTypes.func,
  onPrevious: PropTypes.func,
  isReviewing: PropTypes.bool,
  onComebackToReview: PropTypes.func,
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  pristine: PropTypes.bool
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
    deliveryAddress: selector(state, 'ird.deliveryAddress'),
    numberByEmail: selector(state, 'ird.numberByEmail'),
    msdNotify: selector(state, 'msd.notify'),
    fatherKnown: selector(state, 'fatherKnown'),
    assistedHumanReproduction: selector(state, 'assistedHumanReproduction'),
    assistedHumanReproductionSpermDonor: selector(state, 'assistedHumanReproductionSpermDonor'),
  })
)(IrdMsdSharingForm)

export default makeFocusable(IrdMsdSharingForm)
