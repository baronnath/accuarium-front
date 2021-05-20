// src/screens/client/tank/GraphicTank.js

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, View, Image, ScrollView} from 'react-native';
import { ToggleButton, Avatar, Title, Caption } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import GraphicTankSpecies from './GraphicTankSpecies';
import Paragraph from '../../../components/Paragraph';
import DottedSeparator from '../../../components/DottedSeparator';
import { handleAlert } from '../../../helpers/global';
import { findMainSpecies, splitSpeciesByDepth } from '../../../helpers/tank';
import { theme } from '../../../theme';

export default function GraphicTank({ species }) {

  const user = useSelector(state => state.user.data);
  const locale = user.locale;
  const dispatch = useDispatch();

  const [mainSpecies, setMainSpecies] = useState(null);
  const [speciesByDepth, setSpeciesByDepth] = useState({});

  useEffect(() => {
    setMainSpecies(findMainSpecies(species));
    setSpeciesByDepth(splitSpeciesByDepth(species));
  }, [species]);

  function speciesDepth(depth) {
    return speciesByDepth[depth].map(species => {
      return <GraphicTankSpecies species={species} />
    });
  }

  return (
    !!speciesByDepth &&
      <View style={styles.box}>
        <Svg height="18" width="100%">
          <Path x="3" y="0" width="100%" height="100" stroke={theme.colors.primary} strokeWidth="2" d="M 1 1.898 c 7.047 0 7.047 10.205 14.095 10.205 c 7.048 0 7.048 -10.205 14.095 -10.205 c 7.046 0 7.046 10.205 14.093 10.205 c 7.047 0 7.047 -10.205 14.095 -10.205 c 7.048 0 7.048 10.205 14.096 10.205 c 7.047 0 7.047 -10.205 14.093 -10.205 c 7.048 0 7.048 10.205 14.096 10.205 c 7.047 0 7.047 -10.205 14.095 -10.205 c 7.047 0 7.047 10.205 14.095 10.205 c 7.048 0 7.048 -10.205 14.097 -10.205 c 7.047 0 7.047 10.205 14.095 10.205 c 7.049 0 7.049 -10.205 14.098 -10.205 c 7.047 0 7.047 10.205 14.095 10.205 c 7.049 0 7.049 -10.205 14.098 -10.205 c 7.048 0 7.048 10.205 14.096 10.205 c 7.048 0 7.048 -10.205 14.097 -10.205 c 7.049 0 7.049 10.205 14.097 10.205 c 7.048 0 7.048 -10.205 14.096 -10.205 c 7.049 0 7.049 10.205 14.097 10.205 c 7.049 0 7.049 -10.205 14.099 -10.205 c 7.049 0 7.049 10.205 14.097 10.205 c 7.049 0 7.049 -10.205 14.097 -10.205 c 7.049 0 7.049 10.205 14.097 10.205 c 7.049 0 7.049 -10.205 14.098 -10.205 c 7.049 0 7.049 10.205 14.098 10.205 c 7.046 0 7.046 -10.205 14.093 -10.205 c 7.048 0 7.048 10.205 14.097 10.205 c 7.049 0 7.049 -10.205 14.099 -10.205 c 7.048 0 7.048 10.205 14.097 10.205 c 7.048 0 7.048 -10.205 14.097 -10.205 c 7.049 0 7.049 10.205 14.099 10.205 c 7.05 0 7.05 -10.205 14.101 -10.205 c 7.049 0 7.049 10.205 14.098 10.205 c 7.05 0 7.05 -10.205 14.1 -10.205 c 7.05 0 7.05 10.205 14.1 10.205 c 7.051 0 7.051 -10.205 14.102 -10.205 c 7.049 0 7.049 10.205 14.098 10.205 c 7.051 0 7.051 -10.205 14.103 -10.205 c 7.049 0 7.049 10.205 14.098 10.205 c 7.054 0 7.054 -10.205 14.108 -10.205 c 7.054 0 7.054 10.205 14.108 10.205"/>
        </Svg>
        <View style={styles.container}>
          <Paragraph style={styles.depth}>Surface</Paragraph>
          { 
            !!speciesByDepth['surface'] && !!speciesByDepth['surface'].length &&
              speciesDepth('surface')
          }
          <DottedSeparator />
          <Paragraph style={styles.depth}>Medium</Paragraph>
          { 
            !!speciesByDepth['medium'] && !!speciesByDepth['medium'].length &&
              speciesDepth('medium')
          }
          <DottedSeparator />
          <Paragraph style={styles.depth}>Bottom</Paragraph>
          { 
            !!speciesByDepth['bottom'] && !!speciesByDepth['bottom'].length &&
              speciesDepth('bottom')
          }
        </View>
      </View>
  );
}


const styles = StyleSheet.create({
  box: {
    flex: 1,
    width: '100%',
    borderColor: theme.colors.lightText,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderBottomLeftRadius: 5,
  },
  container: {
    paddingLeft: 5,
  },
  depth: {
    alignSelf: 'flex-start',
    color: theme.colors.lightText,
    fontSize: 10,
    lineHeight: 12,
    fontStyle: 'italic',
    marginLeft: 5,
  },
  separator: {
    borderWidth: 5,
    borderStyle:'dotted',
    borderRadius:5,
    borderColor: theme.colors.disabled,
  }
});