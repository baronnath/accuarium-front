// src/screens/stack.js

import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { navigator } from '../app.json';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from './theme';

import Register from './screens/register';
import Verify from './screens/verify';
import Login from './screens/login';

import Home from './screens/home';
import Tanks from './screens/client/tank/Tanks';
import Tank from './screens/client/tank/Tank';
import AddTank from './screens/dashboard/tank/AddTank';

import Dashboard from './screens/dashboard';
import AddSpecies from './screens/dashboard/species/AddSpecies';
import Livestock from './screens/dashboard/Livestock';
import Species from './screens/dashboard/species/Species';
import DashboardTanks from './screens/dashboard/tank/Tanks';
import DashboardTank from './screens/dashboard/tank/Tank';
import DashboardAddTank from './screens/dashboard/tank/AddTank';
import AddCompatibility from './screens/dashboard/compatibility/AddCompatibility';

import { actions as userActions } from './ducks/user';

const AppStack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();
const SpeciesStack = createStackNavigator();
const TankStack = createStackNavigator();
const ProfileStack = createStackNavigator();

export default function Navigator() {

  const user = useSelector(state => state.user);
  // const [user, setUser] = useState(null);
  const dispatch = useDispatch();

  const screenOptions = {
    headerShown: false
  };

  useLayoutEffect(async() => {
    const userData = JSON.parse(await AsyncStorage.getItem('user'));
    // console.log(userData);
    dispatch(userActions.autoLogin(userData));
  }, []);

  function BottomNav() {
    return (
      <Tab.Navigator
        labeled={false}
        activeColor={theme.colors.background}
        inactiveColor={theme.colors.disabled}
        barStyle={styles.bottomNav}
        initialRouteName="Tanks"
      >
        <Tab.Screen name="Livestock"
          component={SpeciesNav}
          options={{
            tabBarIcon: ({ color, size  }) => (
              <Icon name="fish" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen name="Tanks"
          component={TankNav}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="fishbowl" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen name="Profile"
          component={ProfileNav}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="account-circle" color={color} size={26} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }

  function SpeciesNav() {
    return (
      <SpeciesStack.Navigator
        screenOptions={screenOptions}
      >
        <SpeciesStack.Screen name="Livestock" component={Livestock} />
        <SpeciesStack.Screen name="Species" component={Species} />
      </SpeciesStack.Navigator>
    );
  }

  function TankNav() {
    return (
      <TankStack.Navigator
        screenOptions={screenOptions}
      >
        <TankStack.Screen name="Tanks" component={Tanks} />
        <TankStack.Screen name="Tank" component={Tank} />
        <TankStack.Screen name="AddTank" component={AddTank} />
      </TankStack.Navigator>
    );
  }

  function ProfileNav() {
    return (
      <ProfileStack.Navigator
        screenOptions={screenOptions}
      >
        <ProfileStack.Screen name="Tanks" component={Tanks} />
        <ProfileStack.Screen name="Tank" component={Tank} />
      </ProfileStack.Navigator>
    );
  }

  return (
    <AppStack.Navigator
      screenOptions={screenOptions}
    >
      { user.data != undefined && user.data.role.name.en == "admin" &&
        <>
          <AppStack.Screen name="Dashboard" component={Dashboard} />
          <AppStack.Screen name="AddSpecies" component={AddSpecies} />
          <AppStack.Screen name="Species" component={Species} />
          <AppStack.Screen name="Livestock" component={Livestock} />
          <AppStack.Screen name="Tanks" component={DashboardTanks} />
          <AppStack.Screen name="AddTank" component={DashboardAddTank} />
          <AppStack.Screen name="Tank" component={DashboardTank} />
          <AppStack.Screen name="AddCompatibility" component={AddCompatibility} />
        </>
      }
      { user.data != undefined && user.data.accessToken ? (
        <>
          <AppStack.Screen name="Home" component={BottomNav} />
        </>
      ) : (
        <>
          <AppStack.Screen name="Login" component={Login} />
          <AppStack.Screen name="Register" component={Register} />
          <AppStack.Screen name="Verify" component={Verify} />
        </>
      )}
    </AppStack.Navigator>
  );
};



const styles = StyleSheet.create({
  bottomNav: {
    backgroundColor: theme.colors.primary,
  },
});