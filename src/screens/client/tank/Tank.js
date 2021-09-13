// src/screens/client/tank/Tank.js

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { axios }from '../../../helpers/axios';
import { backend } from '../../../../app.json';
import { StyleSheet, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Menu } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import TankDeleteModal from './TankDeleteModal';
import Background from '../../../components/Background';
import Header from '../../../components/Header';
import OptionsMenu from '../../../components/OptionsMenu';
import Paragraph from '../../../components/Paragraph';
import Warning from '../../../components/Warning';
import GraphicTank from './GraphicTank';
import Modal from '../../../components/Modal';
import Spinner from '../../../components/Spinner';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { actions as tankActions } from '../../../ducks/tank';
import { actions as alertActions } from '../../../ducks/alert';
import { handleAlert } from '../../../helpers/global';
import { findMainSpecies } from '../../../helpers/tank';
import { ucFirst, isEmpty, round } from '../../../helpers/helpers';
import { theme } from '../../../theme';

export default function Tank({ route, navigation }) {
  const { tankId } = route.params;

  const user = useSelector(state => state.user.data);
  const locale = user.locale;
  const tank = useSelector(state => state.tanks.tank);
  const isLoading = useSelector(state => state.tanks.isLoading);
  const dispatch = useDispatch();

  const [id, setId] = useState(false);
  const [mainSpecies, setMainSpecies] = useState(null);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalIndex, setModalIndex] = useState(null);
  const [freeSpace, setFreeSpace] = useState(100);
  const [cleanupCrew, setCleaningCrew] = useState(0);

  const modalContent = {
    parameters: <Paragraph style={styles.modalParagraph}>The optimal parameters are based on the tank main species. Make sure the rest of living species parameters are as close as possible to these numbers.</Paragraph>,
    freeSpace: <Paragraph style={styles.modalParagraph}>Each fish requires some liters for itself. An overcrowded aquarium can cause many issues.</Paragraph>,
    cleanupCrew: <Paragraph style={styles.modalParagraph}>This percent is a vague guide based in the tank volume. The cleanup crew should be at least the 15% of the livestock in your tank.</Paragraph>,
  }

  useFocusEffect(
    React.useCallback(() => {
      setId(tankId);
    }, [])
  );

  useEffect(() => {
    dispatch(tankActions.getTank(tankId));
  }, [tankId]);

  useEffect(() => {

    if(!isEmpty(tank)){

      if(tank.species){
        setMainSpecies(findMainSpecies(tank.species));
        if(mainSpecies){
          dispatch(tankActions.getCompatibility(tankId));
        }
      }

      if(tank.liters){
        calculateDetails();
      }

    }
    
  }, [tank]);

  function openMenu () { setMenuVisible(true); }
  function closeMenu () { setMenuVisible(false); }

  // Calculate free space and cleaning crew
  function calculateDetails() {
    let occupied = 0;
    let cleaning = 0;
     
    tank.species.forEach(species => {
      occupied += species.species.litersSpecimen * species.quantity;
      if(species.species.cleaning)
        cleaning += species.species.litersSpecimen * species.quantity;
    });

    let freeSpace = 100 - (occupied * 100 / tank.liters);
    setFreeSpace(round.round(freeSpace, 2));

    let cleaningCrew = cleaning * 100 / tank.liters;
    setCleaningCrew(round.round(cleaningCrew, 2));

    return;
  }

  const menuButton = <MaterialCommunityIcons size={24} color={theme.colors.lightText} name="dots-vertical" onPress={() => {openMenu()}} />;

  return (
    <KeyboardAwareScrollView
      resetScrollToCoords={{x:0, y:0}}
    >
      <Background justify="top">
        { isLoading ?

            <Spinner/>
            :

            !isEmpty(tank) &&
              <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <Header></Header>
                <OptionsMenu>
                  <Menu
                    visible={isMenuVisible}
                    onDismiss={closeMenu}
                    anchor={menuButton}>
                    <Menu.Item
                      icon="square-edit-outline"
                      onPress={ () => {
                        navigation.navigate('EditTank', { tankId : tank._id })
                      }}
                      title="Edit"
                    />
                    <Menu.Item
                      icon="delete-forever-outline"
                      onPress={ () => {
                        setMenuVisible(false),
                        setDeleteModalVisible(true)
                      }}
                      title="Remove"
                    />
                  </Menu>
                </OptionsMenu>
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
                {
                  // No main species selected warning
                  !!tank.species.length && !mainSpecies &&
                    <Warning title="Warning" subtitle="Please select the main species"
                      left={() => <MaterialCommunityIcons name="alert-circle-outline" size={40} color={theme.colors.background} /> }
                      onPress={() => navigation.navigate('EditTank', { tankId : tank._id }) }
                    />
                }     
                <View style={styles.box}>
                  <MaterialCommunityIcons style={styles.infoIcon}
                    name="information-outline"
                    size={20}
                    color={theme.colors.lightText}
                    onPress={() => {
                      setModalVisible(true);
                      setModalIndex('parameters');
                    }}
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
                      { !!mainSpecies &&
                          (mainSpecies.species.parameters.temperature.min + mainSpecies.species.parameters.temperature.max) / 2
                      }
                    </Paragraph>
                    <Paragraph style={styles.values} fontWeight="bold">
                      { !!mainSpecies &&
                          (mainSpecies.species.parameters.ph.min + mainSpecies.species.parameters.ph.max) / 2
                      }
                    </Paragraph>
                    <Paragraph style={styles.values} fontWeight="bold">
                      { !!mainSpecies &&
                          mainSpecies.species.parameters.dh.min // TO BE FIXED
                      }
                    </Paragraph>
                  </View>
                </View>

                { tank.species &&
                  <GraphicTank />
                }

                <View style={[styles.rowContainer,styles.moreDetailsContainer]}>
                  <TouchableOpacity
                    style={[styles.rowContainer, styles.moreDetail]}
                    onPress={() => {
                      setModalVisible(true);
                      setModalIndex('freeSpace');
                    }}
                  >
                    <MaterialCommunityIcons name="water-percent" size={30} color={theme.colors.primary}/>
                    <Paragraph>{ freeSpace }% free space</Paragraph>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.rowContainer, styles.moreDetail]}
                    onPress={() => {
                      setModalVisible(true);
                      setModalIndex('cleanupCrew');
                    }}
                  >
                    <MaterialCommunityIcons name="spray-bottle" size={27} color={ cleanupCrew >= 15 ? theme.colors.primary : theme.colors.secondary }/>
                    <Paragraph>{ cleanupCrew }% cleanup crew</Paragraph>
                  </TouchableOpacity>
                </View>

              </ScrollView>
        }
       
      </Background>
      <Modal isVisible={isModalVisible} setVisible={setModalVisible}>
        <MaterialCommunityIcons name="information-outline" size={60} color={theme.colors.primary} />
        { modalContent[modalIndex] }
      </Modal>
      <TankDeleteModal tankId={tankId} isVisible={isDeleteModalVisible} setVisible={setDeleteModalVisible} />
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
    paddingBottom: 30,
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
  moreDetailsContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
  },
  moreDetail: {
    alignItems:'center',
  },  
  modalTitle: {
    fontSize: 30,
    lineHeight: 30,
  },
  modalParagraph: {
    // color: theme.colors.lightText,
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
