// src/helpers/unitConverter.js

const {	round } = require('./helpers');

const properties = {
    hardness: {
        units: ['ppm', 'mg', 'µS',  'gH'],
        factor: [1, 1, .641025641025641, 17.86]
    },
    volume: {
        units: ['liter', 'm3', 'gallon', 'ounce'],
        factor: [1, 1000, 3.78504, 0.0295735]
    },
    length: {
        units: ['cm', 'm', 'mm', 'in', 'ft'],
        factor: [1, 100, 0.1, 2.54, 30.48]
    },
    temperature: {
        units: ['celsius', 'fahrenheit', 'kelvin'],
        factor: [1, 0.555555555555, 1],
        increment: [0, -32, -273.15],
    },
}

module.exports = (value, measure, from, to) => {

        // Check that "measure" is valid
        if(!properties.hasOwnProperty(measure))
            throw new Error('measures.measureNotFound');
        
        // Set the base unit if string 'base' provided as from    
        if(from == 'base'){
            from = properties[measure].units[0];
        }

        // Check that "from" unit is valid
        if(properties[measure].units.indexOf(from) < 0)
            throw new Error('measures.unitNotFound');

        // Set default target unit if not provided
        if(!to)
            to = properties[measure].units[0];

        // Determine the conversion factor
        let fromIndex = properties[measure].units.indexOf(from);
        let fromFactor = properties[measure].factor[fromIndex];

        let toIndex = properties[measure].units.indexOf(to);
        let toFactor = properties[measure].factor[toIndex];

        // Convert to the base (main) unit to make easier the conversion to any other unit
        // (temperature needs an increment)
        if(measure == 'temperature')
            value = value + properties[measure].increment[fromIndex];
        
        value = value * fromFactor;

        // Final conversion
        // (temperature needs an increment)
        value = value / toFactor;

        if(measure == 'temperature')
            value = value - properties[measure].increment[toIndex];

        return round.round(value, 2);
}