// src/screens/client/tank/GraphicTankSpecies.js

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, View, TouchableOpacity} from 'react-native';
import { ToggleButton, Avatar } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import Paragraph from '../../../components/Paragraph';
import DottedSeparator from '../../../components/DottedSeparator';
import { handleAlert } from '../../../helpers/global';
import { findMainSpecies, splitSpeciesByDepth } from '../../../helpers/tank';
import { theme } from '../../../theme';

export default function GraphicTankSpecies({ species }) {

  const user = useSelector(state => state.user.data);
  const locale = user.locale;
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.rowContainer}
      onPress={() => navigation.navigate('Species', { speciesId : species.species._id }) }
    >
      <Paragraph style={styles.number} fontWeight="bold">{species.quantity} x</Paragraph>
      <MaterialCommunityIcons name="fish" size={24} style={styles.icons} color={theme.colors.primary}/>
      <View style={styles.namesContainer}>
        <Paragraph style={styles.name}>{
          species.species.name[locale] ? species.species.name[locale] : ''
        }</Paragraph>
        <Paragraph style={styles.scientificName} fontStyle="italic">{
          species.species.name[locale] ? species.species.name[locale] : ''
        }</Paragraph>
      </View>
    </TouchableOpacity>
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
  }
});