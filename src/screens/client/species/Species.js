// src/screens/dashboard/species/Species.js

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { axios }from '../../../helpers/axios';
import { ucFirst, toCamelCase } from '../../../helpers/helpers';
import { backend } from '../../../../app.json';
import { StyleSheet, View, Platform, Image, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';
import Svg, { Path } from 'react-native-svg';
import SpeciesMenu from './SpeciesMenu';
import OptionsMenu from '../../../components/OptionsMenu';
import Background from '../../../components/Background';
import BackButton from '../../../components/BackButton';
import Header from '../../../components/Header';
import Subheader from '../../../components/Subheader';
import Surface from '../../../components/Surface';
import Separator from '../../../components/Separator';
import Paragraph from '../../../components/Paragraph';
import GroupIcon from '../../../components/GroupIcon';
import Slider from '../../../components/Slider';
import Spinner from '../../../components/Spinner';
import Modal from '../../../components/Modal';
import Toggler from '../../../components/Toggler';
import SpeciesImage from '../../../components/SpeciesImage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { actions as alertActions } from '../../../ducks/alert';
import unitConverter from '../../../helpers/unitConverter';
import { handleAlert } from '../../../helpers/global';
import helpers from '../../../helpers/helpers';
import { getSpeciesImageUri } from '../../../helpers/tank';
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
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({});

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

  function paramIcon(icon, size, color) {
    let icons = iconToArray(icon);
    return <>
      <View style={{ flexDirection: 'row' }}>
        {
          icons.map((ic, i) => {
            return (
              <MaterialCommunityIcons
                key={i}
                style={styles.listIcon}
                name={ic} 
                color={color ? color : theme.colors.text}
                size={size}
              />
            )
          })
        }
      </View>
    </>
  }

  function getParam(param, measure, icon) {
    if(species.parameters[param].min && species.parameters[param].max) {
      return(
        <Surface elevation={9} style={styles.surface}>
          <View>
            { icon }
            <View style={[styles.row,{marginTop: theme.container.padding }]}>
              { param != 'ph' ?
                  <>
                    <Subheader style={styles.waterParam}>
                      {`${unitConverter(species.parameters[param].min, measure, 'base', user.units[measure])} - ${unitConverter(species.parameters[param].max, measure, 'base', user.units[measure])}`}
                    </Subheader>
                    <Subheader style={styles.waterParamUnit}>
                      {i18n.t(`measures.${user.units[measure]}Abbr`)}
                    </Subheader>
                  </>
                :
                  <>
                    <Subheader style={styles.waterParam}>
                      {`${species.parameters[param].min} - ${species.parameters[param].max}`}
                    </Subheader>
                  </>
              }
            </View>
            <Paragraph style={[styles.paramDesc, {textAlign: 'left'}]}>
              {ucFirst(i18n.t(`general.${measure}`))}
            </Paragraph>
          </View>
        </Surface>
      );
    }
  }

  function getBehaviour(icon, caption, color) {
    let icons = iconToArray(icon);
    return <TouchableOpacity
      key={caption}
      activeOpacity={0.8}
      onPress={() => {
        setModalVisible(true);
        setModalContent({
          icon: icon,
          description: `behavior.${toCamelCase(caption)}.description`,
          color: color
        });
      }}
    >
      <Surface
        elevation={color == theme.colors.warning ? 1 : 6}
        style={[styles.surface, styles.widthSurface, styles.row]}
      >
        {
          icons.map((ic, i) => {
            return (
              <MaterialCommunityIcons
                key={i}
                style={styles.listIcon}
                name={ic} 
                color={color ? color : theme.colors.text}
                size={28}
              />
            )
          })
        }
        { caption &&
          <Paragraph style={styles.widthSurfaceDesc}>
            {ucFirst(caption)}
          </Paragraph>
        }
        <View style={styles.rightSide}>
          <MaterialCommunityIcons
            name="chevron-right"
            size={30}
            color={theme.colors.lightText}
          />
        </View>
      </Surface>
    </TouchableOpacity>
  }

  function getCoexistance(coexist) {
    return(
      <Surface
        style={[styles.surface,{alignItems: 'center'}]}
        color={species.coexistence[coexist] ? theme.colors.quaternary : theme.colors.disabled}
      >
        { paramIcon(getCoexistanceIcon(coexist), 30, species.coexistence[coexist] ? theme.colors.primary : theme.colors.disabled) }
        <Paragraph style={{ color: species.coexistence[coexist] ? theme.colors.primary : theme.colors.disabled }}>
          { ucFirst(i18n.t(`coexistence.${coexist}`)) }
        </Paragraph>
      </Surface>
    );
  }                  


  function getCoexistanceIcon(coexist) {
    switch(coexist){
      case 'couple':
        return ['gender-male','gender-female'];
      case 'onlyMasc':
        return ['gender-male'];
      case 'onlyFem':
        return ['gender-female'];
      case 'harem':
        return ['gender-male','gender-female','gender-female'];
      case 'inverseHarem':
        return ['gender-female','gender-male','gender-male'];
      case 'mixedGroup':
        return ['arrow-collapse-all'];
      default:
        return ['fish'];
    }
  }

  function iconToArray(icon) {
    let icons = [];
    if(!helpers.isArray(icon)){
      icons.push(icon)
    }
    else{
      icons = icon;
    }
    return icons;
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

    if(!species.images)
      species.images = [null];

    return species.images.map(img => {
      return(
        <View key={!img ? species.scientificName + 'no-image' : img} style={{paddingHorizontal: theme.container.padding}}>
          <SpeciesImage
            img={img}
            scientificName={species.scientificName}
            style={styles.image}
            description={true}
            descriptionStyle={styles.imageDescription}
          />
        </View>
      );
    });
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
    <Background justify="top">
      { species ?
        <>
          <View style={styles.topLeft}>
            <BackButton navigation={navigation} style={{alignSelf: 'start'}}/>
            { species.group &&
                  <GroupIcon
                    name={species.group.icon} 
                    color={theme.colors.lightText}
                    size={36}
                    style={{marginTop: theme.container.padding}}
                  />
            }
            <OptionsMenu>
              <SpeciesMenu species={species} />
            </OptionsMenu>
          </View>

          

          {/* Species name and other names */}
          {species.name && species.name[locale] != undefined && 
            <Toggler
              title={species.name[locale]}
              description={i18n.t('species.otherNames')}
              list={species.otherNames[locale]}
              size='big'
            />
          }

          {/* Species scientific name and synonyms */}
          <Toggler
            title={species.scientificName}
            description={i18n.t('species.scientificNameSynonyms')}
            list={species.scientificNameSynonyms}
            size='small'
          />

          {/* TO BE FIXED: remove this SVG (default no pic found)
          <Svg height="150" width="100%" viewBox="0 7.5 100 20">
            <Path x="15" y="15" stroke={theme.colors.disabled} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeDasharray="3, 3" d="M66.5,22.2c0,0-29.7-39.6-66.5-10.6l0,0C36.8,40.6,66.5,0,66.5,0"/>
          </Svg>
          */}

          { 
            <Slider items={getSliderImages()} height={Dimensions.get('window').width} />
          }
          
          {/* Family and group */}
          <View style={[styles.row,{ marginBottom: theme.container.padding * 2 }]}>
            { species.family && 
              <Paragraph style={styles.classification}>{ucFirst(species.family.name[locale])}</Paragraph>
            }
            { species.group &&
              <Paragraph style={[styles.classification,{ borderLeftWidth: 1, borderLeftColor: theme.colors.lightText }]}>{ucFirst(species.group.name[locale])}</Paragraph>
            } 
          </View>

          {/* Sizes, feed (diet) and swimming area */}
          <View style={styles.row}>
            <Surface
              elevation={12}
              style={styles.surface}
              color={theme.colors.quaternary}
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
                  {paramIcon(getFeedIcon(species.feed.name.en),28)}
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
            style={{ marginBottom: theme.container.padding }}
            showsHorizontalScrollIndicator={true}
            persistentScrollbar={true}
            // pagingEnabled={true}
          >
            {/* Temperature */}
            { getParam('temperature', 'temperature', <MaterialCommunityIcons name="thermometer-low" color={theme.colors.text} size={35} style={{marginLeft:'-7%'}} />) }
            {/* pH */}
            { getParam('ph', 'ph', <Subheader style={ [styles.waterParam, styles.phParam] }>pH</Subheader>) }
            {/* gh */}
            { getParam('gh', 'hardness', <MaterialCommunityIcons name="focus-field" color={theme.colors.text} size={35} style={{marginLeft:'-2%'}} />) }
            {/* kh */}
            { getParam('kh', 'hardness', <MaterialCommunityIcons name="focus-field-horizontal" color={theme.colors.text} size={35} style={{marginLeft:'-2%'}} />) }
          </ScrollView>

          {/* Behavior */}
          <View style={styles.container}>
            <Subheader>{i18n.t('general.behavior.one')}</Subheader>
              {/* Wild */}
              { species.wild &&
                  getBehaviour('paw', 'wild', theme.colors.error)
              }
              {/* Cleaning */}
              { species.cleaning &&
                  getBehaviour('spray-bottle', 'cleaning')
              }

              { species.behavior.map(behavior => {
                  return getBehaviour(behavior.icon, behavior.name[locale], behavior.warning ? theme.colors.warning : theme.colors.text)
                })
              }
          </View>

          {/* Coexistance */}
          <View style={styles.container}>
            <Subheader>{i18n.t('coexistence.one')}</Subheader>

            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              { getCoexistance('indiv', 'fish') }
              { getCoexistance('couple', 'fish') }
              { getCoexistance('onlyFem', 'fish') }
              { getCoexistance('onlyMasc', 'fish') }
              { getCoexistance('mixedGroup', 'fish') }
              { getCoexistance('harem', 'fish') }
              { getCoexistance('inverseHarem', 'fish') }
            </ScrollView>
          </View>
          
        </>
        :
        <Spinner/>
      }

      <Modal isVisible={isModalVisible} setVisible={setModalVisible}>
        <MaterialCommunityIcons name={modalContent.icon} size={60} color={modalContent.color ? modalContent.color : theme.colors.primary} />
        <Paragraph style={styles.modalParagraph}>{i18n.t(modalContent.description)}</Paragraph>
      </Modal>
    </Background>
  );
}


const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    flexDirection:'column',
  },
  topLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignSelf: 'stretch',
    // marginTop: 10,
    // marginLeft: 10,
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
    resizeMode: "contain",
    aspectRatio: 1.25,
    borderRadius: theme.roundness,
  },
  imageDescription: {
    color: theme.colors.lightText,
    marginTop: theme.container.padding,
    marginBottom: 0,
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
  container:{
    flex: 1,
    width: '100%',
    marginBottom: theme.container.padding,
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
  widthSurface: {
    flex: 1,
    marginTop: theme.container.padding / 2,
    marginRight: 0,
    paddingTop: theme.container.padding / 2,
    paddingBottom: theme.container.padding / 2,
    alignItems:'center',
    justifyContent: 'flex-start',
  },
  widthSurfaceDesc: {
    marginLeft: theme.container.padding,
  },
  rightSide: {
    flex: 1,
    alignItems: 'flex-end',
    alignSelf: 'center',
  },
  waterParam: {
    textAlign: 'left',
    fontSize: 25,
    lineHeight: 25,
  },
  waterParamUnit: {
    textAlign: 'left',
    marginLeft: 8,
  },
  phParam: {
    marginTop: -9
  },
  classification: {
    flex: 1,
  },
  paramsContainer: {
    flex:1,
    alignItems:'center',
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
    color: theme.colors.primary,
    fontSize: 9,
    lineHeight: 9,
    // textAlign: 'left',
  },
});