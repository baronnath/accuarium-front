// src/components/Overview.js

import * as React from 'react';
import { StyleSheet } from 'react-native';
import Background from '../../components/Background';
import Header from '../../components/Header';
import MenuButton from '../../components/MenuButton';

export default function Overview({ navigation }) {

  const [active, setActive] = React.useState('');

  return (
    <Background>
      <MenuButton />
      <Header>
        Overview
      </Header>
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