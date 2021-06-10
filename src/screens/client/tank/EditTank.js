// src/screens/client/tank/EditTank.js

import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { axios }from '../../../helpers/axios';
import { ucFirst, isObject, clone } from '../../../helpers/helpers';
import { backend } from '../../../../app.json';
import {
  StyleSheet, View, Platform, Image, Picker, FlatList, Item, Text, TouchableHighlight, TouchableOpacity
} from 'react-native';
import { ToggleButton, Checkbox } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Background from '../../../components/Background';
import Header from '../../../components/Header';
import Subheader from '../../../components/Subheader';
import MenuButton from '../../../components/MenuButton';
import TextInput from '../../../components/TextInput';
import Button from '../../../components/Button';
import Paragraph from '../../../components/Paragraph';
import InputSuggestion from '../../../components/InputSuggestion';
import SpeciesCard from '../../../components/SpeciesCard';
import Tag from '../../../components/Tag';
import Spinner from '../../../components/Spinner';
import Slider from '../../../components/Slider';
import { actions as tankActions } from '../../../ducks/tank';
import { actions as alertActions } from '../../../ducks/alert';
import helpers from '../../../helpers/helpers';
import { handleAlert } from '../../../helpers/global';
import { findMainSpecies, calculateVolume } from '../../../helpers/tank';
import { theme } from '../../../theme';
import * as ImagePicker from 'expo-image-picker';
import validator from '../../../validators/tank';

export default function EditTank({ route, navigation }) {
  const { tankId } = route.params;

  const user = useSelector(state => state.user.data);
  const locale = user.locale;
  const tank = useSelector(state => state.tanks.data);
  const [editedTank, setEditedTank] = useState({});
  const [errors, setErrors] = useState({});
  const isLoading = useSelector(state => state.tanks.isLoading);
  const isInitialMount = useRef(true);

  const [id, setId] = useState(false);
  const [mainSpecies, setMainSpecies] = useState(null);

  const dispatch = useDispatch();

  useFocusEffect(
    React.useCallback(() => {
      setId(tankId);
    }, [])
  );

  useEffect(() => {
    dispatch(tankActions.getTank(tankId));
  }, [tankId]);

  useEffect(() => {
    // Only after tank state is updated, avoid first load loop
    if(isInitialMount.current){
      isInitialMount.current = false;
    }
    else {
      setEditedTank(helpers.clone(tank));
      if(editedTank.species)
        setMainSpecies(findMainSpecies(editedTank.species));
    }
  }, [tank]);

  async function handleChange(field, value) {
    setEditedTank(prevTank => ({
      ...prevTank,
      [field]: value
    }));
  }

  async function handleMeasure(field, value) {
    setEditedTank(prevTank => ({
      ...prevTank,
      measures: {
        ...prevTank.measures,
        [field]: value
      }
    }));
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.cancelled) {
      handleChange('image', result);
    }

  };

  function calculateLiters() {
    const dimensions = {
      width: editedTank.measures.width,
      height: editedTank.measures.height,
      length: editedTank.measures.length,
    }
    calculateVolume(dimensions)
      .then((liters) => {
        handleChange('liters', liters);
        dispatch(alertActions.success(`Your tank is ${liters} liters`));
      })
      .catch((err) => {
        dispatch(alertActions.error(err));
      });
  }

  function onSubmit(){
    const validation = validator(editedTank);

    if (validation !== false) {
      setErrors({
        name: validation.name,
        // minTemperature: validation.minTemperature,
        // maxTemperature: validation.maxTemperature,
        // minPh: validation.minPh,
        // maxPh: validation.maxPh,
        // minDh: validvalueation.minDh,
        // maxDh: validation.maxDh,
      });

      dispatch(alertActions.error('tank.data.invalid'));

      return;
    }

    dispatch(tankActions.updateTank(editedTank));
  }

  return (
    <KeyboardAwareScrollView
      resetScrollToCoords={{x:0, y:0}}
    >
      <Background justify="top">
        <Header>
          Edit tank
        </Header>
        {
          !helpers.isEmpty(editedTank) &&
            <View style={styles.formContainer}>
              <TextInput
                label="Tank alias"
                name="name"
                returnKeyType="next"
                onChangeText={(name) => { handleChange('name', name) } }
                value={editedTank.name}
                error={!!errors.name}
                errorText={errors.name}
                autoCapitalize="none"
                autofill="name"
              />
              <View style={[styles.inputRow, styles.subheader]}>
                <MaterialCommunityIcons style={styles.subheaderIcon}name="cube-scan" size={30} color={theme.colors.text} />
                <Subheader>Measures</Subheader>
              </View>
              <View style={styles.inputRow}>
                <View style={styles.inputWrap}>
                  <TextInput
                    style={styles.inputLeft}
                    label="Width"
                    name="width"
                    returnKeyType="next"
                    value={editedTank.measures.width && editedTank.measures.width.toString()}
                    onChangeText={(width) => handleMeasure('width', width)}
                    error={!!errors.width}
                    errorText={errors.width}
                  />
                </View>
                <View style={styles.inputWrap}>
                  <TextInput
                    style={styles.inputLeft}
                    label="Height"
                    name="height"
                    returnKeyType="next"
                    value={editedTank.measures.height && editedTank.measures.height.toString()}
                    onChangeText={(height) => handleMeasure('height', height)}
                    error={!!errors.height}
                    errorText={errors.height}
                  />
                </View>
                <View style={styles.inputWrap}>
                  <TextInput
                    style={styles.inputRight}
                    label="Length"
                    name="length"
                    returnKeyType="next"
                    value={editedTank.measures.length && editedTank.measures.length.toString()}
                    onChangeText={(length) => handleMeasure('length', length)}
                    error={!!errors.length}
                    errorText={errors.length}
                  />
                </View>
              </View>
              <View style={styles.inputRow}>
                <View style={styles.inputWrap, {flex: 2,paddingRight: 12}}>
                  <Button
                    style={styles.inputRight,{height: 58, marginTop: 6}}
                    onPress={() => calculateLiters()}
                  >
                    <MaterialCommunityIcons
                      name="calculator-variant"
                      size={28}
                    />
                  </Button>
                </View>
                <View style={styles.inputWrap, {flex: 8}}>
                  <TextInput
                    label="Liters"
                    name="liters"
                    returnKeyType="next"
                    onChangeText={(liters) => handleChange('liters', liters)}
                    value={editedTank.liters && editedTank.liters.toString()}
                    error={!!errors.liters}
                    errorText={errors.liters}
                    autoCapitalize="none"
                    autofill="liters"
                    style={styles.inputLeft}
                  />
                </View>
              </View>
              <Paragraph>Click on the formula to calculate your tank volume</Paragraph>
              { !!editedTank['species'].length && 
                <View style={[styles.inputRow, styles.subheader]}>
                  <MaterialCommunityIcons style={styles.subheaderIcon} name="fish" size={30} color={theme.colors.text} />
                  <Subheader>Species</Subheader>
                </View>
              }
              <Button onPress={onSubmit}>Save</Button>
            </View>
        }

      </Background>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  background: {
  },
  formContainer: {
    alignItems: 'flex-start',
  },
  subheader:{
    paddingTop: 20,
  },
  subheaderIcon: {
    paddingVertical: 3,
    paddingRight: 5,
  },
  toggleContainer:{
    flexDirection: 'row',
  },
  toggleButton: {
    height:75,
    width:75,
    marginHorizontal: 3,
  },
  pickerContainer: {
    width: '100%',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: theme.colors.placeholder,
    padding: 0,
    overflow: "hidden",
    backgroundColor: theme.colors.background,
    marginBottom: 14,
    paddingHorizontal: 4,
    paddingVertical: 3,
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
  }
});
