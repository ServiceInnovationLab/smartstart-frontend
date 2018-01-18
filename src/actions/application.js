import Cookie from 'react-cookie'
import md5 from 'js-md5'

import { piwikParams, createPiwikAction } from 'actions/piwik'

export const APPLICATION_ERROR = 'APPLICATION_ERROR'
export const AUTH_ERROR = 'AUTH_ERROR'
export const PIWIK_TRACK = 'PIWIK_TRACK'
export const GET_PIWIK_ID = 'GET_PIWIK_ID'

export function applicationError (error) {
  return {
    type: APPLICATION_ERROR,
    error: error
  }
}

export function authError (error) {
  return {
    type: AUTH_ERROR,
    authError: error
  }
}

function piwikTrack () {
  return {
    type: PIWIK_TRACK
  }
}

function piwikId (id) {
  return {
    type: GET_PIWIK_ID,
    piwikID: id
  }
}

export function piwikTrackPost (piwikAction, piwikEvent) {
  // action should be a string
  // event can be a string of an outlink, or an object of an event
  // with the format:
  //   {
  //     category: string,
  //     action: string,
  //     name: string
  //   }
  return (dispatch, getState) => {
    const piwikID = getState().application.piwikID
    const isLoggedIn = getState().personalisation.isLoggedIn
    let customVars = {
      '1': ['Logged in for last action']
    }

    if (isLoggedIn) {
      customVars['1'].push('Yes')
    } else {
      customVars['1'].push('No')
    }

    return fetch(PIWIK_INSTANCE, {
      method: 'POST',
      body: JSON.stringify({ 'requests': [
        piwikParams(createPiwikAction(piwikAction, piwikID, customVars, piwikEvent))
      ]})
    })
    .then(() => {
      dispatch(piwikTrack())
    })
    .catch(() => {
      // fail silently, pretend the action happened anyhow
      dispatch(piwikTrack())
    })
  }
}

export function getPiwikID () {
  return (dispatch) => {
    let id = Cookie.load('piwikID')

    // if the cookie doesn't exist already, make one now
    if (!id) {
      let datetime = new Date()
      let expireDate = new Date()

      expireDate.setMonth(datetime.getMonth() + 15)
      id = md5(datetime.toString() + Math.random()).substr(0, 16)

      // the number of seconds in maxAge is a slight fudge as not all months have 31 days...
      Cookie.save('piwikID', id, { path: '/', secure: true, maxAge: 60 * 60 * 24 * 31 * 15, expires: expireDate })
    }

    dispatch(piwikId(id))

    return Promise.resolve() // so we can chain other actions
  }
}
