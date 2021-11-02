// src/validators/register.js

let errors;

export default (user) => {
  errors = false;
  
	const validation =  {
		email: emailValidator(user.values.email),
		password: passwordValidator(user.values.password),
		name: nameValidator(user.values.name)
	}

  if(errors === true) return validation;

	return false;
}

function emailValidator (email: string) {
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

function passwordValidator (password: string) {
  if (!password || password.length <= 0) {
  	errors = true;
  	return 'validation.password.empty';
  }

  return false;
};

function nameValidator (name: string) {
  if (!name || name.length <= 0) {
  	errors = true;
  	return 'validation.name.empty';
  }

  return false;
};