// src/screens/client/tank/GraphicTankSpecies.js

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, View, Image, ScrollView} from 'react-native';
import { ToggleButton, Avatar, Title, Caption } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
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

  return (
    <Paragraph style={styles.depth}>{species.name[locale]}</Paragraph>
  );
}


const styles = StyleSheet.create({

});