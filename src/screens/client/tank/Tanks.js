// src/screens/client/tank/Tanks.js

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { axios }from '../../../helpers/axios';
import { ucFirst } from '../../../helpers/helpers';
import { backend } from '../../../../app.json';
import { StyleSheet, View, Platform, Image, Picker, Text, ScrollView } from 'react-native';
import { ToggleButton, DataTable } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Background from '../../../components/Background';
import Header from '../../../components/Header';
import Button from '../../../components/Button';
import Searchbar from '../../../components/Searchbar';
import Paragraph from '../../../components/Paragraph';
import SpeciesCard from '../../../components/SpeciesCard';
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

  // useEffect(()=>{
  //    // Get tank data
  //   axios.get(backend.url + '/tank', {params: {userId: user._id}})
  //     .then(res => {
  //         setTanks(res.data.tanks);
  //         setLoading(false);
  //     })
  //     .catch(err => {
  //         handleAlert(err);          
  //     });
  // },[user]);

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
  
  // function onRowPress(tankId){
  //   navigation.navigate('Tank', {tankId: tankId});
  // }

  return (
    <>
      <Background justify="top">

        <Header>
          Tanks
        </Header>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        

          { isLoading ?
            <Spinner />
          :
            tanks.length ?
            tanks.map(tank => {
              return (
                <>   
                  <Text>{tank.name}</Text>
                </>
              );
            })
            :
            <View style={styles.centerContainer}>
              <Paragraph style={styles.paragraph}>No tanks yet. What you waiting for?</Paragraph>
              <Button style={styles.callButton} onPress={() => navigation.navigate('AddTank')}>Create tank</Button>
            </View>
          }

        </ScrollView>

      </Background>
    </>
  );
}


const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    width: '100%',
    flexDirection:'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paragraph: {
    color: theme.colors.disabled
  },
  callButton: {
    backgroundColor: theme.colors.accent
  },
  image: {
    marginVertical: 10,
    width: '100%',
    height: 200
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
  scroll: {
    alignSelf: 'stretch',
  },
  scrollContainer: {
    flex: 1,
  },
});