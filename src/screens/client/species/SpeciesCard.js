// src/screens/species/SpeciesCard.js

import React, { useState, useEffect, memo } from 'react';
import { StyleSheet, Image, View, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, List } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { backend } from '../../../../app.json';
import AddSpeciesTankModal from './AddSpeciesTankModal';
import AddSpeciesQuantityModal from './AddSpeciesQuantityModal';
import Paragraph from '../../../components/Paragraph';
import Button from '../../../components/Button';
import Modal from '../../../components/Modal';
import Toggler from '../../../components/Toggler';
import SpeciesImage from '../../../components/SpeciesImage';
import { ucFirst } from '../../../helpers/helpers';
import { getSpeciesImageUri } from '../../../helpers/tank';
import { theme } from '../../../theme';
import { handleAlert } from '../../../helpers/global';
import translator from '../../../translator/translator';
import { actions as tankActions } from '../../../ducks/tank';
import { actions as alertActions } from '../../../ducks/alert';


const SpeciesCard = ({ species, grid, main = null, setMain, ...props }) => {
  const user = useSelector(state => state.user.data);
  const tanks = useSelector(state => state.tanks.tanks);
  const locale = user.locale;  
  const i18n = translator(locale);
  const navigation = useNavigation();
  const dispatch = useDispatch();


  const [tankId, setTankId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isTankModalVisible, setTankModalVisible] = useState(false);
  const [isQuantityModalVisible, setQuantityModalVisible] = useState(false);
  const [isFullCompatibility, setFullCompatibility] = useState(null);

  useEffect(()=>{
    defaultTank();
  },[]);

  useEffect(()=>{
    defaultTank();
  },[main]);

  function defaultTank() {
    let id = null;
    if(main)
      id = main;
    else if(tanks.length == 1)
      id = tanks[0]._id;

    setTankId(id);

    checkFullCompatibility();
  }

  function checkAnyTankExists() {
    if (!tanks.length)
      dispatch(alertActions.error('tank.noTank'));
    return !!tanks.length;
  }
  
  function addSpeciesToTank() {
    const params = {
      tankId: main ? main : tankId,
      species: [{ 
        species: species._id,
        quantity: quantity,
        main: !!main,
      }]
    };
    dispatch(tankActions.addSpecies(params));
    setTankModalVisible(false);
    setQuantityModalVisible(false);
    setQuantity(1);
    setTankId(null);
    if(main) setMain(null); // Only first species added is main species, deactivate for next species
  }

  function checkFullCompatibility() {
    if(species.compatibility) {
      setFullCompatibility(true);
      species.compatibility.map((comp) => {
        if(comp.compatibility != 2)
          setFullCompatibility(false);
      });
    }
  }

  if(!species.images)
    species.images = [null];

  const styles = StyleSheet.create({
    gridCard: {
      flex: 1,
      justifyContent: 'flex-start',
      marginBottom: theme.container.padding * 6,
    },
    gridActions: {
      flex: 1,
      flexDirection: 'row',
    },
    rightStyle: {
      paddingRight: 15,
    },
    gridImageContainer: {
      flexDirection: 'row',
    },
    gridImage: {
      resizeMode: 'contain',
      flex: 1,
      aspectRatio: 1.75,
      borderRadius: theme.roundness,
    },
    listCard: {
      flex: 1,
      justifyContent: 'flex-start',
      marginBottom: theme.container.padding / 2,
      flexDirection: 'row',
    },
    listImageContainer: {
      justifyContent: 'center'
    },
    listImage: {
      width: '80%',
      height: 70,
      borderRadius: theme.roundness,
      resizeMode: 'contain',
    },
    modalTitle: {
      fontSize: 30,
      lineHeight: 32,
      marginVertical: 15,
      marginBottom: 0,
    },
    modalParagraph: {
      marginTop: 0,
      color: theme.colors.lightText,
    },
    listContainer: {
      width: '100%',
      maxHeight: '70%',
    },
    quantityContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    quantity:{
      fontSize: 80,
      lineHeight: 90,
      fontWeight: 'bold',
      marginBottom: 0,
      marginHorizontal: 15,
    },
    quantityModifier: {
      width: 50,
      color: theme.colors.primary,
    },
    disabled: {
      color: theme.colors.disabled,
    },
    submitButton: {
      backgroundColor: theme.colors.accent,
    },
    compatText: {
      textAlign:'left'
    },
    compat: {
      color: theme.colors.primary,
    },
    notCompat: {
      color: theme.colors.warning,
    }
  });

  return( 
    <>
      {
        grid ?
          <TouchableOpacity
            style={styles.gridCard}
            theme={theme}
            onPress={() => navigation.navigate('Species', { speciesId : species._id }) }
            key={species._id}
          >
            { species.images && species.images.length &&
              <View style={styles.gridImageContainer}>
                <SpeciesImage
                  img={species.images[0]}
                  scientificName={species.scientificName}
                  style={styles.gridImage}
                  description={false}
                />
              </View>
            }

            <View style={styles.gridActions}>

              <View style={{flex:5}}>
                {/* Species name and other names */}
                <Toggler
                  title={ucFirst(species.name[locale])}
                  description={i18n.t('species.otherNames')}
                  list={species.otherNames[locale]}
                  size="big"
                  titleStyle={{color: theme.colors.text}}
                  listStyle={{textAlign: 'left'}}
                />
                {/* Species scientific name and synonyms */}
                <Toggler
                  title={species.scientificName}
                  description={i18n.t('species.scientificNameSynonyms')}
                  list={species.scientificNameSynonyms}
                  size="small"
                  titleStyle={{marginBottom: 2}}
                  listStyle={{textAlign: 'left'}}
                />
                { isFullCompatibility != null &&
                  <Paragraph
                    style={[styles.compatText, isFullCompatibility ? styles.compat : styles.notCompat]}
                  >
                    { i18n.t(isFullCompatibility ? 'species.fullCompatibility' : 'species.notFullCompatibility') }
                  </Paragraph>
                } 
              </View>

              <View style={{flex: 2, justifyContent: 'center'}}>
                <Button
                  onPress={() => {
                    if(!checkAnyTankExists()) return;
                    tankId != null ? setQuantityModalVisible(true) : setTankModalVisible(true);
                  }}
                  mode="text"
                >
                  <MaterialCommunityIcons
                    name="tray-plus"
                    size={30}
                    color={isFullCompatibility === false ? theme.colors.warning : theme.colors.accent}
                  />
                </Button>
              </View>

            </View>

          </TouchableOpacity>
        :
          <TouchableOpacity
            style={styles.listCard}
            theme={theme}
            onPress={() => navigation.navigate('Species', { speciesId : species._id }) }
            key={species._id}
          >
            <View style={[styles.listImageContainer,{flex:3}]}>
              { species.images && species.images.length &&
                <SpeciesImage
                  img={species.images[0]}
                  scientificName={species.scientificName}
                  style={styles.listImage}
                  description={false}
                />
              }
            </View>
            <View style={{flex:6}}>
              {/* Species name and other names */}
              <Toggler
                title={species.name[locale]}
                description={i18n.t('species.otherNames')}
                list={species.otherNames[locale]}
                size="big"
                titleStyle={{color: theme.colors.text}}
                listStyle={{textAlign: 'left'}}
              />
              {/* Species scientific name and synonyms */}
              <Toggler
                title={species.scientificName}
                description={i18n.t('species.scientificNameSynonyms')}
                list={species.scientificNameSynonyms}
                size="small"
                titleStyle={{textTransform: 'capitalize', marginBottom: 2}}
                listStyle={{textAlign: 'left'}}
              />
              { isFullCompatibility != null &&
                <Paragraph
                  style={[styles.compatText, isFullCompatibility ? styles.compat : styles.notCompat]}
                >
                  { i18n.t(isFullCompatibility ? 'species.fullCompatibility' : 'species.notFullCompatibility') }
                </Paragraph> 
              }
            </View>

            <View style={{flex: 2, justifyContent: 'center'}}>
              <Button
                onPress={() => {
                  if(!checkAnyTankExists()) return;
                  tankId != null ? setQuantityModalVisible(true) : setTankModalVisible(true)
                }}
                mode="text"
                compact={ true }
              >
                <MaterialCommunityIcons
                  name="tray-plus"
                  size={30}
                  color={isFullCompatibility === false ? theme.colors.warning : theme.colors.accent}
                />
              </Button>
            </View>
          </TouchableOpacity>
      }
      {
        !!tanks.length &&
        <>
          <AddSpeciesTankModal 
            isVisible={isTankModalVisible}
            setVisible={setTankModalVisible}
            setQuantityModalVisible={setQuantityModalVisible}
            setTankId={setTankId}
          />
          <AddSpeciesQuantityModal
            isVisible={isQuantityModalVisible}
            setVisible={setQuantityModalVisible}
            setQuantity={setQuantity}
            quantity={quantity}
            submit={addSpeciesToTank}
          />
        </>
      }
    </>
  )
};

export default memo(SpeciesCard);