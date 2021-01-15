// src/components/dashboard.js

import * as React from 'react';
import { StyleSheet } from 'react-native';
import Button from '../components/Button';
import Background from '../components/Background';
import Header from '../components/Header';
import DrawerContent from './dashboard/DrawerContent';

import Overview from './dashboard/Overview';
import Livestock from './dashboard/Livestock';
import AddSpecies from './dashboard/species/AddSpecies';
import Species from './dashboard/species/Species';
import SpeciesSearch from './dashboard/species/SpeciesSearch';
import Tanks from './dashboard/tank/Tanks';
import AddTank from './dashboard/tank/AddTank';
import { createDrawerNavigator } from '@react-navigation/drawer';

export default function Dashboard({ navigation }) {

  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen name="Livestock" component={Livestock} />
      <Drawer.Screen name="Overview" component={Overview} />
      <Drawer.Screen name="Species" component={Species} />
      <Drawer.Screen name="AddSpecies" component={AddSpecies} />
      <Drawer.Screen name="SpeciesSearch" component={SpeciesSearch} />
      <Drawer.Screen name="Tanks" component={Tanks} />
      <Drawer.Screen name="AddTank" component={AddTank} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});