// src/screens/client/tank/GraphicTankSpecies.js

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, View, LayoutAnimation, UIManager, TouchableOpacity} from 'react-native';
import { ToggleButton, Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import Paragraph from '../../../components/Paragraph';
import Separator from '../../../components/Separator';
import GroupIcon from '../../../components/GroupIcon';
import { isEmpty } from '../../../helpers/helpers';
import { isCompatible } from '../../../helpers/tank';
import unitConverter from '../../../helpers/unitConverter';
import { theme } from '../../../theme';
import translator from '../../../translator/translator';

export default function GraphicTankSpecies({ species }) {

  const user = useSelector(state => state.user.data);
  const locale = user.locale;
  const i18n = translator(locale);
  const tank = useSelector(state => state.tanks.tank);
  const navigation = useNavigation();

  const [isComp, setIsComp] = useState(null);
  const [parametersCompat, setParametersCompat] = useState(null);
  const [speciesCompat, setSpeciesCompat] = useState(null);
  const [compExpanded, setCompExpanded] = useState({ expanded: false });

  useEffect(() => {
    if(!isEmpty(tank.compatibility)){
      setIsComp(isCompatible(tank.compatibility));
      setParametersCompat(tank.compatibility.parameters[species.species._id]);
      setSpeciesCompat(tank.compatibility.species[species.species._id])
    }
  }, [tank]);


  function compatibilityButton() {
    if(isComp.isParameterCompatible[species.species._id] === false || isComp.isSpeciesCompatible[species.species._id] === false){
      return <TouchableOpacity activeOpacity={0.8} onPress={changeLayout} style={styles.compatibilityButtons}>
          <Ionicons name="warning-outline" size={30} style={styles.icons} color={theme.colors.secondary}/>
          <MaterialCommunityIcons name="chevron-down" size={24} style={styles.icons} color={theme.colors.placeholder}/>
        </TouchableOpacity>
    }
  }

  function parameterCompatibility() {
    return <>
      <Paragraph style={styles.caption}>{i18n.t('tank.notCompatibleParameters')}</Paragraph>
      { !parametersCompat.temperature && 
        <View style={styles.rowContainer}>
          <View style={styles.compatIcon}>
            <MaterialCommunityIcons
              name="thermometer"
              color={theme.colors.secondary}
              size={23}
            />
          </View>
          <Paragraph style={styles.compatDescription}>
            {i18n.t('tank.temperatureBetween', {'min': unitConverter(species.species.parameters.temperature.min, 'temperature', 'base', user.units.temperature), 'max': unitConverter(species.species.parameters.temperature.max, 'temperature', 'base', user.units.temperature)})}
            {i18n.t('measures.' + user.units.temperature + 'Abbr')}
          </Paragraph>
        </View>
      }
      { !parametersCompat.ph && 
          <View style={styles.rowContainer}>
            <View style={styles.compatIcon}>
              <MaterialCommunityIcons style={{marginTop: 1}}
                name="alpha-p"
                color={theme.colors.secondary}
                size={25}
              />
            </View>
            <MaterialCommunityIcons style={{marginLeft:-20 ,marginVertical: -8}}
              name="alpha-h"
              color={theme.colors.secondary}
              size={32}
            />
            <Paragraph style={styles.compatDescription}>{i18n.t('tank.phBetween', {'min': species.species.parameters.ph.min, 'max': species.species.parameters.ph.max})}</Paragraph>
          </View>
      }
      { !parametersCompat.gh && 
          <View style={styles.rowContainer}>
            <View style={styles.compatIcon}>
              <MaterialCommunityIcons
                name="focus-field"
                color={theme.colors.secondary}
                size={25}
              />
            </View>
            <Paragraph style={styles.compatDescription}>
              {i18n.t('tank.ghBetween', {'min': unitConverter(species.species.parameters.gh.min, 'hardness', 'base', user.units.hardness), 'max': unitConverter(species.species.parameters.gh.max, 'hardness', 'base', user.units.hardness)})}
              {i18n.t('measures.' + user.units.hardness + 'Abbr')}
            </Paragraph>
          </View>
      }
      { !parametersCompat.kh && 
          <View style={styles.rowContainer}>
            <View style={styles.compatIcon}>
              <MaterialCommunityIcons
                name="focus-field-horizontal"
                color={theme.colors.secondary}
                size={25}
              />
            </View>
            <Paragraph style={styles.compatDescription}>
              {i18n.t('tank.khBetween', {'min': unitConverter(species.species.parameters.kh.min, 'hardness', 'base', user.units.hardness), 'max': unitConverter(species.species.parameters.kh.max, 'hardness', 'base', user.units.hardness)})}
              {i18n.t('measures.' + user.units.hardness + 'Abbr')}
            </Paragraph>
          </View>
      }
    </>
  }

  function speciesCompatibility() {

    function renderSpeciesCompat() {
      return Object.keys(speciesCompat).map(function(speciesId) {
        let species = tank.species.find(species => species.species._id == speciesId);

        if(speciesCompat[speciesId].compatibility != 2){
          return <View style={styles.rowContainer}>
            <GroupIcon
              name={species.species.group.icon}
              size={24}
              style={[styles.icons, styles.iconsComp]}
              color={theme.colors[speciesCompat[speciesId].compatibility ? 'secondary' : 'error']}
            />
            { speciesRow(species) }
          </View>
        }
      });
    }

    return <>
      <Paragraph style={styles.caption}>{i18n.t('tank.notCompatibleSpecies')}</Paragraph>
      { renderSpeciesCompat() }
    </>
  }

  function speciesRow(species) {
    return <TouchableOpacity
      style={styles.namesContainer}
      onPress={() => { navigation.navigate('Species', { screen: 'Species', params: { speciesId : species.species._id } }) } }
    >
      <Paragraph style={styles.name}>
        { species.species.name[locale] ? species.species.name[locale] : '' }
      </Paragraph>
      <Paragraph style={styles.scientificName} fontStyle="italic">
        { species.species.name[locale] ? species.species.name[locale] : '' }
      </Paragraph>
    </TouchableOpacity>
  }

  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  function changeLayout() { 
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCompExpanded({ expanded: !compExpanded.expanded });
  } 

  return (
    <>
      <TouchableOpacity style={styles.rowContainer}>
        <Paragraph style={styles.number} fontWeight="bold">{species.quantity} x</Paragraph>
        <GroupIcon name={species.species.group.icon} size={30} style={styles.icons} color={theme.colors.primary}/>
        { speciesRow(species) }
        { isComp &&
          compatibilityButton()
        }
      </TouchableOpacity>
      <View style={{ height: compExpanded.expanded ? null : 0, overflow: 'hidden', maringVertical: 15 }}>
        <View style={styles.compatibilityContainer}>
          { isComp && isComp.isParameterCompatible[species.species._id] === false &&
            parameterCompatibility()
          }
        </View>
        <View style={styles.compatibilityContainer}>
          { isComp && isComp.isSpeciesCompatible[species.species._id] === false &&
            speciesCompatibility()
          }
        </View>
        <Separator style={styles.separator}/>
      </View>
    </>
  );
}


const styles = StyleSheet.create({
  rowContainer: {
    flexDirection:'row',
    justifyContent: 'flex-start',
    marginVertical: 5,
    marginLeft: 10,
  },
  separator:{
    width: '30%',
    borderTopWidth: 0.5,
    alignSelf: 'flex-start',
    marginLeft: 25,
    marginBottom: 10,
  },
  number: {
    textAlign: 'left',
    width: 40,
    fontSize: 18,
    lineHeight: 24,
    color: theme.colors.placeholder,
  },
  namesContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  compatibilityButtons: {
    flexDirection:'row',
    marginLeft: 'auto',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 2,
  },
  scientificName: {
    color: theme.colors.lightText,
    lineHeight: 14,
  },
  icons: {
    width: 40,
  },
  iconsComp: {
    marginTop: 2,
  },
  compatibilityContainer:{
    marginLeft: 25,
    marginBottom: 10,
  },
  caption: {
    alignSelf: 'flex-start',
    color: theme.colors.lightText,
    fontSize: 10,
    lineHeight: 12,
    fontStyle: 'italic',
    marginLeft: 5,
  },
  compatIcon: {
    flex:1
  },
  compatDescription: {
    flex: 9,
    textAlign: 'left',
  },
});