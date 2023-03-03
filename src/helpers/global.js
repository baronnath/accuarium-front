// src/helpers/global.js

import store from '../store';
import { actions as alertActions } from '../ducks/alert';
import { commaToPeriod } from './helpers';
import { theme } from '../theme';
import Bugsnag from '@bugsnag/expo';
import translator from '../translator/translator';

export function handleAlert(err){
  const i18n = translator();

  let message;
  err.response
      ? message = err.response.data.message
      : message = i18n.t('server.connectionError');
  store.dispatch(alertActions.error(message, false));

  if(err.response.data.error.statusCode >= 500) // Only critical errors
    Bugsnag.notify(err);  
}

// Check if ScrollView has been scrolled till the end
export function isEndOfScroll(nativeEvent){
	const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
	return layoutMeasurement.height + contentOffset.y >= contentSize.height - theme.container.padding;
}