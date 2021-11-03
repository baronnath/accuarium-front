// src/validators/user.js

import helpers from '../helpers/helpers';

let errors;

export default (user) => {
	errors = false;

	const validation =  {
		locale: localeValidator(user.locale),
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