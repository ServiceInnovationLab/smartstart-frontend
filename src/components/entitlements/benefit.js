import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { piwikOutlinkTrack } from 'actions/piwik'

class Benefit extends Component {
  constructor (props) {
    super(props)

    this.followLink = this.followLink.bind(this)
  }

  followLink (event) {
    piwikOutlinkTrack(event, this.props.dispatch)
  }

  render () {
    const { metadata, id } = this.props

    if (!metadata) return null
    let splitNotes = metadata.notes.split('|')

    return (
      <div className='entitlement-result'>
        <h4>{metadata.name}</h4>
        <p>{metadata.description}</p>
        {metadata.paymentValue &&
          <div className='award-up-to'>
            <span className='description'>{metadata.paymentDescription} </span>
            <span className='value'>{metadata.paymentValue} </span>
            <span className='frequency'>{metadata.paymentFrequency}</span>
          </div>
        }
        <p className='more-information info-bullet'><a href={metadata.moreInformationLink} target='_blank' rel='noopener noreferrer' onClick={this.followLink}>More information</a></p>
        {metadata.applicationLink &&
          <p className='apply-online info-bullet'><a href={metadata.applicationLink} target='_blank' rel='noopener noreferrer' onClick={this.followLink}>Apply online</a></p>
        }
        {metadata.WINZapplicationLink &&
          <p className='apply-online info-bullet'><a href='https://www.workandincome.govt.nz/about-work-and-income/contact-us/phone-numbers.html' target='_blank' rel='noopener noreferrer' onClick={this.followLink}>Contact Work and Income</a> to talk about your circumstances and they’ll explain how to apply.</p>
        }
        {metadata.WINZappointmentRequired &&
          <p className='winz-appointment info-bullet'>Attending an appointment with Work and Income is required as part of your application.</p>
        }
        {metadata.medicalCertRequired &&
          <p className='medical-cert info-bullet'>A medical certificate is required as part of your application.</p>
        }
        {metadata.notes &&
          <div>
            <h5>Things to know</h5>
            {splitNotes.length === 1 &&
              <p>{metadata.notes}</p>
            }
            {splitNotes.length > 1 &&
              <ul>
                {splitNotes.map((bullet, index) =>
                  <li key={`${id}-things-to-know-${index}`}>{bullet}</li>
                )}
              </ul>
            }
          </div>
        }
      </div>
    )
  }
}

Benefit.propTypes = {
  metadata: PropTypes.object,
  id: PropTypes.string,
  dispatch: PropTypes.func
}

const mapStateToProps = () => ({})

export default connect(mapStateToProps)(Benefit)
