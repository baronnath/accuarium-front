// src/components/Home.js

import * as React from 'react';
import { StyleSheet } from 'react-native';
import Button from '../components/Button';
import Background from '../components/Background';

export default function Home({ navigation }) {
  return (
    <Background>
      <Button mode="outlined" onPress={() => navigation.navigate('Login')}>
        Login
      </Button>
      <Button mode="outlined" onPress={() => navigation.navigate('Register')}>
        Sign up
      </Button>
      <Button mode="outlined" onPress={() => navigation.navigate('Dashboard')}>
        Dashboard
      </Button>
    </Background>
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