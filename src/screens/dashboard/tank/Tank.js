// src/screens/dashboard/tank/Tank.js

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { axios }from '../../../helpers/axios';
import { ucFirst } from '../../../helpers/helpers';
import { backend } from '../../../../app.json';
import { StyleSheet, View, Platform, Image, Picker, Text } from 'react-native';
import { ToggleButton } from 'react-native-paper';
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
import { theme } from '../../../theme';

export default function Tank({ route, navigation }) {
  const { tankId } = route.params;
  const [isLoading, setLoading] = useState(false);
  const [id, setId] = useState(false);
  const [tank, setTank] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setId(tankId);
    }, [])
  );
   
  useEffect(() => {

    // Get tank data
    axios.get(backend.url + '/tank', {params: {tankId: tankId}})
      .then(res => {
          console.log(res.data.tanks);
          setTank(res.data.tanks);
      })
      .catch(err => {
          handleAlert(err);          
      });

  }, [tankId, id]);

  function handleAlert(err){
    let message;
    err.response
        ? message = err.response.data.message
        : message = 'Server connection error'
    dispatch(alertActions.error(message));
  }

  return (
    <KeyboardAwareScrollView
      resetScrollToCoords={{x:0, y:0}}
    >
      <Background justify="top">
        <MenuButton />
        { tank ?
          <>
            <Header>
              {ucFirst(tank.name)}
            </Header>

            <Paragraph>
             Owner: {ucFirst(tank.user.name)} | {tank.user.email} 
            </Paragraph>

            <Image source={{ uri: `${backend.imagesUrl}tank/${tank._id}.jpg` }} style={styles.image} />

            <View style={styles.tagContainer}>
              { tank.species.lenght &&
                tank.species.otherNames.map(name => {
                    return (
                      <Tag>{name}</Tag>
                    )
                  })
              }
            </View>

            
          </>
          :
          <Spinner/>
        }

      </Background>
    </KeyboardAwareScrollView>
  );
}


const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    flexDirection:'column',
    alignItems: 'center',
    justifyContent: 'center',
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
});