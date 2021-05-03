// src/helpers/helpers.js
import _ from 'lodash';

// Check if object
exports.isObject = (input) => {
  if (input === null || input === undefined) return false;
  return Object.getPrototypeOf(input).isPrototypeOf(Object);
}

// Check if string
exports.isString = (string) => {
	if(typeof string === 'string')
	  return true;
	else
	  return false;
}

// Capitalize first string letter 
exports.ucFirst = (string) =>  {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Check integer
exports.isInteger = (string) => {
	return /^\d+$/.test(string);
}

// Check for decimal with max 2 digits
exports.isDecimal = (string) => {
	return /^\d+(\.\d{1,2})?$/.test(string);
}

// Deep clone
exports.clone = (input) => {
	return _.cloneDeep(input);
}

// Replace comma to period
exports.commaToPeriod = (string) => {
	return string.replace(/,/g, '.');
}


