// src/screens/dashboard/tank/Tank.js

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { axios }from '../../../helpers/axios';
import { backend } from '../../../../app.json';
import { StyleSheet, View, Image, ScrollView} from 'react-native';
import { ToggleButton, Avatar, Title, Caption } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Background from '../../../components/Background';
import Header from '../../../components/Header';
import MenuButton from '../../../components/MenuButton';
import Paragraph from '../../../components/Paragraph';
import SpeciesCard from '../../../components/SpeciesCard';
import Tag from '../../../components/Tag';
import Spinner from '../../../components/Spinner';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { actions as tankActions } from '../../../ducks/tank';
import { actions as alertActions } from '../../../ducks/alert';
import { handleAlert, findMainSpecies } from '../../../helpers/global';
import { ucFirst } from '../../../helpers/helpers';
import { theme } from '../../../theme';

export default function Tank({ route, navigation }) {
  const { tankId } = route.params;

  const user = useSelector(state => state.user.data);
  const locale = user.locale;
  const tank = useSelector(state => state.tanks.data);
  const isLoading = useSelector(state => state.tanks.isLoading);
  const dispatch = useDispatch();

  const [id, setId] = useState(false);
  const [mainSpecies, setMainSpecies] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      setId(tankId);
    }, [])
  );
   
  useEffect(() => {
    dispatch(tankActions.getTank(tankId))
  }, [tankId]);

  useEffect(() => {
    if(tank.species)
      setMainSpecies(findMainSpecies(tank.species));
  }, [tank]);



  return (
    <KeyboardAwareScrollView
      resetScrollToCoords={{x:0, y:0}}
    >
      <Background justify="top">
        { isLoading ?

            <Spinner/>
            :

            !!tank &&
              <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <Header></Header>
                <View style={styles.rowContainer}>
                  <MaterialCommunityIcons style={{flex:1}} name="fishbowl-outline" size={80} color={theme.colors.primary} />
                  <View style={styles.titleContainer}>
                    <Paragraph style={{color: theme.colors.lightText, marginBottom: 0}}>{ucFirst(tank.name)}</Paragraph>
                    <Paragraph style={{fontSize: 50, lineHeight: 50, fontWeight: 'bold', marginBottom: 0}}>{tank.liters} L</Paragraph>
                    {
                      !!mainSpecies &&
                        <View style={styles.rowContainer}>
                          <MaterialCommunityIcons style={{pmarginTop: 0}} name="star-circle" size={20} />
                          <Paragraph style={{marginLeft: 5, marginBottom: 0}}>{mainSpecies.species.name[locale]}</Paragraph>
                        </View>
                    }
                  </View>
                </View>
                <Header>
                  {tank.name}
                </Header>

              </ScrollView>
        }

      </Background>
    </KeyboardAwareScrollView>
  );
}


const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
  },
  scrollContainer: {
    flex: 1,
    width: '100%',
    flexDirection:'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    alignSelf: 'stretch',
  },
  rowContainer: {
    flexDirection:'row',
    alignItems: 'center',
  },
  image: {
    marginVertical: 10,
    width: '100%',
    height: 200,
  },
  tagContainer: {
    flex:1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    borderTopColor: theme.colors.lightText,
    borderTopWidth: 1,
    paddingTop: 8,
    width: '100%',
    justifyContent: 'center',

  },
  row: {
    flex: 1,
    marginVertical: 10,
    marginLeft: '50%',
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
  },
  titleContainer: {
    flex:3,
    alignItems:'flex-start',
  },
  listIcon: {
    marginRight: 8,
  },
  parameters: {
    position: 'absolute',
    left: 45,
  },
});