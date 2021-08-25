// src/helpers/tank.js

import store from '../store';
import { actions as alertActions } from '../ducks/alert';
import { commaToPeriod } from './helpers';

export function calculateVolume(dimensions) {
    let { width, height, length } = dimensions;

    return new Promise((resolve, reject) => {
    	if(!width || !height || !length)
    		reject('Please fill your tank dimensions');
    	if(isNaN(width) || isNaN(height) || isNaN(length))
    		reject('Dimensions values must be numbers');

      width = commaToPeriod(width.toString());
      height = commaToPeriod(height.toString());
      length = commaToPeriod(length.toString());

    	const liters = width * height * length / 1000;
    	resolve(liters);
    });
}

export function findMainSpecies(species) {
  const main = species.find(sp => sp.main);
  if(main)
    return main;
  else
    return null;
}

export function splitSpeciesByDepth(species) {
  let splitted = {
    surface: [],
    middle: [],
    bottom: [],
  };

  species.forEach(sp => {
    sp.species.depth ? splitted[sp.species.depth.name.en].push(sp) : splitted['middle'].push(sp);
  });

  return splitted;
}

/**
 * Check if there is any compatibility in the tank.
 *
 * @param {compatibility}  Object  Compatibilities returned by the api including parameters and species copatibilities.
 *
 * @return {object} Object with three properties. First property is the full compatibility, the second one is the parameters compatibility and the last one is the species compatibility.
 */
export function isCompatible(compatibility){
  let isCompat = true;
  let isParamCompat = {};
  let isSpeciesCompat = {};

  // Checking parameters compatibility
  Object.keys(compatibility.parameters).map(function(speciesId) {
    isParamCompat[speciesId] = true;
    Object.keys(compatibility.parameters[speciesId]).map(function(parameter) {
      if(!compatibility.parameters[speciesId][parameter]){
        isCompat = false;
        isParamCompat[speciesId] = false;
      }
    });
  });

  // Checking species compatibility
  Object.keys(compatibility.species).map(function(speciesIdA) {
    isSpeciesCompat[speciesIdA] = true
    Object.keys(compatibility.species[speciesIdA]).map(function(speciesIdB) {
      if(compatibility.species[speciesIdA][speciesIdB].compatibility != 2){
        isCompat = false;
        isSpeciesCompat[speciesIdA] = false;
      }
    });
  });

  return {
    isCompatible: isCompat,
    isParameterCompatible: isParamCompat,
    isSpeciesCompatible: isSpeciesCompat,
  };
}