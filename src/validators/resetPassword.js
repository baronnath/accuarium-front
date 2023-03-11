// src/validators/resetPassword.js

let errors;

export default (user) => {
  errors = false;

	const validation =  {
		email: emailValidator(user.values.email),
    code: codeValidator(user.values.code),
	}

	if(errors === true) return validation;

	return false;
}

function emailValidator (email) {
  const re = /\S+@\S+\.\S+/;

  if (!email || email.length <= 0) {
  	errors = true;
  	return 'validation.email.empty';
  }
  if (!re.test(email)) {
  	errors = true;
  	return 'validation.email.notValid';
  }

  return false;
};

function codeValidator (code) {
  if (!code || code.length <= 0) {
    errors = true;
    return 'validation.code.empty';
  }

  return false;
};