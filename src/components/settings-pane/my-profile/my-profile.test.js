import React from 'react'
import { MyProfile } from 'components/settings-pane/my-profile/my-profile'
import { shallow, mount } from 'enzyme'

let myProfile, dispatchMock, props

beforeEach(() => {
  dispatchMock = jest.fn()
  props = {
    personalisationValues: {
      settings: {
        dd: ''
      }
    },
    dispatch: dispatchMock,
    shown: true,
    isLoggedIn: false,
    profilePaneClose: function() {}
  }

  dispatchMock.mockReturnValue({
    then: () => {}
  })
})

describe('initial render', () => {
  beforeEach(() => {
    myProfile = shallow(
      <MyProfile {...props} />
    )
  })

  test('it has a date input', () => {
    expect(myProfile.find('input[type="date"]').length).toEqual(1)
  })

  test('it has cancel/update buttons', () => {
    expect(myProfile.find('button.cancel-button').length).toEqual(1)
    expect(myProfile.find('button[type="submit"]').length).toEqual(1)
  })
})

describe('render stored due date from state', () => {
  test('it displays the valid due date from props', () => {
    props = {
      ...props,
      personalisationValues: {
        settings: {
          dd: '2016-10-07'
        }
      }
    }

    myProfile = shallow(
      <MyProfile {...props} />
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
      <MyProfile {...props} />
    )

    expect(myProfile.find('input[type="date"]').props().value).toEqual('')
  })
})

describe('date validation and submit', () => {
  let profilePaneCloseMock

  beforeEach(() => {
    profilePaneCloseMock = jest.fn()

    props = {
      ...props,
      profilePaneClose: profilePaneCloseMock
    }

    myProfile = mount(
      <MyProfile {...props} />
    )
  })

  describe('annonymous user', () => {

    beforeEach(() => {
    })
    test('it should prevent submission if an invalid date is entered', () => {
      myProfile.find('input[type="date"]').simulate('change', {target: {value: 'invalid date'}})

      // enzyme does not support event propagation, so simulating a click on the submit button does not work
      // simulate the submit on the form directly
      myProfile.find('form').simulate('submit')

      expect(profilePaneCloseMock).not.toHaveBeenCalled()
      expect(dispatchMock.mock.calls.length).toEqual(2)
    })

    test('it should allow submission even if no date is entered', () => {
      myProfile.find('form').simulate('submit')

      expect(profilePaneCloseMock).toHaveBeenCalled()
      expect(dispatchMock.mock.calls.length).toEqual(3)
    })

    test('it should submit if the date is valid', () => {
      myProfile.find('input[type="date"]').simulate('change', {target: {value: '2016-10-01'}})
      myProfile.find('form').simulate('submit')

      expect(profilePaneCloseMock).toHaveBeenCalled()
      expect(dispatchMock.mock.calls.length).toEqual(5)
    })
  })

  describe('authenticated user', () => {
    test.skip('it should display user data correctly', () => {})
    test.skip('it should not submit if form invalid', () => {})
    test.skip('it should submit if form valid', () => {})
  })
})

describe('other actions', () => {
  test('it closes the pane without submitting when the cancel button is used', () => {
    let profilePaneCloseMock = jest.fn()

    props = {
      ...props,
      profilePaneClose: profilePaneCloseMock
    }

    myProfile = mount(
      <MyProfile {...props} />
    )

    myProfile.find('.cancel-button').simulate('click')

    expect(profilePaneCloseMock).toHaveBeenCalled()
    expect(dispatchMock.mock.calls.length).toEqual(0)
  })
})
