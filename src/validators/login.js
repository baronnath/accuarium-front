// src/validators/login.js

let errors;

export default (user) => {
  errors = false;

	const validation =  {
		email: emailValidator(user.values.email),
		password: passwordValidator(user.values.password),
	}

	if(errors === true) return validation;

	return false;
}

function emailValidator (email: string) {
  const re = /\S+@\S+\.\S+/;

  if (!email || email.length <= 0) {
  	errors = true;
  	return 'Email cannot be empty.';
  }
  if (!re.test(email)) {
  	errors = true;
  	return 'Ooops! We need a valid email address.';
  }

  return false;
};

function passwordValidator (password: string) {
  if (!password || password.length <= 0) {
  	errors = true;
  	return 'Password cannot be empty.';
  }

  return false;
};