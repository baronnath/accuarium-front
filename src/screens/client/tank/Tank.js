// src/screens/dashboard/tank/Tank.js

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { axios }from '../../../helpers/axios';
import { backend } from '../../../../app.json';
import { StyleSheet, View, Image, ScrollView} from 'react-native';
import { ToggleButton, Avatar, Title, Caption } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Background from '../../../components/Background';
import Header from '../../../components/Header';
import MenuButton from '../../../components/MenuButton';
import Paragraph from '../../../components/Paragraph';
import SpeciesCard from '../../../components/SpeciesCard';
import Modal from '../../../components/Modal';
import Tag from '../../../components/Tag';
import Spinner from '../../../components/Spinner';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import Svg, { Circle, Rect, Path } from 'react-native-svg';
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
  const [isModalVisible, setModalVisible] = useState(false);

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
                          <MaterialCommunityIcons style={{pmarginTop: 0}} name="star-circle" size={20} color={theme.colors.lightText}/>
                          <Paragraph style={{marginLeft: 5, marginBottom: 0}}>{mainSpecies.species.name[locale]}</Paragraph>
                        </View>
                    }
                  </View>
                </View>
                <View style={styles.box}>
                  <MaterialCommunityIcons style={styles.infoIcon}
                    name="information-outline"
                    size={20}
                    color={theme.colors.lightText}
                    onPress={() => {setModalVisible(true)}}
                  />

                  <View style={styles.rowContainer}>
                    <View style={styles.parameters}>
                      <FontAwesome5
                        name="temperature-high" 
                        color={theme.colors.lightText}
                        size={25}
                      />
                    </View>
                    <View style={[styles.rowContainer, styles.parameters]}>
                        <MaterialCommunityIcons style={{marginVertical: -10, marginTop: 1}}
                          name="alpha-p" 
                          color={theme.colors.lightText}
                          size={35}
                        />
                        <MaterialCommunityIcons style={{marginLeft:-25 ,marginVertical: -8}}
                          name="alpha-h" 
                          color={theme.colors.lightText}
                          size={40}
                        />
                    </View>
                    <View style={[styles.rowContainer, styles.parameters]}>
                        <MaterialCommunityIcons style={{transform: [{rotateX: '180deg'}, {rotateY: '180deg'}]}}
                          name="alpha-p" 
                          color={theme.colors.lightText}
                          size={35}
                        />
                        <MaterialCommunityIcons style={{marginLeft: -25}}
                          name="alpha-h" 
                          color={theme.colors.lightText}
                          size={40}
                        />
                    </View>
                  </View>
                  <View style={styles.rowContainer}>
                    <Paragraph style={styles.values}>
                      25º
                    </Paragraph>
                    <Paragraph style={styles.values}>
                      6.5
                    </Paragraph>
                    <Paragraph style={styles.values}>
                      10
                    </Paragraph>
                  </View>
                </View>

                <View style={styles.speciesContainer}>
                  <Svg height="18" width="100%">
                    <Path x="3" y="0" width="100%" height="100" stroke={theme.colors.lightText} strokeWidth="2" d="M 1 1.898 c 7.047 0 7.047 10.205 14.095 10.205 c 7.048 0 7.048 -10.205 14.095 -10.205 c 7.046 0 7.046 10.205 14.093 10.205 c 7.047 0 7.047 -10.205 14.095 -10.205 c 7.048 0 7.048 10.205 14.096 10.205 c 7.047 0 7.047 -10.205 14.093 -10.205 c 7.048 0 7.048 10.205 14.096 10.205 c 7.047 0 7.047 -10.205 14.095 -10.205 c 7.047 0 7.047 10.205 14.095 10.205 c 7.048 0 7.048 -10.205 14.097 -10.205 c 7.047 0 7.047 10.205 14.095 10.205 c 7.049 0 7.049 -10.205 14.098 -10.205 c 7.047 0 7.047 10.205 14.095 10.205 c 7.049 0 7.049 -10.205 14.098 -10.205 c 7.048 0 7.048 10.205 14.096 10.205 c 7.048 0 7.048 -10.205 14.097 -10.205 c 7.049 0 7.049 10.205 14.097 10.205 c 7.048 0 7.048 -10.205 14.096 -10.205 c 7.049 0 7.049 10.205 14.097 10.205 c 7.049 0 7.049 -10.205 14.099 -10.205 c 7.049 0 7.049 10.205 14.097 10.205 c 7.049 0 7.049 -10.205 14.097 -10.205 c 7.049 0 7.049 10.205 14.097 10.205 c 7.049 0 7.049 -10.205 14.098 -10.205 c 7.049 0 7.049 10.205 14.098 10.205 c 7.046 0 7.046 -10.205 14.093 -10.205 c 7.048 0 7.048 10.205 14.097 10.205 c 7.049 0 7.049 -10.205 14.099 -10.205 c 7.048 0 7.048 10.205 14.097 10.205 c 7.048 0 7.048 -10.205 14.097 -10.205 c 7.049 0 7.049 10.205 14.099 10.205 c 7.05 0 7.05 -10.205 14.101 -10.205 c 7.049 0 7.049 10.205 14.098 10.205 c 7.05 0 7.05 -10.205 14.1 -10.205 c 7.05 0 7.05 10.205 14.1 10.205 c 7.051 0 7.051 -10.205 14.102 -10.205 c 7.049 0 7.049 10.205 14.098 10.205 c 7.051 0 7.051 -10.205 14.103 -10.205 c 7.049 0 7.049 10.205 14.098 10.205 c 7.054 0 7.054 -10.205 14.108 -10.205 c 7.054 0 7.054 10.205 14.108 10.205"/>
                  </Svg>
                  {/* Split species array by depth and display */}
                </View>

              </ScrollView>
        }

      </Background>
      <Modal isVisible={isModalVisible} setVisible={setModalVisible}>
        <MaterialCommunityIcons name="information-outline" size={60} color={theme.colors.primary} />
        <Paragraph style={styles.modalParagraph}>The optimal parameters are based on the main tank species. Make sure the rest of living species parameters are as close as possible to these numbers.</Paragraph>
      </Modal>
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
  },
  box: {
    flex:1,
    position: 'relative',
    width: '80%',
    marginVertical: 40,
    padding: 15,
    paddingTop: 30,
    borderColor: theme.colors.disabled,
    borderWidth: 1,
    borderRadius: 5,
  },
  parameters: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  values: {
    flex:1,
    fontWeight: 'bold',
    fontSize: 20,
  },
  infoIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  image: {
    marginVertical: 10,
    width: '100%',
    height: 200,
  },
  titleContainer: {
    flex:3,
    alignItems:'flex-start',
  },
  modalTitle: {
    fontSize: 30,
    lineHeight: 30,
  },
  modalParagraph: {
    color: theme.colors.lightText,
  },
  speciesContainer: {
    flex: 1,
    width: '100%',
    borderColor: theme.colors.lightText,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderBottomLeftRadius: 5,
  },
});