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

// Check if array
exports.isArray = (input) => {
  return !!input && input.constructor === Array;
}

// Capitalize first string letter
exports.ucFirst = (string) =>  {
  if(exports.isString(string))
    return string.charAt(0).toUpperCase() + string.slice(1);
  else
  	return string;
}

// String to camel case
exports.toCamelCase = (string) => {
    return _.camelCase(string);
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

// Check empty object
exports.isEmpty = (object) => {
	return _.isEmpty(object);
}

// Replace comma to period
exports.commaToPeriod = (string) => {
	return string.replace(/,/g, '.');
}

// Round decimals
// use example:
// 		round.round(5.62, 1); --> 5.6 
// 		round.floo(5.12, 2);  --> 5.10  
exports.round = (function() {
    if (Number.EPSILON === undefined) {
        Number.EPSILON = Math.pow(2, -52);
    }
    if (Math.trunc === undefined) {
        Math.trunc = function(v) {
            return v < 0 ? Math.ceil(v) : Math.floor(v);
        };
    }
    var isRound = function(num, decimalPlaces) {
        //return decimalPlaces >= 0 &&
        //    +num.toFixed(decimalPlaces) === num;
        var p = Math.pow(10, decimalPlaces);
        return Math.round(num * p) / p === num;
    };
    var decimalAdjust = function(type, num, decimalPlaces) {
        if (isRound(num, decimalPlaces || 0))
            return num;
        var p = Math.pow(10, decimalPlaces || 0);
        var n = (num * p) * (1 + Number.EPSILON);
        return Math[type](n) / p;
    };
    return {
        // Decimal round (half away from zero)
        round: function(num, decimalPlaces) {
            return decimalAdjust('round', num, decimalPlaces);
        },
        // Decimal ceil
        ceil: function(num, decimalPlaces) {
            return decimalAdjust('ceil', num, decimalPlaces);
        },
        // Decimal floor
        floor: function(num, decimalPlaces) {
            return decimalAdjust('floor', num, decimalPlaces);
        },
        // Decimal trunc
        trunc: function(num, decimalPlaces) {
            return decimalAdjust('trunc', num, decimalPlaces);
        },
        // Format using fixed-point notation
        toFixed: function(num, decimalPlaces) {
            return decimalAdjust('round', num, decimalPlaces).toFixed(decimalPlaces);
        }
    };
})();


// Var name to string
// use example:
//    nameOf(() => myVariable)             // myVariable
//    nameOf(() => myVariable.name)        // myVariable.name
//    nameOf(() => myVariable.name.length) // myVariable.name.length
//    nameOf(() => myVariable.name[10])    // myVariable.name[10]
//    nameOf(() => MySuperClass)           // MySuperClass
exports.varToString = (f) => (f).toString().replace(/[ |\(\)=>]/g,'');

// Return 2 initials from string name
// input and output examples:
//     'Albus Percival Wulfric Brian dumbledore',   // AD
//     'Harry Potter',                              // HP
//     'Ron',                                       // R
//     '',                                          // <empty>
//     'Çigkofte With Érnie',                       // ÇÉ
//     'Hermione ',                                 // H  (Notice that there is a space after the name) 
//     'Neville LongBottom '                        // NL (space after name is trimmed)
exports.getInitials = (fullName) => {
  const allNames = fullName.trim().split(' ');
  const initials = allNames.reduce((acc, curr, index) => {
    if(index === 0 || index === allNames.length - 1){
      acc = `${acc}${curr.charAt(0).toUpperCase()}`;
    }
    return acc;
  }, '');
  return initials;
}
