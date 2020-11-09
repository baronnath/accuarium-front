// src/validators/register.js

let errors = false;

export default (user) => {
	const validation =  {
		email: emailValidator(user.values.email),
		password: passwordValidator(user.values.password),
		name: nameValidator(user.values.name)
	}

	if(errors) return validation;

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

function nameValidator (name: string) {
  if (!name || name.length <= 0) {
  	errors = true;
  	return 'Name cannot be empty.';
  }

  return false;
};