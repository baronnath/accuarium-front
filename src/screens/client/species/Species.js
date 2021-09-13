// src/screens/dashboard/species/Species.js

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { axios }from '../../../helpers/axios';
import { ucFirst } from '../../../helpers/helpers';
import { backend } from '../../../../app.json';
import { StyleSheet, View, Platform, Image, Picker, LayoutAnimation, UIManager, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Svg, { Path } from 'react-native-svg';
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
import { theme } from '../../../theme';

export default function Species({ route, navigation }) {
  const user = useSelector(state => state.user.data);
  const locale = user.locale;

  const { speciesId } = route.params;
  const [isLoading, setLoading] = useState(false);
  const [id, setId] = useState(false);
  const [species, setSpecies] = useState(false);
  const [othernamesExpanded, setOthernamesExpanded] = useState({ expanded: false });

  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  } 

  useFocusEffect(
    React.useCallback(() => {
      setId(speciesId);
    }, [])
  );
   
  useEffect(() => {

    // Get species data
    axios.get(backend.url + '/species', {params: {speciesId: speciesId}})
      .then(res => {
          setSpecies(res.data.species);
      })
      .catch(err => {
          handleAlert(err);          
      });

  }, [speciesId]);

  function changeLayout() { 
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOthernamesExpanded({ expanded: !othernamesExpanded.expanded });
  } 

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
              <TouchableOpacity activeOpacity={0.8} onPress={changeLayout} >
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={20}
                  color={theme.colors.lightText}
                />
              </TouchableOpacity>
            </Header>

            <View style={{ height: othernamesExpanded.expanded ? null : 0, overflow: 'hidden', maringVertical: 15 }}>
              <Paragraph style={styles.otherNamesTitle}>
                Other names: 
              </Paragraph>
              <View style={styles.otherNamesContainer}>
                { species.otherNames &&
                    species.otherNames[locale].map((name, i, {length}) => {

                      return (
                        <Paragraph style={styles.otherName}>{name}{i + 1 === length ? '' : ', '}</Paragraph>
                      )
                    })
                }
              </View>
            </View>

            <Paragraph style={styles.subheader} fontStyle="italic">
              {species.scientificName}
            </Paragraph>

            {/* TO BE FIXED: remove this SVG (default no pic found)
            <Svg height="150" width="100%" viewBox="0 7.5 100 20">
              <Path x="15" y="15" stroke={theme.colors.disabled} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeDasharray="3, 3" d="M66.5,22.2c0,0-29.7-39.6-66.5-10.6l0,0C36.8,40.6,66.5,0,66.5,0"/>
            </Svg>
            */}

            <Image
              source={{ uri: `${backend.imagesUrl}species/${species._id}.png` }}
              style={styles.image}
              defaultSource={{ uri: 'https://www.animalespeligroextincion.org/wp-content/uploads/2019/03/pez-betta.jpg' }} // TO BE FIXED: imageDefault not working in Android for debug built. Image default to be changed
            />

            <Paragraph>
             {ucFirst(species.family.name[locale])}         |         {ucFirst(species.group.name[locale])} 
            </Paragraph>

            

            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>

                <View>
                  <FontAwesome5 style={styles.listIcon}
                    name="temperature-high" 
                    color={theme.colors.lightText}
                    size={30}
                  />
                  <Paragraph style={styles.parameters}>
                    {species.parameters.temperature.min}º - {species.parameters.temperature.max}º
                  </Paragraph>
                </View>

                <View style={styles.row}>
                  <MaterialCommunityIcons style={{marginLeft: -12, marginVertical: -10, marginTop: 1}}
                    name="alpha-p" 
                    color={theme.colors.lightText}
                    size={45}
                  />
                  <MaterialCommunityIcons style={[styles.listIcon,{marginLeft: -32, marginVertical: -13}]}
                    name="alpha-h" 
                    color={theme.colors.lightText}
                    size={52}
                  />
                  <Paragraph style={styles.parameters}>
                    {species.parameters.ph.min}º - {species.parameters.ph.max}º
                  </Paragraph>
                </View>

                <View style={styles.row}>
                  <MaterialCommunityIcons
                    name="water-percent"
                    color={theme.colors.lightText}
                    size={40}
                  />
                  <Paragraph style={styles.parameters}>
                    {species.parameters.dh.min}º - {species.parameters.dh.max}º
                  </Paragraph>
                </View>



              </Card.Content>
            </Card>
            
            <View style={styles.row}>
              <MaterialCommunityIcons style={{marginLeft: -2, marginVertical: -5, marginTop: -5}}
                name="ruler-square" 
                color={theme.colors.lightText}
                size={30}
              />
              <Paragraph style={styles.parameters}>
                {species.length.min} - {species.length.max} mm
              </Paragraph>
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
    width: '100%',
    resizeMode: "center",
    aspectRatio: 1.25,
  },
  otherNamesContainer: {
    justifyContent: 'center',
    marginBottom: 15,
  },
  otherNamesTitle: {
    fontSize: 12,
    color: theme.colors.lightText,
    marginBottom: 2,
  },
  otherName: {
    fontSize: 12,
    lineHeight: 14,
    marginBottom: 2,
  },
  card: {
    marginVertical: 25,
    flex: 1,
    alignSelf: 'stretch',
  },
  cardContent: {
    marginVertical: 10,
    marginHorizontal: 25,
  },
  row: {
    flex: 1,
    marginVertical: 15,
    width: '100%',
    // alignItems: 'center',
    flexDirection: 'row',
  },
  listIcon: {
    marginRight: 8,
  },
  parameters: {
    position: 'absolute',
    left: 70,
    top: 6,
    fontSize: 25,
    lineHeight: 25,
  },
});