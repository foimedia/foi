import {
  AUTH_SUCCESS,
  AUTH_FAILURE,
  AUTH_LOGOUT_SUCCESS
} from 'actions/auth';

const initialState = {};

export default function reducer (state = initialState, action) {
  switch(action.type) {
    case AUTH_SUCCESS : {
      state = Object.assign({}, initialState, state);
      state.signedIn = true;
      state.user = Object.assign({}, action.user);
      return state;
    }
    case AUTH_FAILURE :
    case AUTH_LOGOUT_SUCCESS : {
      state = Object.assign({}, initialState, state);
      state.signedIn = false;
      state.user = undefined;
      return state;
    }
    default :
      return state;
  }
}
