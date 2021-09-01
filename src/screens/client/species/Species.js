// src/screens/dashboard/species/Species.js

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
import Subheader from '../../../components/Subheader';
import MenuButton from '../../../components/MenuButton';
import Paragraph from '../../../components/Paragraph';
import Tag from '../../../components/Tag';
import Spinner from '../../../components/Spinner';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { actions as alertActions } from '../../../ducks/alert';
import { handleAlert } from '../../../helpers/global';
import { Api }from '../../../helpers/axios';
import { theme } from '../../../theme';

export default function Species({ route, navigation }) {
  const user = useSelector(state => state.user.data);
  const locale = user.locale;

  const { speciesId } = route.params;
  const [isLoading, setLoading] = useState(false);
  const [id, setId] = useState(false);
  const [species, setSpecies] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setId(speciesId);
    }, [])
  );
   
  useEffect(() => {

    // Get species data
    Api.getSpeciesById(speciesId)
      .then(res => {
          setSpecies(res.data.species);
      })
      .catch(err => {
          handleAlert(err);          
      });

  }, [speciesId]);

  return (
    <KeyboardAwareScrollView
      resetScrollToCoords={{x:0, y:0}}
    >
      <Background justify="top">
        { species ?
          <>
            <View style={styles.topLeft}>
              <MaterialCommunityIcons
                name={species.type.icon} 
                color={theme.colors.lightText}
                size={26}
              />
            </View>
            <Header style={styles.header}>
              {ucFirst(species.name[locale])}
            </Header>
            <Paragraph style={styles.subheader} fontStyle="italic">
              {species.scientificName}
            </Paragraph>

            <Paragraph>
             {ucFirst(species.family.name[locale])} | {ucFirst(species.group.name[locale])} 
            </Paragraph>

            <Image source={{ uri: `${backend.imagesUrl}species/${species._id}.jpg` }} style={styles.image} />

            <View style={styles.tagContainer}>
              { species.otherNames &&
                species.otherNames[locale].map(name => {
                    return (
                      <Tag>{name}</Tag>
                    )
                  })
              }
            </View>

            <View style={[styles.row, {marginTop: 35, marginBottom: 0}]}>
              <FontAwesome5 style={styles.listIcon}
                name="temperature-high" 
                color={theme.colors.lightText}
                size={25}
              />
              <Text style={styles.parameters}>
                {species.parameters.temperature.min}º - {species.parameters.temperature.max}º
              </Text>
            </View>

            <View style={styles.row}>
              <MaterialCommunityIcons style={{marginLeft: -12, marginVertical: -10, marginTop: 1}}
                name="alpha-p" 
                color={theme.colors.lightText}
                size={35}
              />
              <MaterialCommunityIcons style={[styles.listIcon,{marginLeft: -25, marginVertical: -15}]}
                name="alpha-h" 
                color={theme.colors.lightText}
                size={40}
              />
              <Text style={styles.parameters}>
                {species.parameters.ph.min}º - {species.parameters.ph.max}º
              </Text>
            </View>

            <View style={styles.row}>
              <MaterialCommunityIcons style={{marginLeft: -12, marginVertical: -10, marginTop: -11, transform: [{rotateX: '180deg'}, {rotateY: '180deg'}]}}
                name="alpha-p" 
                color={theme.colors.lightText}
                size={35}
              />
              <MaterialCommunityIcons style={[styles.listIcon,{marginLeft: -25, marginVertical: -10}]}
                name="alpha-h" 
                color={theme.colors.lightText}
                size={40}
              />
              <Text style={styles.parameters}>
                {species.parameters.dh.min}º - {species.parameters.dh.max}º
              </Text>
            </View>

            <View style={styles.row}>
              <MaterialCommunityIcons style={{marginLeft: -2, marginVertical: -5, marginTop: -5}}
                name="ruler-square" 
                color={theme.colors.lightText}
                size={30}
              />
              <Text style={styles.parameters}>
                {species.length.min} - {species.length.max} mm
              </Text>
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
  topLeft: {
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
    marginTop: 10,
    marginLeft: 10,
  },
  header: {
    paddingBottom: 0,
  },
  subheader: {
    paddingTop: 0,
    color: theme.colors.lightText,
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