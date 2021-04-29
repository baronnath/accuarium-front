// src/validators/tank.js

import helpers from '../helpers/helpers';

let errors = false;

export default (species) => {
	const validation =  {
		name: nameValidator(species.values.name),
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


