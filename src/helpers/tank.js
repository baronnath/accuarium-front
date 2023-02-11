// src/helpers/tank.js

import { commaToPeriod } from './helpers';
import * as ImagePicker from 'expo-image-picker';
import { isValidImage } from '../validators/tank';

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

export async function pickImage (callback) {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
    base64: true,
  });

  const image = result.assets[0];

  const isValid = await isValidImage(image);
  if (!result.canceled && isValid){
    callback('image', image);
  }
};

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
  let isCoexistenceCompat = {};

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
      if(compatibility.species[speciesIdA][speciesIdB].compatibility != 2){
        isCompat = false;
        isSpeciesCompat[speciesIdA] = false;
      }
    });
  });

  // Checking coexistence compatibility
  Object.keys(compatibility.coexistence).map(function(speciesId) {
    isCoexistenceCompat[speciesId] = true
    if(compatibility.coexistence[speciesId] === false){
      isCompat = false;
      isCoexistenceCompat[speciesId] = false;
    }
  });

  return {
    isCompatible: isCompat,
    isParameterCompatible: isParamCompat,
    isSpeciesCompatible: isSpeciesCompat,
    isCoexistenceCompatible: isCoexistenceCompat,
  };
}