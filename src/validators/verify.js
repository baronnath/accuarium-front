// src/validators/verify.js

let errors = false;

export default (user) => {
	const validation =  {
		code: codeValidator(user.values.code),
	}

	if(errors) return validation;

	return false;
}

function codeValidator (code: string) {
  if (!code || code.length <= 0) {
  	errors = true;
  	return 'Verification code cannot be empty.';
  }

  return false;
};