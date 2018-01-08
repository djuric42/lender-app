import * as types from './Types'
import { Auth0Service } from '../services'
import { NavigationActions } from 'react-navigation'
import jwtDecode from 'jwt-decode'

export const loginEmailChanged = (text) => {
  return {
    type: types.LOGIN_EMAIL_CHANGED,
    payload: text
  }
}

export const loginPasswordChanged = (text) => {
  return {
    type: types.LOGIN_PASSWORD_CHANGED,
    payload: text
  }
}

export const loginLender = ({ email, password }) => {
  console.log('lalalalal666')
  return (dispatch) => {
    console.log(dispatch)
    dispatch({
      type: types.LOGIN_LENDER_LOADING
    })
    console.log('loginLender() email pass:')
    console.log(email)
    console.log(password)
    Auth0Service().siginInWithEmailAndPassword({ email, password })
      .then(response => handleResponse(dispatch, JSON.stringify(response)))
      .catch((error) => {
        loginLenderFail(dispatch, error)
      })
  }
}

export const fetchLenderInfo = ({ lender }, token) => {
  console.log('FETCHlENDERiNFO()')
  console.log(lender.sub)
  console.log(token)
  console.log('-------')
  const id = lender.sub
  return (dispatch) => {
    console.log('steva was here')
    dispatch({
      type: types.FETCH_LENDER_LOADING
    })
    Auth0Service().getUser(id, token)
      .then(response => handleLenderInfo(dispatch, JSON.stringify(response)))
      .catch((error) => {
        handleLenderInfoFail(dispatch, error)
        console.log('Error while fetchLenderInfo()')
        console.debug(error)
      })
  }
}

const handleLenderInfo = (dispatch, response) => {
  console.log('handleLenderInfo()')
  response = JSON.parse(response)
  console.log(response._bodyInit)
  const user = JSON.parse(response._bodyInit)
  dispatch({
    type: types.FETCH_LENDER_SUCCESS,
    payload: user
  })
}

const handleResponse = (dispatch, response) => {
  console.log('loginLenderSuccess() response: ')
  response = JSON.parse(response)
  const token = JSON.parse(response._bodyInit)
  const tokenId = token.id_token
  const lender = jwtDecode(tokenId)
  if (response.ok === true) {
    fetchLenderInfo({ lender }, tokenId)

    dispatch({
      type: types.LOGIN_LENDER_SUCCESS,
      payload: { lender, tokenId }
    })

    dispatch(NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Home' })
      ]
    }))
  }
  if (response.ok === false) {
    loginLenderFail(dispatch, response.code)
  }
}

const loginLenderFail = (dispatch, error) => {
  console.log('loginLenderFail() error:')
  console.debug(error)
  dispatch({
    type: types.LOGIN_LENDER_FAIL,
    payload: error
  })
}

const handleLenderInfoFail = (dispatch, error) => {

}