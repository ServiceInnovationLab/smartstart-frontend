import './phase.scss'

import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import Card from 'components/card/card'
import NonChronologicalCard from 'components/card/non-chronological-card/non-chronological-card'
import classNames from 'classnames'
import ScrollableAnchor, { configureAnchors } from 'react-scrollable-anchor'

export class Phase extends Component {
  constructor (props) {
    super(props)

    this.state = {
      formattedDate: null
    }

    // scrollable anchor configuration comes here
    configureAnchors({ keepLastAnchorHash: true })
  }

  componentWillMount () {
    // the due data could already be available because of the b/e
    if (this.props.dueDate) {
      this.addFormattedDate(this.props.dueDate, this.props.phaseMetadata)
    }
  }

  componentWillReceiveProps (nextProps) {
    // the due date could change as a result of user interaction
    // don't wrap this in a if check as we need to handle resetting
    this.addFormattedDate(nextProps.dueDate, nextProps.phaseMetadata)
  }

  addFormattedDate (date, phaseMetadata) {
    let formattedDate = null

    // if it is one of the first 4 phases, and dueDate is set
    if (this.props.number < 5 && date) {
      if (this.props.number === 4) {
        // the special birth phase needs the full due date displayed when due date is set
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

        formattedDate = date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear()
      } else {
        // the three pre-birth phases need a calculated date adding when due date is set
        formattedDate = this.calculateDateRange(this.props.number, date, phaseMetadata)
      }

      this.setState({
        formattedDate: formattedDate
      })
    } else if (this.props.number < 5) {
      // update back to blank on reset
      this.setState({
        formattedDate: formattedDate
      })
    }
  }

  calculateDateRange (phase, date, recievedPhaseMetadata) {
    const monthLookup = phase - 1 // months are 0 indexed
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
    const phaseMetadata = recievedPhaseMetadata

    // if the metadata didn't load we can't do anything
    if (phaseMetadata.length > 0) {
      const birthWeeks = phaseMetadata[2].weeks_finish // how many weeks is the max of the range

      let daysToSubtract = 0
      let dateStep = null
      let formattedDate = null

      // start of range
      daysToSubtract = (birthWeeks - phaseMetadata[monthLookup].weeks_start) * 7

      dateStep = new Date(date.getTime())
      dateStep.setDate(dateStep.getDate() - daysToSubtract)

      formattedDate = monthNames[dateStep.getMonth()]

      // end of range
      daysToSubtract = (birthWeeks - phaseMetadata[monthLookup].weeks_finish) * 7

      dateStep = new Date(date.getTime())
      dateStep.setDate(dateStep.getDate() - daysToSubtract)

      formattedDate += ' – ' + monthNames[dateStep.getMonth()]

      return formattedDate
    } else {
      return ''
    }
  }

  render () {
    const { cards, number, title, maoriTitle, id } = this.props
    let normalCards = []
    let nonChronologicalCards = []
    let titleDisplay = title
    let dateClasses = classNames('phase-date', { 'hidden': !this.state.formattedDate })
    let phaseClasses = classNames('phase', 'phase-' + number)

    cards.map(card => {
      if (!card.elements) { card.elements = [] } // a card can be empty
      if (!card.maoriLabel) { card.maoriLabel = '' } // cope with missing maoriLabel

      // some cards need to be moved outside the chronological flow of the phase
      if (card.tags.indexOf('boac_presentation::non-chronological') >= 0) {
        nonChronologicalCards.push(<NonChronologicalCard key={card.id} id={card.id} title={card.label} elements={card.elements} />)
      } else {
        normalCards.push(<Card key={card.id} id={card.id} title={card.label} maoriTitle={card.maoriLabel} elements={card.elements} />)
      }
    })

    if (maoriTitle) {
      titleDisplay = (
        <span>{maoriTitle}<br /><span className='english'>{title}</span></span>
      )
    }

    return (
      <div className={phaseClasses} data-test='phase'>
        <ScrollableAnchor id={id.toString()}>
          <div>
            <h2 data-test='phaseTitle'>
              {titleDisplay}
            </h2>
            <p className={dateClasses}>{this.state.formattedDate}</p>
          </div>
        </ScrollableAnchor>

        {normalCards}
        {nonChronologicalCards}
        <div className='back-to-top'><a href='#app'>Back to top</a></div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  const {
    personalisation
  } = state
  const {
    dueDate,
    phaseMetadata
  } = personalisation || {
    dueDate: null,
    phaseMetadata: []
  }

  return {
    dueDate,
    phaseMetadata
  }
}

Phase.propTypes = {
  maoriTitle: PropTypes.string,
  title: PropTypes.string.isRequired,
  cards: PropTypes.array.isRequired,
  number: PropTypes.number.isRequired,
  id: PropTypes.number.isRequired,
  dueDate: PropTypes.object,
  phaseMetadata: PropTypes.array
}

export default connect(mapStateToProps)(Phase)
