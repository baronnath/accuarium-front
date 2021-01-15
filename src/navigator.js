// src/screens/stack.js

import React, { useState, useEffect, useLayoutEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { navigator } from '../app.json';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';

import Home from './screens/home';
import Register from './screens/register';
import Verify from './screens/verify';
import Login from './screens/login';

import Dashboard from './screens/dashboard';
import AddSpecies from './screens/dashboard/species/AddSpecies';
import Species from './screens/dashboard/species/Species';
import SpeciesSearch from './screens/dashboard/species/SpeciesSearch';
import Tanks from './screens/dashboard/tank/Tanks';
import AddTank from './screens/dashboard/tank/AddTank';

import { actions as userActions } from './ducks/user';

const Stack = createStackNavigator();

export default function Navigator() {

  const user = useSelector(state => state.user);
  // const [user, setUser] = useState(null);
  const dispatch = useDispatch();

  useLayoutEffect(async() => {
    const userData = JSON.parse(await AsyncStorage.getItem('user'));
    // console.log(userData);
    dispatch(userActions.autoLogin(userData));
  }, []);

  return (
    <Stack.Navigator
      screenOptions={navigator.screenOptions}
    >
      { user.data != undefined && user.data.role.name == "admin" &&
        <>
          <Stack.Screen name="AddTank" component={AddTank} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="AddSpecies" component={AddSpecies} />
          <Stack.Screen name="Species" component={Species} />
          <Stack.Screen name="SpeciesSearch" component={SpeciesSearch} />
          <Stack.Screen name="Tanks" component={Tanks} />
        </>
      }
      { user.data != undefined && user.data.accessToken ? (
        <Stack.Screen name="Home" component={Home} />
      ) : (
      <>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Verify" component={Verify} />
      </>
      )}
    </Stack.Navigator>
  );
};

