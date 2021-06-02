// src/helpers/global.js

import store from '../store';
import { actions as alertActions } from '../ducks/alert';
import { commaToPeriod } from './helpers';
import { theme } from '../theme';

export function handleAlert(err){
  let message;
  err.response
      ? message = err.response.data.message
      : message = 'Server connection error'
  store.dispatch(alertActions.error(message));
}

// Check if ScrollView has been scrolled till the end
export function isEndOfScroll(nativeEvent){
	const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
	return layoutMeasurement.height + contentOffset.y >= contentSize.height - theme.container.padding;
}