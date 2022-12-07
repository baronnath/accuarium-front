// src/validators/tank.js

import store from '../store';
import helpers from '../helpers/helpers';
import * as FileSystem from 'expo-file-system';
import { actions as alertActions } from '../ducks/alert';

let errors;

export default (tank) => {
	errors = false;

	const validation =  {
		name: nameValidator(tank.name),
    width: measureValidator('width', tank.width),
    height: measureValidator('height', tank.height),
    length: measureValidator('length', tank.length),
    liters: measureValidator('liters', tank.liters),
	}

	if(errors === true) return validation;

	return false;
}

function nameValidator (name) {

  if (!name || name.length <= 0) {
  	errors = true;
  	return 'tank.validation.name.notEmpty';
  }

  return false;
};

function measureValidator (measure, value) {

  if(value){
  	if(!helpers.maxDecimal(value)) {
			errors = true;
			return `tank.validation.${measure}.numberDecimals`;
		}

  	if(value <= 0){
			errors = true;
			return `tank.validation.${measure}.notValid`;
		}
	}

	return false;
};

export async function isValidImage(stream){
  const { uri } = stream;
  const maxSize = 15;
  const validFormats = ['jpg', 'jpeg'];
  let valid = true;

  const fileInfo = await FileSystem.getInfoAsync(uri);

  if (!fileInfo?.size) {
    store.dispatch(alertActions.error('tank.validation.image.unknown'));
    valid = false;
  }

  const fileSize = fileInfo.size / 1024 / 1024;
  if (fileSize > maxSize) {
    store.dispatch(alertActions.error('tank.validation.image.size'));
    valid = false;
  }

  const fileExtension = uri.substr(uri.lastIndexOf('.') + 1);
  if(!validFormats.includes(fileExtension)){
    store.dispatch(alertActions.error('tank.validation.image.format'));
    valid = false;
  }

  return valid;
}