import React from 'react'
import { TodoList } from 'components/settings-pane/todo-list/todo-list'
import { shallow } from 'enzyme'

let todoList, props

beforeEach(() => {
  props = {
    'shown': true,
    'todoPaneClose': function() {},
    'phases': [
      {
        'label': 'Phase with tasks',
        'id': 0,
        'elements': [
          {
            'elements': [
              {
                'id': 1,
                'type': 'richtext',
                'tags': ['boac_presentation::task'],
                'label': 'Task 1',
                'text': ''
              },
              {
                'id': 2,
                'type': 'richtext',
                'tags': ['boac_presentation::task'],
                'label': 'Task 2',
                'text': ''
              },
              {
                'id': 3,
                'type': 'richtext',
                'tags': [],
                'label': 'Not a task',
                'text': ''
              }
            ]
          }
        ]
      },
      {
        'label': 'Phase with no tasks',
        'id': 100,
        'elements': []
      }
    ]
  }
})

describe('render todo list', () => {
  beforeEach(() => {
    todoList = shallow(
      <TodoList {...props} />
    )
  })

  test('it only renders one phase', () => {
    expect(todoList.find('h5').length).toEqual(1)
  })

  test('it renders a link to the phase', () => {
    expect(todoList.find('h5').text()).toBe('Phase with tasks')
    expect(todoList.find('h5').find('a').props().href).toBe('#0')
  })
})

describe('render task elements', () => {
  beforeEach(() => {
    todoList = shallow(
      <TodoList {...props} />
    )
  })

  test('it renders two task components', () => {
    // Task is wrapped in the HOC 'connect' which changes the normal display name
    expect(todoList.find('Connect(Task)').length).toEqual(2)
  })
})
