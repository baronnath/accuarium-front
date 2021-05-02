// src/validators/verify.js

let errors;

export default (user) => {
	errors = false;

	const validation =  {
		code: codeValidator(user.values.code),
	}

	if(errors === true) return validation;

	return false;
}

function codeValidator (code: string) {
  if (!code || code.length <= 0) {
  	errors = true;
  	return 'Verification code cannot be empty.';
  }

  return false;
};