/* globals fetch, API_ENDPOINT */
import './timeline.scss'

import React from 'react'
import Phase from 'components/timeline/phase/phase'
import 'whatwg-fetch'

class Timeline extends React.Component {
  constructor (props) {
    super(props)

    // TODO this state should probably come in as props from further up the tree
    this.state = {
      CardData: { phases: [] }
    }
  }

  componentWillMount () {
    let component = this

    fetch(API_ENDPOINT)
    .then(response => {
      // TODO handle 404 or 500 see https://github.com/github/fetch#handling-http-error-statuses
      return response.json()
    })
    .then(json => {
      component.setState({CardData: json})
    })
    .catch(error => {
      console.log('parsing failed', error)
    })
  }

  render () {
    return (
      <div className='timeline'>
        {this.state.CardData.phases.map((phase, index) => {
          if (!phase.elements) { phase.elements = [] } // a phase can be empty
          return <Phase key={phase.id} title={phase.label} cards={phase.elements} number={index} />
        })}
      </div>
    )
  }
}

export default Timeline
