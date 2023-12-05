// src/screens/client/tank/EditTank.js

import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { ucFirst, isObject, clone } from '../../../helpers/helpers';
import { backend } from '../../../../app.json';
import {
  StyleSheet, View, ScrollView, Platform, Image, Picker, FlatList, Item, Text, TouchableHighlight, TouchableOpacity
} from 'react-native';
import { ToggleButton, Checkbox, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import EditSpeciesCard from '../species/EditSpeciesCard';
import Background from '../../../components/Background';
import Header from '../../../components/Header';
import Subheader from '../../../components/Subheader';
import TextInput from '../../../components/TextInput';
import Button from '../../../components/Button';
import Paragraph from '../../../components/Paragraph';
import Spinner from '../../../components/Spinner';
import Warning from '../../../components/Warning';
import { actions as tankActions } from '../../../ducks/tank';
import { actions as alertActions } from '../../../ducks/alert';
import { Api }from '../../../helpers/axios';
import helpers from '../../../helpers/helpers';
import unitConverter from '../../../helpers/unitConverter';
import { handleAlert } from '../../../helpers/global';
import { findMainSpecies, calculateVolume, pickImage } from '../../../helpers/tank';
import { theme } from '../../../theme';
import * as ImagePicker from 'expo-image-picker';
import validator from '../../../validators/tank';
import translator from '../../../translator/translator';

export default function EditTank({ route, navigation }) {
  const { tankId } = route.params;

  const dispatch = useDispatch();
  const user = useSelector(state => state.user.data);
  const locale = user.locale;
  const i18n = translator(locale);
  const [tank, setTank] = useState({});
  const [editedTank, setEditedTank] = useState({});
  const [image, setImage] = useState({});
  const [errors, setErrors] = useState({});
  const isLoading = useSelector(state => state.tanks.isLoading);

  const [id, setId] = useState(false);
  const [mainSpecies, setMainSpecies] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      setId(tankId);
    }, [])
  );

  useEffect(() => {
    Api.getTank(tankId)
      .then(
          res => { 
            setTank(res.data.tanks);
          }
      ).catch(
          err => {
            handleAlert(err);
          }
      );
    
  }, [tankId]);

  useEffect(() => {
    // // Only after tank state is updated, avoid first load loop
    // if(isInitialMount.current){
    //   isInitialMount.current = false;
    // }
    // else {
      if(!helpers.isEmpty(tank)){
        setEditedTank(helpers.clone(tank));
        setMainSpecies(findMainSpecies(tank.species));
        setImage({ uri:`${backend.imagesUrl}tank/${tank._id}.jpeg` });
      }
    // }
  }, [tank]);

  // Restrict access to non owner users
  useEffect(() => {
    if(!helpers.isEmpty(tank) && tank.user._id != user._id) {
      navigation.navigate('TankNav', { screen: 'Tanks' });
      dispatch(alertActions.error('tank.notOwner'));
    }
  }, [tank, user]);

  useEffect(() => {
    if(!helpers.isEmpty(editedTank)){
      setMainSpecies(findMainSpecies(editedTank.species));
    }
  }, [editedTank]);

  useEffect(() => {
    // Automatic volume calculation if measures are filled
    if(editedTank.measures && areMeasuresChanged())
      if(editedTank.measures.height && editedTank.measures.width && editedTank.measures.length)
        calculateTankVolume();
  }, [editedTank.measures]);

  function areMeasuresChanged() {
    return editedTank.measures.height != tank.measures.height || editedTank.measures.width != tank.measures.width || editedTank.measures.length != tank.measures.length;
  }

  async function handleChange(field, value) {
    setEditedTank(prevTank => ({
      ...prevTank,
      [field]: value
    }));

    if(field == 'image'){
      setImage(value);
    }
  }

  async function handleMeasure(field, value) {
    value = unitConverter(value, 'length', user.units.length);
    setEditedTank(prevTank => ({
      ...prevTank,
      measures: {
        ...prevTank.measures,
        [field]: value
      }
    }));
  }

  function calculateTankVolume() {
    const dimensions = {
      width: editedTank.measures.width,
      height: editedTank.measures.height,
      length: editedTank.measures.length,
    }
    calculateVolume(dimensions, user.units.length)
      .then((liters) => {
        handleChange('liters', liters);
        dispatch(alertActions.success('tank.litersSuccess', { 'liters': unitConverter(liters, 'volume', 'base', user.units['volume']) }));
      })
      .catch((err) => {
        dispatch(alertActions.error(err));
      });
  }

  function handleSpecies(id, action) {
    const index = editedTank.species.findIndex((species) => species.species._id == id);
    let species = [...editedTank.species];
    let sp = {};

    if(action == 'add'){
      sp = {
        ...species[index],
        quantity: ++species[index].quantity
      }
    }

    if(action == 'remove'){
      if (species[index].quantity <= 1)
        return;
      sp = {
        ...species[index],
        quantity: --species[index].quantity
      }
    }

    if(action == 'main'){
      const main = !species[index].main;

      // clear the main from previous species
      species.forEach((sp,index) => {
        species[index].main = false;
      });

      sp = {
        ...species[index],
        main: main,
      }
    }

    species[index] = sp;

    setEditedTank(prevTank => ({
      ...prevTank,
      species: species
    }));
  }

  function removeSpecies(id) {
    let species = [...editedTank.species];
    let sp = species.find((sp, index) => {
      if(sp.species._id == id){
        species.splice(index, 1);
        setEditedTank(prevTank => ({
          ...prevTank,
          species: species
        }));
        return true;
      }
    });
  }

  function onSubmit(){
    let tankData = helpers.clone(editedTank); 

    // remove species object, only id is required  
    if(!!tankData.species.length){
      tankData.species.forEach((sp,index) => {
        tankData.species[index].species = sp.species._id;
      });
    }

    setErrors({});
    // Adapt to validation data (as AddTank format)
    tankData.width = tankData.measures.width;
    tankData.height = tankData.measures.height;
    tankData.length = tankData.measures.length;
    const validation = validator(tankData);
    // console.log(validation, errors);

    if (validation !== false) {
      setErrors({
        name: validation.name,
        width: validation.width,
        height: validation.height,
        length: validation.length,
        liters: validation.liters,
      });

      dispatch(alertActions.error('tank.data.invalid'));

      return;
    }

    dispatch(tankActions.updateTank(tankData));
  }

  return (
    <Background justify="top" style={styles.background}>
      <Header>
      {i18n.t('tank.editTank')}
      </Header>
      {
        !helpers.isEmpty(editedTank) &&
          <View style={styles.formContainer}>
            <TextInput
              label={i18n.t('tank.alias')}
              name="name"
              returnKeyType="next"
              onChangeText={(name) => { handleChange('name', name) } }
              value={editedTank.name}
              error={!!errors.name}
              errorText={errors.name}
              autoCapitalize="none"
              autofill="name"
            />

            <View style={styles.imageContainer}>
              <Image
                source={{ uri: image.uri }} // Date is added to avoid image to cache
                style={styles.image}
              />
              <IconButton
                icon="camera"
                size={32}
                style={styles.imageButton}
                color={theme.colors.surface}
                onPress={() => pickImage(handleChange)}
              />
            </View>

            <View style={[styles.inputRow, styles.subheader]}>
              <MaterialCommunityIcons style={styles.subheaderIcon}name="cube-scan" size={30} color={theme.colors.text} />
              <Subheader>{i18n.t('general.measures')}</Subheader>
            </View>
            <View style={styles.inputRow}>
              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.inputLeft}
                  label={i18n.t('general.width')}
                  name="width"
                  returnKeyType="next"
                  value={editedTank.measures.width && unitConverter(editedTank.measures.width, 'length', 'base', user.units.length).toString()}
                  onChangeText={(width) => handleMeasure('width', width)}
                  error={!!errors.width}
                  errorText={errors.width}
                  textContentType="none"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.inputLeft}
                  label={i18n.t('general.height')}
                  name="height"
                  returnKeyType="next"
                  value={editedTank.measures.height && unitConverter(editedTank.measures.height, 'length', 'base', user.units.length).toString()}
                  onChangeText={(height) => handleMeasure('height', height)}
                  error={!!errors.height}
                  errorText={errors.height}
                  textContentType="none"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.inputRight}
                  label={i18n.t('general.length')}
                  name="length"
                  returnKeyType="next"
                  value={editedTank.measures.length && unitConverter(editedTank.measures.length, 'length', 'base', user.units.length).toString()}
                  onChangeText={(length) => handleMeasure('length', length)}
                  error={!!errors.length}
                  errorText={errors.length}
                  textContentType="none"
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={styles.inputRow}>
              <View style={styles.inputWrap, {flex: 2,paddingRight: 12}}>
                <Button
                  style={styles.inputRight,{height: 58, marginTop: 6}}
                  onPress={() => calculateTankVolume()}
                >
                  <MaterialCommunityIcons
                    name="calculator-variant"
                    size={26}
                  />
                </Button>
              </View>
              <View style={styles.inputWrap, {flex: 8}}>
                <TextInput
                  label={i18n.t('measures.' + user.units.volume)}
                  name="liters"
                  returnKeyType="next"
                  onChangeText={(liters) => handleChange('liters', liters)}
                  value={editedTank.liters && unitConverter(editedTank.liters, 'volume', 'base', user.units.volume).toString()}
                  error={!!errors.liters}
                  errorText={errors.liters}
                  autoCapitalize="none"
                  autofill="liters"
                  style={styles.inputLeft}
                  textContentType="none"
                  keyboardType="numeric"
                />
              </View>
            </View>
            <Paragraph>{i18n.t('tank.clickFormula')}</Paragraph>
            { !!editedTank['species'].length && 
              <View style={styles.speciesContainer}>
                <View style={[styles.inputRow, styles.subheader]}>
                  <MaterialCommunityIcons style={styles.subheaderIcon} name="fish" size={30} color={theme.colors.text} />
                  <Subheader>Species</Subheader>
                </View>
                {
                  // No main species selected warning
                  !!editedTank.species.length && !mainSpecies &&
                    <Warning title={i18n.t('tank.warning.title')} subtitle={i18n.t('tank.warning.subtitle')}
                      left={() => <MaterialCommunityIcons name="alert-circle-outline" size={40} color={theme.colors.background} /> }
                    />
                }
                <ScrollView
                  style={styles.flatList}
                  contentContainerStyle={styles.flatListContainer}
                > 
                  {
                    editedTank.species.map((item) =>
                      <EditSpeciesCard
                        key={item.species._id}
                        species={item.species}
                        quantity={item.quantity}
                        main={item.main}
                        removeSpecies={removeSpecies}
                        handleSpecies={handleSpecies}
                      />
                    )
                  }
                </ScrollView>
              </View>
            }
            <Button onPress={onSubmit}>{i18n.t('general.save')}</Button>
          </View>
      }

    </Background>
  );
}

const styles = StyleSheet.create({
  background: {
  },
  formContainer: {
    flex: 1,
    alignSelf: 'stretch',
  },
  subheader:{
    paddingTop: 20,
  },
  subheaderIcon: {
    paddingVertical: 3,
    paddingRight: 5,
  },
  speciesContainer: {
    alignSelf: 'stretch',
  },
  flatList:{
    width: '100%',
  },
  flatListContainer: {
    flexDirection: 'column',
    width: '100%',
    marginVertical: theme.container.padding,
  },
  toggleContainer:{
    flexDirection: 'row',
  },
  toggleButton: {
    height:75,
    width:75,
    marginHorizontal: 3,
  },
  picker: {
    width: '100%',
    margin: 0,
    textAlign: 'left',
    zIndex: 1,
    paddingTop: 8,
    paddingBottom: 8,
  },
  itemPicker: {

  },
  inputRow: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 0,
  },
  inputWrap: {
    marginBottom: 0,
    flex: 1,
  },
  inputLeft: {
    marginTop: 0,
    marginBottom: 8,
    paddingRight: 8,
  },
  inputRight: {
    marginTop: 0,
    marginBottom: 8,
  },
  tagContainer: {
    flex:1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    borderTopColor: theme.colors.lightText,
    borderTopWidth: 1,
    paddingTop: 8,
    width: '100%',
  },
  item: {
    flex:1,
    width: '100%',
  },
  imageContainer:{
    flex: 1
  },
  image: {
    flex:1,
    width: '100%',
    resizeMode: "stretch",
    aspectRatio: 1.25,
    marginTop: theme.container.padding,
    marginBottom: theme.container.padding / 2,
    borderRadius: theme.roundness,
  },
  imageButton: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: theme.colors.primary
  },
});
