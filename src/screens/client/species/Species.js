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
import Separator from '../../../components/Separator';
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
    Api.getSpeciesById(speciesId)
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

  function paramIcon(icon, size, color, alt) {
    return <View style={styles.paramContainer}>
      <MaterialCommunityIcons style={styles.listIcon}
        name={icon} 
        color={color ? color : theme.colors.lightText}
        size={size}
      />
      { alt &&
        <Paragraph style={styles.paramDesc}>
          {ucFirst(alt)}
        </Paragraph>
      }
    </View>
  }

  function paramValues(values, alt) {
    return <View style={styles.paramContainer}>
        { alt &&
          <Paragraph style={styles.paramDesc}>
            {ucFirst(alt)}
          </Paragraph>
        }
        <Paragraph style={styles.parameters}>
          {values}
        </Paragraph>
      </View>
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

            <Paragraph style={styles.scientific} fontStyle="italic">
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

            
            <View style={styles.container}>
              <Subheader style={styles.subheader}>Water chemistry</Subheader>
              <Separator/>

              <View style={styles.paramsContainer}>

                <View style={styles.row}>
                  <View style={styles.paramContainer}>
                    <FontAwesome5 style={styles.listIcon}
                      name="temperature-high" 
                      color={theme.colors.lightText}
                      size={20}
                    />
                  </View>

                  <View style={styles.paramContainer}>
                    <View style={[styles.row,{alignItems: 'center',justifyContent: 'center'}]}>
                      <MaterialCommunityIcons style={[styles.listIcon,{ marginTop: 10}]}
                        name="alpha-p" 
                        color={theme.colors.lightText}
                        size={30}
                      />
                      <MaterialCommunityIcons style={[styles.listIcon,{marginLeft: -20}]}
                        name="alpha-h" 
                        color={theme.colors.lightText}
                        size={30}
                      />
                    </View>
                  </View>

                  {paramIcon('grain',24)}
                </View>

                <View style={styles.row}>
                  {paramValues(`${species.parameters.temperature.min}-${species.parameters.temperature.max}`,'Temperature')}
                  {paramValues(`${species.parameters.ph.min}-${species.parameters.ph.max}`,'pH')}
                  {paramValues(`${species.parameters.dh.min}-${species.parameters.dh.max}`,'Hardness')}
                </View>
              </View>
              
              <Subheader style={styles.subheader}>Dimensions</Subheader>
              <Separator/>

              <View style={styles.paramsContainer}>

                <View style={styles.row}>
                  {paramIcon('ruler',24)}
                  {paramIcon('cube-scan',26)}
                  {paramIcon('waves',24)}
                </View>

                <View style={styles.row}>
                  {paramValues(`${species.length.min}-${species.length.max}`,'Size')}
                  {paramValues(species.minTankLiters,'Min. tank')}
                  {paramValues(ucFirst(species.depth.name[locale]),'Swim area')}
                </View>
                
              </View>

              <Subheader style={styles.subheader}>Behavior</Subheader>
              <Separator/>

              <View style={styles.paramsContainer}>

                <View style={styles.row}>
                  { species.cleaning &&
                    paramIcon('spray-bottle',24)
                  }

                  { species.behavior.map(behavior => {
                      return paramIcon(behavior.icon, 24, behavior.warning ? theme.colors.secondary : null, behavior.name[locale])
                    })
                  }
                </View>                
              </View>
            
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
  scientific: {
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
  // card: {
  //   marginVertical: 25,
  //   flex: 1,
  //   alignSelf: 'stretch',
  // },
  // cardContent: {
  //   marginVertical: 10,
  //   marginHorizontal: 25,
  // },
  container:{
    flex: 1,
    width: '100%',
    marginVertical: 40,
    marginHorizontal: 25,
  },
  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  subheader: {
    marginTop: 15,
    color: theme.colors.lightText,
    // alignSelf: 'flex-end',
    fontSize: 12,
    lineHeight: 10,
  },
  paramsContainer: {
    paddingVertical: 10,
    flex: 1,
    alignSelf: 'stretch',
  },
  paramContainer: {
    width: '33%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listIcon: {
    // marginRight: 8,
  },
  parameters: {
    // fontSize: 10,
    // lineHeight: 10,
  },
  paramDesc: {
    color: theme.colors.lightText,
    fontSize: 10,
    lineHeight: 12,
  },
});