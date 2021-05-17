// src/helpers/global.js

import store from '../store';
import { actions as alertActions } from '../ducks/alert';
import { commaToPeriod } from './helpers';

export function handleAlert(err){
  let message;
  err.response
      ? message = err.response.data.message
      : message = 'Server connection error'
  store.dispatch(alertActions.error(message));
}