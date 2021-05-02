// src/validators/tank.js

import helpers from '../helpers/helpers';

let errors = false;

export default (tank) => {
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


