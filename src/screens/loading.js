// src/components/loading.js

import * as React from 'react';
import { StyleSheet } from 'react-native';
import Spinner from '../components/Spinner';
import Background from '../components/Background';

export default function Loading({ navigation }) {
  return (
    <Background>
      <Spinner />
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