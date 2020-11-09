// src/validators/species.js

let errors = false;

export default (species) => {
	const validation =  {
		name: nameValidator(species.values.name),
	}

	if(errors) return validation;

	return false;
}

function nameValidator (name) {

  if (!name || name.length <= 0) {
  	errors = true;
  	return 'Name cannot be empty.';
  }

  return false;
};
