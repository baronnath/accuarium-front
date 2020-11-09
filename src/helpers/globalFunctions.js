// src/helpers/globalFunctions.js

import { actions as alertActions } from '../../ducks/alert';

export function handleAlert(err){
  let message;
  err.response
      ? message = err.response.data.message
      : message = 'Server connection error'
  dispatch(alertActions.error(message));
}