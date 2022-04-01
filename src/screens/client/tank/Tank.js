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
import unitConverter from '../../../helpers/unitConverter';
import { findMainSpecies } from '../../../helpers/tank';
import { ucFirst, isEmpty, round } from '../../../helpers/helpers';
import { theme } from '../../../theme';
import translator from '../../../translator/translator';

export default function Tank({ route, navigation }) {
  const { tankId } = route.params;

  const user = useSelector(state => state.user.data);
  const locale = user.locale;
  const i18n = translator(locale);
  const tank = useSelector(state => state.tanks.tank);
  const isLoading = useSelector(state => state.tanks.isLoading);
  const dispatch = useDispatch();

  const [id, setId] = useState(false);
  const [mainSpecies, setMainSpecies] = useState(null);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [tankParameters, setTankParameters] = useState({});
  const [freeSpace, setFreeSpace] = useState(100);
  const [cleanupCrew, setCleaningCrew] = useState(0);

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
      }

      // Convert to user unit measure
      try{
        if(tank.width)
          tank.width = unitConverter(tank.width, 'length', 'base', user.units.length);
        if(tank.height)
          tank.height = unitConverter(tank.height, 'length', 'base', user.units.length);
        if(tank.length)
          tank.length = unitConverter(tank.length, 'length', 'base', user.units.length);
        if(tank.liters)
          tank.liters = unitConverter(tank.liters, 'volume', 'base', user.units.volume);
      }catch(err){
        dispatch(alertActions.error(err.message));
        return;
      }

      if(tank.liters){
        calculateDetails();
      }

    }
    
  }, [tank]);

  useEffect(() => {
    if(mainSpecies){
      dispatch(tankActions.getCompatibility(tankId));

      // Set tank parameters from main species
      const temp = mainSpecies.species.parameters.temperature;
      const ph = mainSpecies.species.parameters.ph;
      const gh = mainSpecies.species.parameters.gh;
      const kh = mainSpecies.species.parameters.kh;
      const tankParams = {
        temperature: !!temp.min && !!temp.max ? unitConverter((temp.min + temp.max) / 2, 'temperature', 'base', user.units.temperature) : null,
        ph: !!ph.min && !!ph.max ? (ph.min + ph.max) / 2 : null,
        gh: !!gh.min && !!gh.max ? unitConverter((gh.min + gh.max) / 2, 'hardness', 'base', user.units.hardness) : null,
        kh: !!kh.min && !!kh.max ? unitConverter((kh.min + kh.max) / 2, 'hardness', 'base', user.units.hardness) : null,
      }
      setTankParameters(tankParams);
    }
  },[mainSpecies])

  function openMenu () { setMenuVisible(true); }
  function closeMenu () { setMenuVisible(false); }

  // Calculate free space and cleaning crew
  function calculateDetails() {
    let occupied = 0;
    let cleaning = 0;
     
    tank.species.forEach(species => {
      occupied += species.species.volumeSpecimen * species.quantity;
      if(species.species.cleaning)
        cleaning += species.species.volumeSpecimen * species.quantity;
    });

    let freeSpace = 100 - (occupied * 100 / tank.liters);
    setFreeSpace(round.round(freeSpace));

    let cleaningCrew = cleaning * 100 / tank.liters;
    setCleaningCrew(round.round(cleaningCrew));

    return;
  }

  const menuButton = <MaterialCommunityIcons size={24} name="dots-vertical" onPress={() => {openMenu()}} />;

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
                        setMenuVisible(false),
                        navigation.navigate('EditTank', { tankId : tank._id })
                      }}
                      title={i18n.t('general.edit')}
                    />
                    <Menu.Item
                      icon="delete-forever-outline"
                      onPress={ () => {
                        setMenuVisible(false),
                        setDeleteModalVisible(true)
                      }}
                      title={i18n.t('general.delete')}
                    />
                  </Menu>
                </OptionsMenu>
                <View style={styles.rowContainer}>
                  <MaterialCommunityIcons style={{flex:1}} name="fishbowl-outline" size={80} color={theme.colors.primary} />
                  <View style={styles.titleContainer}>
                    <Paragraph style={styles.tankName} fontWeight="light" >{ucFirst(tank.name)}</Paragraph>
                    {
                      tank.liters &&
                      <Header style={styles.volume}>{tank.liters} {i18n.t('measures.' + user.units.volume + 'Abbr')} </Header>
                    }
                    {
                      !!mainSpecies &&
                        <View style={styles.rowContainer}>
                          <MaterialCommunityIcons style={{marginTop: 0}} name="star-circle" size={20} />
                          <Paragraph style={styles.mainSpecies}>{mainSpecies.species.name[locale]}</Paragraph>
                        </View>
                    }
                  </View>
                </View>
                {
                  // No main species selected warning
                  !!tank.species.length && !mainSpecies &&
                    <Warning title={i18n.t('tank.warning.title')} subtitle={i18n.t('tank.warning.subtitle')}
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
                      setModalContent('tank.modalParameters');
                    }}
                  />

                  <View style={styles.rowContainer}>
                    <View style={styles.parameters}>
                      <FontAwesome5
                        name="temperature-high"
                        size={25}
                      />
                    </View>
                    <View style={[styles.rowContainer, styles.parameters]}>
                        <MaterialCommunityIcons style={{marginVertical: -10, marginTop: 1}}
                          name="alpha-p"
                          size={35}
                        />
                        <MaterialCommunityIcons style={{marginLeft:-25, marginVertical: -8}}
                          name="alpha-h"
                          size={40}
                        />
                    </View>
                    <View style={[styles.rowContainer, styles.parameters]}>
                      <MaterialCommunityIcons
                        name="focus-field"
                        size={26}
                      />
                    </View>
                    <View style={[styles.rowContainer, styles.parameters]}>
                      <MaterialCommunityIcons
                        name="focus-field-horizontal"
                        size={26}
                      />
                    </View>
                  </View>
                  <View style={styles.rowContainer}>
                    <Paragraph style={styles.values} fontWeight="bold">
                      { !isEmpty(tankParameters) && !!tankParameters.temperature &&
                          tankParameters.temperature + i18n.t('measures.' + user.units.temperature + 'Abbr')
                      }
                    </Paragraph>
                    <Paragraph style={styles.values} fontWeight="bold">
                      { !isEmpty(tankParameters) && !!tankParameters.ph &&
                          tankParameters.ph
                      }
                    </Paragraph>
                    <Paragraph style={styles.values} fontWeight="bold">
                      { !isEmpty(tankParameters) && !!tankParameters.gh &&
                          tankParameters.gh + ' ' + i18n.t('measures.' + user.units.hardness + 'Abbr')
                      }
                    </Paragraph>
                    <Paragraph style={styles.values} fontWeight="bold">
                    { !isEmpty(tankParameters) && !!tankParameters.kh &&
                          tankParameters.kh + ' ' + i18n.t('measures.' + user.units.hardness + 'Abbr')
                      }
                    </Paragraph>
                  </View>
                </View>

                { tank.species &&
                  <GraphicTank />
                }
                
                { tank.liters &&
                  <View style={[styles.rowContainer,styles.moreDetailsContainer]}>
                    <TouchableOpacity
                      style={[styles.rowContainer, styles.moreDetail]}
                      onPress={() => {
                        setModalVisible(true);
                        setModalContent('tank.modalFreeSpace');
                      }}
                    >
                      <MaterialCommunityIcons name="water-percent" size={22} color={ freeSpace > 0 ? theme.colors.primary : theme.colors.error }/>
                      <Paragraph>{ freeSpace }% {i18n.t('general.freeSpace')}</Paragraph>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.rowContainer, styles.moreDetail]}
                      onPress={() => {
                        setModalVisible(true);
                        setModalContent('tank.modalCleanupCrew');
                      }}
                    >
                      <MaterialCommunityIcons name="spray-bottle" size={20} color={ cleanupCrew >= 15 ? theme.colors.primary : theme.colors.warning }/>
                      <Paragraph>{ cleanupCrew }% {i18n.t('general.cleanupCrew')}</Paragraph>
                    </TouchableOpacity>
                  </View>
                }

              </ScrollView>
        }
       
      </Background>
      <Modal isVisible={isModalVisible} setVisible={setModalVisible}>
        <MaterialCommunityIcons name="information-outline" size={60} color={theme.colors.primary} />
        <Paragraph style={styles.modalParagraph}>{i18n.t(modalContent)}</Paragraph>
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
    fontSize: 14,
    // color: theme.colors.text,
    marginBottom: 0,
    lineHeight: 30,
  },
  volume: {
    fontSize: 48,
    lineHeight: 42,
    paddingBottom: 0,
    marginTop: 0,
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
    fontSize: 12
    ,
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
    // color: theme.colors.text,
  },
});
