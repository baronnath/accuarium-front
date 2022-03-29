// src/screens/dashboard/species/Species.js

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { axios }from '../../../helpers/axios';
import { ucFirst } from '../../../helpers/helpers';
import { backend } from '../../../../app.json';
import { StyleSheet, View, Platform, Image, Dimensions, LayoutAnimation, UIManager, TouchableOpacity, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Svg, { Path } from 'react-native-svg';
import Background from '../../../components/Background';
import Header from '../../../components/Header';
import Subheader from '../../../components/Subheader';
import Surface from '../../../components/Surface';
import Separator from '../../../components/Separator';
import Paragraph from '../../../components/Paragraph';
import GroupIcon from '../../../components/GroupIcon';
import Slider from '../../../components/Slider';
import Spinner from '../../../components/Spinner';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
  const [scientificNameSynonymsExpanded, setScientificNameSynonymsExpanded] = useState({ expanded: false });

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

  function changeLayout(value, setter) { 
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setter({ expanded: !value.expanded });
  }

  function paramIcon(icon, size, caption, color) {
    let icons = [];
    if(!helpers.isArray(icon)){
      icons.push(icon)
    }
    else{
      icons = icon;
    }
    return <>
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
    </>
  }

  function paramValues(values, caption) {
    return <View style={styles.paramContainer}>
        <Paragraph fontWeight='bold' style={styles.parameters}>
          {values}
        </Paragraph>
       { caption &&
          <Paragraph style={styles.paramDesc}>
            {ucFirst(caption)}
          </Paragraph>
        }
      </View>
  }

  function getSliderImages() {
    // species.images.map(img => {
    //       console.log('HEY',`${backend.imagesUrl}species/${species.scientificName.replace(' ', '-')}/${img}`)
    // })
    return species.images.map(img => {
      return <Image
        source={{ uri: `${backend.imagesUrl}species/${species.scientificName.replace(' ', '-')}/${img}` }}
        style={styles.image}
        defaultSource={{ uri: 'https://www.animalespeligroextincion.org/wp-content/uploads/2019/03/pez-betta.jpg' }} // TO BE FIXED: imageDefault not working in Android for debug built. Image default to be changed
      />
    })
  }

  function getFeedIcon(feed) {
    switch(feed){
      case 'herbivore':
        return 'leaf';
      case 'carnivore':
        return 'food-drumstick';
      default:
        return ['food-drumstick','leaf'];
    }
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

            <TouchableOpacity activeOpacity={0.8} onPress={() => changeLayout(othernamesExpanded,setOthernamesExpanded)} >
              <Header style={styles.header}>
                {ucFirst(species.name[locale])}
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={20}
                  color={theme.colors.text}
                />
              </Header>
            </TouchableOpacity>

            <View style={{ height: othernamesExpanded.expanded ? null : 0, overflow: 'hidden', maringVertical: 15 }}>
              <Paragraph style={styles.otherNamesTitle}>
                {i18n.t('species.otherNames')}:
              </Paragraph>
              <View style={styles.otherNamesContainer}>
                { species.otherNames &&
                    <Paragraph style={styles.otherName}>
                      { species.otherNames[locale].map((name, i, {length}) => {
                          let comma = i + 1 === length ? '' : ', ';
                          return ucFirst(name) + comma;
                        })
                      }
                    </Paragraph>
                }
              </View>
            </View>

            <TouchableOpacity activeOpacity={0.8} onPress={() => changeLayout(scientificNameSynonymsExpanded,setScientificNameSynonymsExpanded)} >
              <Paragraph style={styles.scientific} fontStyle="italic">
                {species.scientificName}
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={15}
                  color={theme.colors.lightText}
                />
              </Paragraph>
            </TouchableOpacity>

            <View style={{ height: scientificNameSynonymsExpanded.expanded ? null : 0, overflow: 'hidden', maringVertical: 15 }}>
              <Paragraph style={styles.otherNamesTitle}>
                {i18n.t('species.scientificNameSynonyms')}:
              </Paragraph>
              <View style={styles.otherNamesContainer}>
                { species.scientificNameSynonyms &&
                    <Paragraph style={styles.scientific}>
                      { species.scientificNameSynonyms.map((name, i, {length}) => {
                          let comma = i + 1 === length ? '' : ', ';
                          return ucFirst(name) + comma;
                        })
                      }
                    </Paragraph>
                }
              </View>
            </View>

            {/* TO BE FIXED: remove this SVG (default no pic found)
            <Svg height="150" width="100%" viewBox="0 7.5 100 20">
              <Path x="15" y="15" stroke={theme.colors.disabled} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeDasharray="3, 3" d="M66.5,22.2c0,0-29.7-39.6-66.5-10.6l0,0C36.8,40.6,66.5,0,66.5,0"/>
            </Svg>
            */}

            { species.images &&
              <Slider items={getSliderImages()} height={Dimensions.get('window').width} />
            }
            
            {/* Family and group */}
            <View style={[styles.row,{ marginBottom: theme.container.padding * 2 }]}>
             <Paragraph style={styles.classification}>{ucFirst(species.family.name[locale])}</Paragraph> 
             <Paragraph style={[styles.classification,{ borderLeftWidth: 1, borderLeftColor: theme.colors.lightText }]}>{ucFirst(species.group.name[locale])}</Paragraph> 
            </View>

            {/* Sizes, feed (diet) and swimming area */}
            <View style={styles.row}>
              <Surface
                elevation={12}
                style={styles.surface}
              >
                  <View style={[styles.paramsContainer,{ marginBottom: theme.container.padding }]}>
                    {paramIcon('ruler',30)}
                    {paramValues(`${species.length.min} - ${species.length.max} ` + i18n.t('measures.' + user.units.length + 'Abbr'),i18n.t('general.size'))}
                  </View>
                  <View style={styles.paramsContainer}>
                    {paramIcon('cube-scan',32)}
                    {paramValues(species.minTankVolume + ' ' + i18n.t('measures.' + user.units.volume + 'Abbr'),i18n.t('general.minTank'))}
                  </View>
              </Surface>
              <View style={{flex:1,justifyContent:'flex-start'}}>
                <Surface style={[styles.surface, styles.smallSurface, { marginBottom: theme.container.padding / 2 }]}>
                    {paramIcon(getFeedIcon(species.feed.en),28)}
                    {paramValues(ucFirst(species.feed.name[locale]),i18n.t('general.feed.one'))}
                </Surface>
                <Surface style={[styles.surface, styles.smallSurface, { marginTop: 0 }]}>
                    {paramValues(ucFirst(species.depth.name[locale]),i18n.t('general.swimArea'))}
                </Surface>
              </View>
            </View>

            {/* Water chemistry */}
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              // pagingEnabled={true}
            >
              {/* Temperature */}
              <Surface elevation={12} style={styles.surface}>
                <View>
                  <MaterialCommunityIcons
                    name="thermometer-low" 
                    color={theme.colors.text}
                    size={50}
                    style={{marginLeft:'-10%'}}
                  />
                  <View style={[styles.row,{marginTop: theme.container.padding * 3}]}>
                    <Subheader style={styles.waterParam}>
                      {`${unitConverter(species.parameters.temperature.min, 'temperature', 'base', user.units.temperature)} - ${unitConverter(species.parameters.temperature.max, 'temperature', 'base', user.units.temperature)}`}
                    </Subheader>
                    <Subheader style={styles.waterParamUnit}>
                      {i18n.t(`measures.${user.units.temperature}Abbr`)}
                    </Subheader>
                  </View>
                  <Paragraph style={[styles.paramDesc, {textAlign: 'left'}]}>
                    {ucFirst(i18n.t('general.temperature'))}
                  </Paragraph>
                </View>
              </Surface>
              {/* pH */}
              <Surface elevation={6} style={styles.surface}>
                <View>
                  <Subheader style={styles.waterParam}>
                    pH
                  </Subheader>
                  <View style={[styles.row,{marginTop: theme.container.padding * 3}]}>
                    <Subheader style={styles.waterParam}>
                      {`${species.parameters.ph.min} - ${species.parameters.ph.max}`}
                    </Subheader>
                  </View>
                  <Paragraph style={[styles.paramDesc, {textAlign: 'left'}]}>
                    {ucFirst(i18n.t('general.ph'))}
                  </Paragraph>
                </View>
              </Surface>
              {/* gh */}
              { species.parameters.gh.min != 0 && species.parameters.gh.max != 0 &&
                <Surface elevation={6} style={styles.surface}>
                  <View>
                    <MaterialCommunityIcons
                      name="focus-field" 
                      color={theme.colors.text}
                      size={50}
                      style={{marginLeft:'-3%'}}
                    />
                    <View style={[styles.row,{marginTop: theme.container.padding * 3}]}>
                      <Subheader style={styles.waterParam}>
                        {`${unitConverter(species.parameters.gh.min, 'hardness', 'base', user.units.hardness)} - ${unitConverter(species.parameters.gh.max, 'hardness', 'base', user.units.hardness)}`}
                      </Subheader>
                      <Subheader style={styles.waterParamUnit}>
                        {i18n.t(`measures.${user.units.hardness}Abbr`)}
                      </Subheader>
                    </View>
                    <Paragraph style={[styles.paramDesc, {textAlign: 'left'}]}>
                      {ucFirst(i18n.t('general.hardness'))}
                    </Paragraph>
                  </View>
                </Surface>
              }
              {/* kh */}
              { species.parameters.kh.min && species.parameters.kh.max &&
                <Surface elevation={6} style={styles.surface}>
                  <View>
                    <MaterialCommunityIcons
                      name="focus-field-horizontal" 
                      color={theme.colors.text}
                      size={50}
                      style={{marginLeft:'-3%'}}
                    />
                    <View style={[styles.row,{marginTop: theme.container.padding * 3}]}>
                      <Subheader style={styles.waterParam}>
                        {`${unitConverter(species.parameters.kh.min, 'hardness', 'base', user.units.hardness)} - ${unitConverter(species.parameters.kh.max, 'hardness', 'base', user.units.hardness)}`}
                      </Subheader>
                      <Subheader style={styles.waterParamUnit}>
                        {i18n.t(`measures.${user.units.hardness}Abbr`)}
                      </Subheader>
                    </View>
                    <Paragraph style={[styles.paramDesc, {textAlign: 'left'}]}>
                      {ucFirst(i18n.t('general.hardness'))}
                    </Paragraph>
                  </View>
                </Surface>
              }
            </ScrollView>


            
            <View style={styles.container}>
              
              
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
    // color: theme.colors.lightText,
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
    // justifyContent: 'space-between',
    width: '100%',
    marginVertical: 5,
  },
  surface: {
    margin: 0,
    marginTop: theme.container.padding,
    marginRight: theme.container.padding / 2,
    // justifyContent: 'flex-start',
    paddingTop: theme.container.padding * 1.3,
  },
  smallSurface: {
    alignItems:'center',
    marginRight: 0,
    padding: theme.container.padding * 1.3,
  },
  waterParam: {
    textAlign: 'left',
    fontSize: 50,
    lineHeight: 50,
  },
  waterParamUnit: {
    textAlign: 'left',
    marginLeft: 5,
  },
  subheader: {
    marginTop: 15,
    // color: theme.colors.lightText,
    // alignSelf: 'flex-end',
    fontSize: 12,
    lineHeight: 10,
  },
  classification: {
    flex: 1,
  },
  paramsContainer: {
    flex:1,
    alignItems:'center'
  },
  paramContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  listIcon: {
    marginBottom: theme.container.padding / 2,
  },
  parameters: {
    fontSize: 18,
    lineHeight: 18,
  },
  paramDesc: {
    // color: theme.colors.lightText,
    fontSize: 9,
    lineHeight: 9,
    // textAlign: 'left',
  },
});