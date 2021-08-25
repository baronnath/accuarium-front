// src/screens/client/tank/GraphicTankSpecies.js

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, View, TouchableOpacity} from 'react-native';
import { ToggleButton, Avatar } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import Paragraph from '../../../components/Paragraph';
import DottedSeparator from '../../../components/DottedSeparator';
import { handleAlert } from '../../../helpers/global';
import { isCompatible } from '../../../helpers/tank';
import { theme } from '../../../theme';

export default function GraphicTankSpecies({ species, parametersCompat, speciesCompat }) {

  const user = useSelector(state => state.user.data);
  const locale = user.locale;
  const tank = useSelector(state => state.tanks.data[0]);
  const navigation = useNavigation();

  const [isComp, setIsComp] = useState(null);

  useEffect(() => {
    setIsComp(isCompatible(tank.compatibility));
  }, [tank]);

  function compatibilityButton() {
    if(isComp.isParameterCompatible[species.species._id] === false || isComp.isSpeciesCompatible[species.species._id] === false){
      return <View style={styles.compatibilityButtons}>
        <MaterialCommunityIcons name="alert-circle-outline" size={30} style={styles.icons} color={theme.colors.secondary}/>
        <MaterialCommunityIcons name="chevron-down" size={24} style={styles.icons} color={theme.colors.placeholder}/>
      </View>
    }
  }

  function parameterCompatibility() {
    return <>
      <Paragraph style={styles.caption}>Parameters</Paragraph>
      { !parametersCompat.temperature && 
        <View style={styles.rowContainer}>
          <MaterialCommunityIcons
            name="thermometer"
            color={theme.colors.secondary}
            size={23}
          />
          <Paragraph style={styles.compatDescription}>
            Temperature is {species.species.parameters.temperature.min} - {species.species.parameters.temperature.max}º
          </Paragraph>
        </View>
      }
      { !parametersCompat.ph && 
          <View style={styles.rowContainer}>
            <MaterialCommunityIcons style={{marginTop: 1}}
              name="alpha-p"
              color={theme.colors.secondary}
              size={25}
            />
            <MaterialCommunityIcons style={{marginLeft:-20 ,marginVertical: -8}}
              name="alpha-h"
              color={theme.colors.secondary}
              size={32}
            />
            <Paragraph style={styles.compatDescription}>pH is {species.species.parameters.ph.min} - {species.species.parameters.ph.max}</Paragraph>
          </View>
      }
      { !parametersCompat.ph && 
          <View style={styles.rowContainer}>
            <MaterialCommunityIcons
              name="grain"
              color={theme.colors.secondary}
              size={25}
            />
            <Paragraph style={styles.compatDescription}>Hardness is {species.species.parameters.dh.min} - {species.species.parameters.dh.max}</Paragraph>
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
            <MaterialCommunityIcons
              name="fish"
              size={24}
              style={styles.icons}
              color={theme.colors[speciesCompat[speciesId].compatibility ? 'secondary' : 'error']}
            />
            { speciesRow(species) }
          </View>
        }
      });
    }

    return <>
      <Paragraph style={styles.caption}>Species</Paragraph>
      { renderSpeciesCompat() }
    </>
  }

  function speciesRow(species) {
    return <View
      style={styles.namesContainer}
      onPress={() => navigation.navigate('Species', { speciesId : species.species._id }) }
    >
      <Paragraph style={styles.name}>
        { species.species.name[locale] ? species.species.name[locale] : '' }
      </Paragraph>
      <Paragraph style={styles.scientificName} fontStyle="italic">
        { species.species.name[locale] ? species.species.name[locale] : '' }
      </Paragraph>
    </View>
  }

  return (
    <>
      <TouchableOpacity style={styles.rowContainer}>
        <Paragraph style={styles.number} fontWeight="bold">{species.quantity} x</Paragraph>
        <MaterialCommunityIcons name="fish" size={24} style={styles.icons} color={theme.colors.primary}/>
        { speciesRow(species) }
        { isComp &&
          compatibilityButton()
        }
      </TouchableOpacity>
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
    marginTop: 2,
  },
  compatibilityContainer:{
    marginLeft: 25,
    marginBottom: 20,
  },
  caption: {
    alignSelf: 'flex-start',
    color: theme.colors.lightText,
    fontSize: 10,
    lineHeight: 12,
    fontStyle: 'italic',
    marginLeft: 5,
  },
  compatDescription: {
    position: 'absolute',
    left: 35,
  },
});