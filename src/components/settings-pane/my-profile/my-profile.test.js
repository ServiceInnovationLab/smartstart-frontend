/* eslint-env jest */
import React from 'react' // eslint-disable-line no-unused-vars
import {MyProfileComponent} from './my-profile'
import {shallow, mount} from 'enzyme'

let myProfile, dispatchMock, props

beforeEach(() => {
  dispatchMock = jest.fn()
  props = {
    personalisationValues: {
      settings: {
        dd: ''
      }
    },
    dispatch: dispatchMock
  }
})

describe('render empty', () => {
  beforeEach(() => {
    myProfile = shallow(
      <MyProfileComponent {...props} />
    )
  })

  test('it has correct header', () => {
    expect(myProfile.find('h4').text()).toEqual('Personalise the timeline')
  })

  test('it has a date input', () => {
    expect(myProfile.find('input[type="date"]').length).toEqual(1)
  })

  test('it has reset/cancel/update buttons', () => {
    expect(myProfile.find('button.reset-button').length).toEqual(1)
    expect(myProfile.find('button.cancel-button').length).toEqual(1)
    expect(myProfile.find('button[type="submit"]').length).toEqual(1)
    expect(myProfile.find('button[type="submit"]').text()).toEqual('Update')
  })
})

describe('render stored due date from state', () => {
  test('it display the valid due date from props', () => {
    props = {
      ...props,
      personalisationValues: {
        settings: {
          dd: '2016-10-07'
        }
      }
    }

    myProfile = shallow(
      <MyProfileComponent {...props} />
    )
    expect(myProfile.find('input[type="date"]').props().value).toEqual('2016-10-07')
  })

  test('it does not display the invalid date', () => {
    props = {
      ...props,
      personalisationValues: {
        settings: {
          dd: 'invalid date'
        }
      }
    }

    myProfile = shallow(
      <MyProfileComponent {...props} />
    )

    expect(myProfile.find('input[type="date"]').props().value).toEqual('')
  })
})

// TODO: find a way to assert the validity of the input? Or maybe we can add a `invalid` class?
xdescribe('date validation', () => {
  beforeEach(() => {
    // shallow rendering does not support refs
    myProfile = mount(
      <MyProfileComponent {...props} />
    )
  })

  test('it should mark invalid date as error', () => {
    myProfile.find('input[type="date"]').simulate('change', {target: {value: '2016-08-09 and some text'}})
    expect(myProfile.find('input[type="date"]').hasClass('error')).toBeTruthy()
  })

  test('it should  accept valid date', () => {
  })
})

describe('submit button', () => {
  let profilePaneCloseMock

  beforeEach(() => {
    profilePaneCloseMock = jest.fn()

    props = {
      ...props,
      profilePaneClose: profilePaneCloseMock
    }

    myProfile = mount(
      <MyProfileComponent {...props} />
    )
  })

  test('should prevent submission if an invalid date is entered', () => {
    myProfile.find('input[type="date"]').simulate('change', {target: {value: 'invalid date'}})

    // Enzyme do not support event propagation, so simulate a click on submit button does not work
    // we simulate the submit on the form directly
    myProfile.find('form').simulate('submit')

    expect(profilePaneCloseMock).not.toHaveBeenCalled()
    expect(dispatchMock).not.toHaveBeenCalled()
  })

  test('should allow submission even if no date is enterred', () => {
    myProfile.find('form').simulate('submit')

    expect(profilePaneCloseMock).toHaveBeenCalled()
    expect(dispatchMock.mock.calls.length).toEqual(2)
  })

  test('should submit if the date is valid', () => {
    myProfile.find('input[type="date"]').simulate('change', {target: {value: '2016-10-01'}})
    myProfile.find('form').simulate('submit')

    expect(profilePaneCloseMock).toHaveBeenCalled()
    expect(dispatchMock.mock.calls.length).toEqual(2)
  })
})

test('Reset button should clear the date', () => {
  props = {
    ...props,
    personalisationValues: {
      settings: {
        dd: '2016-10-07'
      }
    }
  }

  myProfile = mount(
    <MyProfileComponent {...props} />
  )

  myProfile.find('.reset-button').simulate('click')

  expect(myProfile.find('input[type="date"]').props().value).toEqual('')
})

test('Cancel button should close the pane', () => {
  let profilePaneCloseMock = jest.fn()

  props = {
    ...props,
    profilePaneClose: profilePaneCloseMock
  }

  myProfile = mount(
    <MyProfileComponent {...props} />
  )

  myProfile.find('.cancel-button').simulate('click')

  expect(profilePaneCloseMock).toHaveBeenCalled()
})

