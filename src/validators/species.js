// src/validators/species.js

import helpers from '../helpers/helpers';

let errors = false;

export default (species) => {
	const validation =  {
		name: nameValidator(species.values.name),
		minTemperature: temperatureValidator(species.values.minTemperature),
		maxTemperature: temperatureValidator(species.values.maxTemperature),
		minPh: phValidator(species.values.minPh),
		maxPh: phValidator(species.values.maxPh),
		minDh: dhValidator(species.values.minDh),
		maxDh: dhValidator(species.values.maxDh),
	}

	if(errors === true) return validation;

	return false;
}

function nameValidator (name) {

  if (!name || name.length <= 0) {
  	errors = true;
  	return 'Name cannot be empty.';
  }

  return false;
};

function phValidator (ph) {

	if(ph){
		if(!helpers.isDecimal(ph)) {
			errors = true;
			return 'pH only accepts numbers.';
		}

		if(ph < 1 || ph > 14){
			errors = true;
			return 'pH is between 1 and 14.';
		}
	}

	return false;
}

function temperatureValidator (temperature) {

	if(temperature){
		if(!helpers.isDecimal(temperature)) {
			errors = true;
			return 'Temperature only accepts numbers (up to 2 decimals).';
		}

		if(temperature < 0 || temperature > 50){
			errors = true;
			return 'temperature is not valid.';
		}
	}

	return false;
}

function dhValidator (dh) {

	if(dh){
		if(!helpers.isDecimal(dh)) {
			errors = true;
			return 'dH only accepts numbers (up to 2 decimals).';
		}

		if(dh < 0 || dh > 200){
			errors = true;
			return 'dH is not valid.';
		}
	}

	return false;
}
