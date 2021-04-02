// src/helpers/global.js

import store from '../store';
import { actions as alertActions } from '../ducks/alert';

export function handleAlert(err){
  let message;
  err.response
      ? message = err.response.data.message
      : message = 'Server connection error'
  store.dispatch(alertActions.error(message));
}