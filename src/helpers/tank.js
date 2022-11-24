// src/helpers/tank.js

import store from '../store';
import { actions as alertActions } from '../ducks/alert';
import { commaToPeriod } from './helpers';
import * as FileSystem from 'expo-file-system';

export function calculateVolume(dimensions) {
    let { width, height, length } = dimensions;

    return new Promise((resolve, reject) => {
    	if(!width || !height || !length)
    		reject('emptyValues');
    	if(isNaN(width) || isNaN(height) || isNaN(length))
    		reject('noNumbers');

      width = commaToPeriod(width.toString());
      height = commaToPeriod(height.toString());
      length = commaToPeriod(length.toString());

    	const liters = width * height * length / 1000;
    	resolve(liters);
    });
}

export function findMainSpecies(species) {
  let main = null;

  if(species.length)
    main = species.find(sp => sp.main);

  return main;
}

export function splitSpeciesByDepth(species) {
  let splitted = {
    surface: [],
    middle: [],
    bottom: [],
    // everywhere: [], // default goes to middle
  };

  species.forEach(sp => {
    splitted[sp.species.depth.name.en] ? splitted[sp.species.depth.name.en].push(sp) : splitted['middle'].push(sp);
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
      if(compatibility.parameters[speciesId][parameter] === false){
        isCompat = false;
        isParamCompat[speciesId] = false;
      }
    });
  });

  // Checking species compatibility
  Object.keys(compatibility.species).map(function(speciesIdA) {
    isSpeciesCompat[speciesIdA] = true
    Object.keys(compatibility.species[speciesIdA]).map(function(speciesIdB) {
      if(compatibility.species[speciesIdA][speciesIdB].compatibility != 1){
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

export async function isValidImage(stream){
  const { uri } = stream;
  const maxSize = 15;
  const validFormats = ['jpg', 'jpeg'];
  let valid = true;

  const fileInfo = await FileSystem.getInfoAsync(uri);

  if (!fileInfo?.size) {
    store.dispatch(alertActions.error('tank.imageValidation.unknown'));
    valid = false;
  }

  const fileSize = fileInfo.size / 1024 / 1024;
  if (fileSize > maxSize) {
    store.dispatch(alertActions.error('tank.imageValidation.size'));
    valid = false;
  }

  const fileExtension = uri.substr(uri.lastIndexOf('.') + 1);
  if(!validFormats.includes(fileExtension)){
    store.dispatch(alertActions.error('tank.imageValidation.format'));
    valid = false;
  }

  return valid;
}