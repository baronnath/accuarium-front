// src/screens/client/tank/Tanks.js

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { ucFirst } from '../../../helpers/helpers';
import { backend } from '../../../../app.json';
import { StyleSheet, View, Platform, Image, Picker, Text, ScrollView } from 'react-native';
import { FAB } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import TankCard from './TankCard';
import Background from '../../../components/Background';
import Header from '../../../components/Header';
import Button from '../../../components/Button';
import Searchbar from '../../../components/Searchbar';
import Paragraph from '../../../components/Paragraph';
import Tag from '../../../components/Tag';
import Spinner from '../../../components/Spinner';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { actions as tankActions } from '../../../ducks/tank';
import { actions as alertActions } from '../../../ducks/alert';
import { handleAlert } from '../../../helpers/global';
import { theme } from '../../../theme';
import translator from '../../../translator/translator';
import { preferences } from '../../../../app.json';

export default function Tanks({ navigation }) {

  const user = useSelector(state => state.user.data);
  const locale = user.locale;
  const i18n = translator(locale);
  const tanks = useSelector(state => state.tanks.tanks);
  const isLoading = useSelector(state => state.tanks.isLoading);
  const dispatch = useDispatch();

  useFocusEffect(
    React.useCallback(() => {
      dispatch(tankActions.getTankByUser(user._id));
    }, [user])
  );

  return (
    <>
      <Background justify="top" style={styles.background}>

        <Header>
          {i18n.t('general.tank.other')}
        </Header>

          { isLoading ?
            <Spinner />
          :
            !!tanks.length ?
        
              <>
                <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                  {
                    tanks.map(tank => {
                      return (
                          <TankCard tank={tank} key={tank._id} ></TankCard>
                      );
                    })
                  }
                 
                </ScrollView>
                <FAB
                  style={styles.fab}
                  small
                  label={i18n.t('tank.newTank')}
                  icon="plus"
                  uppercase={false}
                  onPress={() => navigation.navigate('AddTank')}
                />
              </>
            :
            <View style={styles.centerContainer}>
              <Paragraph style={styles.paragraph}>{i18n.t('tank.noTanks')}</Paragraph>
              <Button style={styles.callButton} onPress={() => navigation.navigate('AddTank')}>{i18n.t('tank.createTank')}</Button>
            </View>
          }


      </Background>
    </>
  );
}


const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    alignSelf: 'stretch',
  },
  background: {
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: theme.bottomNav.height + theme.container.padding + 16,
  },
});