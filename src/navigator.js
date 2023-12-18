// src/screens/stack.js

import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { navigator } from '../app.json';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from './theme';

import Register from './screens/Register';
import Verify from './screens/Verify';
import Login from './screens/Login';
import ResetPassword from './screens/ResetPassword';

import Tanks from './screens/client/tank/Tanks';
import Tank from './screens/client/tank/Tank';
import AddTank from './screens/client/tank/AddTank';
import EditTank from './screens/client/tank/EditTank';
import Species from './screens/client/species/Species';
import SpeciesSearch from './screens/client/species/SpeciesSearch';
import Profile from './screens/client/profile/Profile';

import { actions as userActions } from './ducks/user';

const AppStack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();
const SpeciesStack = createStackNavigator();
const TankStack = createStackNavigator();
const ProfileStack = createStackNavigator();

export default function Navigator() {

  const user = useSelector(state => state.user);
  const isLoading = useSelector(state => state.user.isLoading);
  // const [user, setUser] = useState(null);
  const dispatch = useDispatch();

  const screenOptions = {
    headerShown: false,
  };

  useLayoutEffect(() => {
    async function loadUser() {
      const userData = JSON.parse(await AsyncStorage.getItem('user'));
      dispatch(userActions.autoLogin(userData));
    }
    loadUser();
  }, []);

  function BottomNav() {
    return (
      <Tab.Navigator
        labeled={false}
        activeColor={theme.colors.surface}
        inactiveColor={theme.colors.disabled}
        barStyle={styles.bottomNav}
        initialRouteName="SpeciesNav"
      >
        <Tab.Screen name="TankNav"
          component={TankNav}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="fishbowl" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen name="SpeciesNav"
          component={SpeciesNav}
          options={{
            tabBarIcon: ({ color, size  }) => (
              <Icon name="fish" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen name="ProfileNav"
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
        <SpeciesStack.Screen name="SpeciesSearch" component={SpeciesSearch} />
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
        <TankStack.Screen name="EditTank" component={EditTank} />
      </TankStack.Navigator>
    );
  }

  function ProfileNav() {
    return (
      <ProfileStack.Navigator
        screenOptions={screenOptions}
      >
        <ProfileStack.Screen name="Profile" component={Profile} />
      </ProfileStack.Navigator>
    );
  }

  return (
    <AppStack.Navigator
      screenOptions={screenOptions}
    >
      { user.data != undefined && user.data.accessToken ? (
        <>
          <AppStack.Screen name="Home" component={BottomNav} />
        </>
      ) : (
        <>
          <AppStack.Screen name="Login" component={Login} />
          <AppStack.Screen name="Register" component={Register} />
          <AppStack.Screen name="Verify" component={Verify} />
          <AppStack.Screen name="ResetPassword" component={ResetPassword} />
        </>
      )}
    </AppStack.Navigator>
  );
};



const styles = StyleSheet.create({
  bottomNav: {
    height: theme.bottomNav.height,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
  },
});