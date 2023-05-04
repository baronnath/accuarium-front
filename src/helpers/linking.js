// src/helpers/linking.js

import * as Linking from 'expo-linking';
// import Tank from '../screens/client/tank/Tank';
// import Species from '../screens/client/species/Species';

const prefix = Linking.createURL('/');

export const linkingRef = {
    prefixes: [
        prefix,
        'accua://'
    ],
    config: {
        screens: {
            Home: {
                screens: {
                    TankNav: {
                        screens: {
                            Tank: "tank/:tankId",
                        }
                    },
                    SpeciesNav: {
                        screens: {
                          Species: "species/:speciesId",
                        }
                    }
                }
            },            
        }
    }
};




