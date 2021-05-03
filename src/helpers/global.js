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

export function calculateVolume(dimensions) {
    let { width, height, length } = dimensions;

   	width = commaToPeriod(width);
   	height = commaToPeriod(height);
   	length = commaToPeriod(length);

    return new Promise((resolve, reject) => {
    	if(!width || !height || !length)
    		reject('Please fill your tank dimensions');
    	if(isNaN(width) || isNaN(height) || isNaN(length))
    		reject('Dimensions values must be numbers');

    	const liters = width * height * length / 1000;
    	resolve(liters);
    });
}