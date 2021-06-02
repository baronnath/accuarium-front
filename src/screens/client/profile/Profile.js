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
import Button from '../../../components/Button';
import Paragraph from '../../../components/Paragraph';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { actions as userActions } from '../../../ducks/user';
import { actions as alertActions } from '../../../ducks/alert';
import { handleAlert } from '../../../helpers/global';
import { theme } from '../../../theme';

export default function Profile({ route, navigation }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.data);

  function signOut() {
    dispatch(userActions.logout(user));
  };
   
  return (
    <KeyboardAwareScrollView
      resetScrollToCoords={{x:0, y:0}}
    >
      <Background justify="top" style={styles.background}>
        { user && 
          <>
            <Avatar.Image style={styles.image} size={100} source={{uri: user.image}} />
            <Header>
              {ucFirst(user.name)}
            </Header>
            <Button
              icon="logout-variant"
              onPress={signOut}
              style={styles.logout}
            >
              Logout
            </Button>
          </>
        }
      </Background>
    </KeyboardAwareScrollView>
  );
}


const styles = StyleSheet.create({
  background: {
    paddingTop: 100,
    flex: 1,
  },
  logout: {
    // alignSelf: 'flex-end',
  },
});