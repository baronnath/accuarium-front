// src/helpers/linking.js

import * as Linking from 'expo-linking';
// import Tank from '../screens/client/tank/Tank';
// import Species from '../screens/client/species/Species';

const prefix = Linking.createURL('/');

export const linkingRef = {
    prefixes: [prefix],
    config: {
        screens: {
            Home: {
                screens: {
                    Tanks: {
                        screens: {
                            Tank: "tank/:tankId",
                        }
                    },
                    Species: {
                        screens: {
                          Species: "species/:speciesId",
                        }
                    }
                }
            },            
        }
    }
};




