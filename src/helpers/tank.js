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