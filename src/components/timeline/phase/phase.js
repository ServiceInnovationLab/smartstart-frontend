import './phase.scss'

import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import Card from 'components/card/card'
import NonChronologicalCard from 'components/card/non-chronological-card/non-chronological-card'
import classNames from 'classnames'

class Phase extends Component {
  constructor (props) {
    super(props)

    this.state = {
      formattedDate: null
    }
  }

  componentWillReceiveProps (nextProps) {
    let date = nextProps.dueDate
    let formattedDate = null

    // if it is one of the first 4 phases, and dueDate is set
    if (this.props.number < 5 && date) {
      if (this.props.number === 4) {
        // the special birth phase needs the full due date displayed when due date is set
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

        formattedDate = date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear()
      } else {
        // the three pre-birth phases need a calculated date adding when due date is set
        formattedDate = this.calculateDateRange(this.props.number, date)
      }

      this.setState({
        formattedDate: formattedDate
      })
    }
  }

  calculateDateRange (phase, date) {
    const monthLookup = phase - 1 // months are 0 indexed
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
    // TODO grab the date matrix which is preloaded for this
    const phaseMetadata = [
      {
        id: 1,
        weeksStart: 0,
        weeksEnd: 14
      },
      {
        id: 2,
        weeksStart: 15,
        weeksEnd: 30
      },
      {
        id: 3,
        weeksStart: 31,
        weeksEnd: 40
      }
    ]
    const birthWeeks = phaseMetadata[2].weeksEnd // how many weeks is the max of the range

    let daysToSubtract = 0
    let dateStep = null
    let formattedDate = null

    // start of range
    daysToSubtract = (birthWeeks - phaseMetadata[monthLookup].weeksStart) * 7

    dateStep = new Date(date.getTime())
    dateStep.setDate(dateStep.getDate() - daysToSubtract)

    formattedDate = monthNames[dateStep.getMonth()]

    // end of range
    daysToSubtract = (birthWeeks - phaseMetadata[monthLookup].weeksEnd) * 7

    dateStep = new Date(date.getTime())
    dateStep.setDate(dateStep.getDate() - daysToSubtract)

    formattedDate += ' – ' + monthNames[dateStep.getMonth()]

    return formattedDate
  }

  render () {
    const { cards, number, title } = this.props
    let normalCards = []
    let nonChronologicalCards = []
    let dateClasses = classNames('phase-date', { 'hidden': !this.state.formattedDate })

    cards.map((card) => {
      if (!card.elements) { card.elements = [] } // a card can be empty

      // some cards need to be moved outside the chronological flow of the phase
      if (card.tags.indexOf('boac_presentation::non-chronological') >= 0) {
        nonChronologicalCards.push(<NonChronologicalCard key={card.id} id={card.id} title={card.label} elements={card.elements} />)
      } else {
        normalCards.push(<Card key={card.id} title={card.label} elements={card.elements} />)
      }
    })

    return (
      <div className='phase' data-test='phase'>
        <h2 data-test='phaseTitle'>
          <span className='phase-number'>{number}</span>
          {title}
        </h2>
        <p className={dateClasses}>{this.state.formattedDate}</p>

        {normalCards}
        {nonChronologicalCards}
      </div>
    )
  }
}

function mapStateToProps (state) {
  const {
    personalisationActions
  } = state
  const {
    dueDate
  } = personalisationActions || {
    dueDate: null
  }

  return {
    dueDate
  }
}

Phase.propTypes = {
  title: PropTypes.string.isRequired,
  cards: PropTypes.array.isRequired,
  number: PropTypes.number.isRequired,
  dueDate: PropTypes.object
}

export default connect(mapStateToProps)(Phase)
