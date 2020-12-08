// src/helpers/helpers.js

// Check if object
exports.isObject = (input) => {
  if (input === null || input === undefined) return false;
  return Object.getPrototypeOf(input).isPrototypeOf(Object);
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


