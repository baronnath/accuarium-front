// src/validators/tank.js

import helpers from '../helpers/helpers';

let errors;

export default (tank) => {
	errors = false;

	const validation =  {
		name: nameValidator(tank.values.name),
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

