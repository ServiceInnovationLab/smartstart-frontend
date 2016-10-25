/* eslint-env jest */
import React from 'react' // eslint-disable-line no-unused-vars
import { Phase } from 'components/timeline/phase/phase'
import { Card } from 'components/card/card'
import { NonChronologicalCard } from 'components/card/non-chronological-card/non-chronological-card'
import { shallow, mount } from 'enzyme'

let phase, props

beforeEach(() => {
  props = {
    title: "Phase 1",
    cards: [],
    number: 1,
    id: 0,
    dueDate: new Date(2016,9,28), // 28/10/2016 - exactly 43 weeks into 2016
    phaseMetadata: [
      {
        "id":1,
        "weeks_start":0,
        "weeks_finish":14
      },
      {
        "id":2,
        "weeks_start":15,
        "weeks_finish":30
      },
      {
        "id":3,
        "weeks_start":31,
        "weeks_finish":42
      }
    ]
  }
})

describe('initial render', () => {
  beforeEach(() => {
    phase = shallow(
      <Phase {...props} />
    )
  })

  test('it renders the supplied header text', () => {
    expect(phase.find('h2').length).toEqual(1)
    expect(phase.find('h2').text()).toEqual(props.number + props.title) // number in the ::before
 })
})

describe('format date ranges for phases', () => {
  test('it calculates a date range if it is phase 1', () => {
    props = {
      ...props,
      number: 1
    }

    phase = shallow(
      <Phase {...props} />
    )

    expect(phase.find('.phase-date').text()).toEqual('Jan – Apr')
  })

  test('it shows the formatted full date for the 4th phase', () => {
    props = {
      ...props,
      number: 4
    }

    phase = shallow(
      <Phase {...props} />
    )
    expect(phase.find('.phase-date').text()).toEqual('28 October 2016')
  })

  test('it shows no dates for the phases above 4', () => {
    props = {
      ...props,
      number: 5
    }

    phase = shallow(
      <Phase {...props} />
    )
    expect(phase.find('.phase-date').hasClass('hidden')).toEqual(true)
  })
})

describe('render card components', () => {
  beforeEach(() => {
    props = {
      ...props,
      cards: [
        {
          id: 0,
          label: 'Test non chronological card',
          tags: ['boac_presentation::non-chronological']
        },
        {
          id: 1,
          label: 'Test normal card',
          tags: []
        }
      ]
    }

    phase = shallow(
      <Phase {...props} />
    )
  })

  test('it creates one non-chronological and one normal card', () => {
    expect(phase.find(Card).length).toEqual(1)
    expect(phase.find(NonChronologicalCard).length).toEqual(1)
  })

  test('it sorts non-chronological cards to the end', () => {
    expect(phase.children().last().prop('title')).toEqual('Test non chronological card')
  })
})
