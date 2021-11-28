// src/validators/user.js

import helpers from '../helpers/helpers';

let errors;

export default (user) => {
	errors = false;

	const validation =  {
		locale: localeValidator(user.locale),
		hardnessUnits: unitsValidator(user.units.hardness),
		temperatureUnits: unitsValidator(user.units.temperature),
		lengthUnits: unitsValidator(user.units.length),
		volumeUnits: unitsValidator(user.units.volume),
	}

	if(errors === true) return validation;

	return false;
}

function localeValidator (locale) {

  if (!locale || locale.length <= 0) {
  	errors = true;
  	return 'validation.locale.empty';
  }

  return false;
};

function unitsValidator (units) {

	if (!units || units.length <= 0) {
		errors = true;
		return 'validation.units.empty';
	}

	if (!helpers.isString(units)){
		return 'validation.units.notString';
	}
  
	return false;
};