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
import GroupIcon from '../../../components/GroupIcon';
import Spinner from '../../../components/Spinner';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { actions as alertActions } from '../../../ducks/alert';
import unitConverter from '../../../helpers/unitConverter';
import { handleAlert } from '../../../helpers/global';
import helpers from '../../../helpers/helpers';
import { Api }from '../../../helpers/axios';
import { theme } from '../../../theme';
import translator from '../../../translator/translator';

export default function Species({ route, navigation }) {
  const user = useSelector(state => state.user.data);
  const locale = user.locale;
  const i18n = translator(locale);

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

  function paramIcon(icon, size, caption, color) {
    let icons = [];
    if(!helpers.isArray(icon)){
      icons.push(icon)
    }
    else{
      icons = icon;
    }
    return <View style={styles.paramContainer}>
      <View style={{ flexDirection: 'row' }}>
        {
          icons.map(ic => {
            return (
              <MaterialCommunityIcons style={styles.listIcon}
                name={ic} 
                color={color ? color : theme.colors.text}
                size={size}
              />
            )
          })
        }
      </View>
      
      { caption &&
        <Paragraph style={styles.paramDesc}>
          {ucFirst(caption)}
        </Paragraph>
      }
    </View>
  }

  function paramValues(values, caption) {
    return <View style={styles.paramContainer}>
        { caption &&
          <Paragraph style={styles.paramDesc}>
            {ucFirst(caption)}
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
            { species.group &&
                <View style={styles.topLeft}>
                  <GroupIcon
                    name={species.group.icon} 
                    color={theme.colors.lightText}
                    size={26}
                  />
                </View>
            }

            <Header style={styles.header}>
              {ucFirst(species.name[locale])}
              <TouchableOpacity activeOpacity={0.8} onPress={changeLayout} >
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={20}
                  color={theme.colors.text}
                />
              </TouchableOpacity>
            </Header>

            <View style={{ height: othernamesExpanded.expanded ? null : 0, overflow: 'hidden', maringVertical: 15 }}>
              <Paragraph style={styles.otherNamesTitle}>
                {i18n.t('species.otherNames')}:
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
              <Subheader style={styles.subheader}>{i18n.t('general.waterChemistry')}</Subheader>
              <Separator/>

              <View style={styles.paramsContainer}>

                <View style={styles.row}>
                  <View style={styles.paramContainer}>
                    <FontAwesome5 style={styles.listIcon}
                      name="temperature-high" 
                      color={theme.colors.text}
                      size={20}
                    />
                  </View>

                  <View style={styles.paramContainer}>
                    <View style={[styles.row,{alignItems: 'center',justifyContent: 'center'}]}>
                      <MaterialCommunityIcons style={[styles.listIcon,{ marginTop: 10}]}
                        name="alpha-p" 
                        color={theme.colors.text}
                        size={30}
                      />
                      <MaterialCommunityIcons style={[styles.listIcon,{marginLeft: -20}]}
                        name="alpha-h" 
                        color={theme.colors.text}
                        size={30}
                      />
                    </View>
                  </View>

                  {paramIcon('focus-field',24)}
                  {paramIcon('focus-field-horizontal',24)}
                </View>

                <View style={styles.row}>
                  {paramValues(`${unitConverter(species.parameters.temperature.min, 'temperature', 'base', user.units.temperature)}-${unitConverter(species.parameters.temperature.max, 'temperature', 'base', user.units.temperature)} ` + i18n.t(`measures.${user.units.temperature}Abbr`), i18n.t('general.temperature'))}  
                  {paramValues(`${species.parameters.ph.min}-${species.parameters.ph.max}`, i18n.t('general.ph'))}
                  {paramValues(`${unitConverter(species.parameters.gh.min, 'hardness', 'base', user.units.hardness)}-${unitConverter(species.parameters.gh.max, 'hardness', 'base', user.units.hardness)} ` + i18n.t(`measures.${user.units.hardness}Abbr`), i18n.t('general.gh'))}
                  {paramValues(`${unitConverter(species.parameters.kh.min, 'hardness', 'base', user.units.hardness)}-${unitConverter(species.parameters.kh.max, 'hardness', 'base', user.units.hardness)} ` + i18n.t(`measures.${user.units.hardness}Abbr`), i18n.t('general.kh'))}
                </View>
              </View>
              
              <Subheader style={styles.subheader}>{i18n.t('general.dimensions')}</Subheader>
              <Separator/>

              <View style={styles.paramsContainer}>

                <View style={styles.row}>
                  {paramIcon('ruler',24)}
                  {paramIcon('cube-scan',26)}
                  {paramIcon('waves',24)}
                </View>

                <View style={styles.row}>
                  {paramValues(`${species.length.min}-${species.length.max} ` + i18n.t('measures.' + user.units.length + 'Abbr'),i18n.t('general.size'))}
                  {paramValues(species.minTankVolume,i18n.t('general.minTank'))}
                  {paramValues(ucFirst(species.depth.name[locale]),i18n.t('general.swimArea'))}
                </View>
                
              </View>

              <Subheader style={styles.subheader}>{i18n.t('coexistence.one')}</Subheader>
              <Separator/>

              <View style={styles.paramsContainer}>

                <View style={styles.row}>
                  { paramIcon('fish', 24, i18n.t('coexistence.indiv'), species.coexistence.indiv ? null : theme.colors.disabled) }
                  { paramIcon(['gender-male','gender-female'], 24, i18n.t('coexistence.couple'), species.coexistence.couple ? null : theme.colors.disabled) }
                  { paramIcon('gender-male', 24, i18n.t('coexistence.onlyMasc'), species.coexistence.onlyMasc ? null : theme.colors.disabled) }
                  { paramIcon('gender-female', 24, i18n.t('coexistence.onlyFem'), species.coexistence.onlyFem ? null : theme.colors.disabled) }
                  { paramIcon(['gender-male','gender-female','gender-female'], 24, i18n.t('coexistence.harem'), species.coexistence.harem ? null : theme.colors.disabled) }
                  { paramIcon(['gender-female','gender-male','gender-male'], 24, i18n.t('coexistence.inverseHarem'), species.coexistence.inverseHarem ? null : theme.colors.disabled) }
                </View>
                
              </View>

              <Subheader style={styles.subheader}>{i18n.t('general.behavior.one')}</Subheader>
              <Separator/>

              <View style={styles.paramsContainer}>

                <View style={styles.row}>
                  { species.cleaning &&
                    paramIcon('spray-bottle', 24, 'cleaning')
                  }

                  { species.behavior.map(behavior => {
                      return paramIcon(behavior.icon, 24, behavior.name[locale], behavior.warning ? theme.colors.secondary : null)
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
    // color: theme.colors.lightText,
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
    width: '25%',
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
    // color: theme.colors.lightText,
    fontSize: 10,
    lineHeight: 12,
  },
});