// src/screens/client/tank/Tank.js

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
import GraphicTank from './GraphicTank';
import Modal from '../../../components/Modal';
import Tag from '../../../components/Tag';
import Spinner from '../../../components/Spinner';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { actions as tankActions } from '../../../ducks/tank';
import { actions as alertActions } from '../../../ducks/alert';
import { handleAlert } from '../../../helpers/global';
import { findMainSpecies } from '../../../helpers/tank';
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
  const [speciesByDepth, setSpeciesByDepth] = useState({});
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
    if(tank.species){
      setMainSpecies(findMainSpecies(tank.species));
    }
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
                    <Paragraph style={styles.tankName} fontWeight="light" >{ucFirst(tank.name)}</Paragraph>
                    <Header style={styles.volume}>{tank.liters} L</Header>
                    {
                      !!mainSpecies &&
                        <View style={styles.rowContainer}>
                          <MaterialCommunityIcons style={{marginTop: 0}} name="star-circle" size={20} color={theme.colors.lightText}/>
                          <Paragraph style={styles.mainSpecies}>{mainSpecies.species.name[locale]}</Paragraph>
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
                    <Paragraph style={styles.values} fontWeight="bold">
                      25º
                    </Paragraph>
                    <Paragraph style={styles.values} fontWeight="bold">
                      6.5
                    </Paragraph>
                    <Paragraph style={styles.values} fontWeight="bold">
                      10
                    </Paragraph>
                  </View>
                </View>

                { tank.species &&
                  <GraphicTank species={tank.species} />
                }

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
  tankName: {
    color: theme.colors.lightText,
    marginBottom: 0,
    lineHeight: 30,
  },
  volume: {
    fontSize: 50,
    lineHeight: 38,
    paddingBottom: 0,
  },
  mainSpecies: {
    marginLeft: 5,
    marginVertical: 0,
    lineHeight: 20,
  },
  rowContainer: {
    flexDirection:'row',
    justifyContent: 'center',
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