// src/screens/dashboard/profile/Profile.js

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { axios }from '../../../helpers/axios';
import { ucFirst } from '../../../helpers/helpers';
import { backend } from '../../../../app.json';
import { StyleSheet, View, Platform, Image} from 'react-native';
import { ToggleButton, Avatar, Title, Caption } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Background from '../../../components/Background';
import Header from '../../../components/Header';
import MenuButton from '../../../components/MenuButton';
import Paragraph from '../../../components/Paragraph';
import SpeciesCard from '../../../components/SpeciesCard';
import Tag from '../../../components/Tag';
import Spinner from '../../../components/Spinner';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { actions as alertActions } from '../../../ducks/alert';
import { handleAlert } from '../../../helpers/global';
import { theme } from '../../../theme';

export default function Profile({ route, navigation }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.data);

   
  return (
    <KeyboardAwareScrollView
      resetScrollToCoords={{x:0, y:0}}
    >
      <Background justify="top" style={styles.background}>
        <Avatar.Image style={styles.image} size={100} source={{uri: user.image}} />
        <Header>
          {ucFirst(user.name)}
        </Header>
      </Background>
    </KeyboardAwareScrollView>
  );
}


const styles = StyleSheet.create({
  background: {
    paddingTop: 100,
  },
  image: {
  },
  tagContainer: {
    flex:1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    borderTopColor: theme.colors.lightText,
    borderTopWidth: 1,
    paddingTop: 8,
    width: '100%',
    justifyContent: 'center',

  },
  row: {
    flex: 1,
    marginVertical: 10,
    marginLeft: '50%',
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
  },
  listIcon: {
    marginRight: 8,
  },
  parameters: {
    position: 'absolute',
    left: 45,
  },
});