// src/screens/client/tank/Tanks.js

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { axios }from '../../../helpers/axios';
import { ucFirst } from '../../../helpers/helpers';
import { backend } from '../../../../app.json';
import { StyleSheet, View, Platform, Image, Picker, Text, ScrollView } from 'react-native';
import { FAB } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Background from '../../../components/Background';
import Header from '../../../components/Header';
import Button from '../../../components/Button';
import Searchbar from '../../../components/Searchbar';
import Paragraph from '../../../components/Paragraph';
import TankCard from '../../../components/TankCard';
import Tag from '../../../components/Tag';
import Spinner from '../../../components/Spinner';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { actions as alertActions } from '../../../ducks/alert';
import { handleAlert } from '../../../helpers/global';
import { theme } from '../../../theme';
import { preferences } from '../../../../app.json';

export default function Tanks({ navigation }) {

  const [isLoading, setLoading] = useState(true);
  const [tanks, setTanks] = useState(false);
  const user = useSelector(state => state.user.data);

  useFocusEffect(
    React.useCallback(() => {
      axios.get(backend.url + '/tank', {params: {userId: user._id}})
      .then(res => {
          setTanks(res.data.tanks);
          setLoading(false);
      })
      .catch(err => {
          handleAlert(err);          
      });
    }, [user])
  );

  return (
    <>
      <Background justify="top" style={styles.background}>

        <Header>
          Tanks
        </Header>

        

          { isLoading ?
            <Spinner />
          :
            tanks.length ?
        
              <>
                <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                  {
                    tanks.map(tank => {
                      return (
                          <TankCard tank={tank}></TankCard>
                      );
                    })
                  }
                 
                </ScrollView>
                <FAB
                  style={styles.fab}
                  small
                  label="New tank"
                  icon="plus"
                  uppercase={false}
                  onPress={() => navigation.navigate('AddTank')}
                />
              </>
            :
            <View style={styles.centerContainer}>
              <Paragraph style={styles.paragraph}>No tanks yet. What you waiting for?</Paragraph>
              <Button style={styles.callButton} onPress={() => navigation.navigate('AddTank')}>Create tank</Button>
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
    bottom: 0,
  },
});