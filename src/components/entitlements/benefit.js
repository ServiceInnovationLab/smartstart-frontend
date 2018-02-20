import React, { PropTypes } from 'react'

const Benefit = props => {
  const { metadata, id } = props

  if (!metadata) return null
  let splitNotes = metadata.notes.split('|')

  return (
    <div className='entitlement-result'>
      <h4>{metadata.name}</h4>
      {metadata.paymentValue &&
        <div className='award-up-to'>
          <span className='description'>{metadata.paymentDescription}</span>
          <span className='value'>{metadata.paymentValue}</span>
          <span className='frequency'>{metadata.paymentFrequency}</span>
        </div>
      }
      <p>{metadata.description}</p>
      <p className='more-information'><a href={metadata.moreInformationLink} target='_blank' rel='noopener noreferrer'>More information</a></p>
      {metadata.applicationLink &&
        <p className='apply-online'><a href={metadata.applicationLink} target='_blank' rel='noopener noreferrer'>Apply online</a></p>
      }
      {metadata.WINZapplicationLink &&
        <p className='apply-online'><a href='https://www.workandincome.govt.nz/about-work-and-income/contact-us/phone-numbers.html' target='_blank' rel='noopener noreferrer'>Contact Work and Income</a> to talk about your circumstances and they’ll explain how to apply.</p>
      }
      {metadata.WINZappointmentRequired &&
        <p className='winz-appointment'>Attending an appoiontment with Work and Income is required as part of your application.</p>
      }
      {metadata.medicalCertRequired &&
        <p className='medical-cert'>A medical certificate is required as part of your application.</p>
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

Benefit.propTypes = {
  metadata: PropTypes.object,
  id: PropTypes.string
}

export default Benefit
