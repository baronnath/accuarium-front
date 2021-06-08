// src/screens/client/tank/AddTank.js

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { handleAlert } from '../../../helpers/global';
import { calculateVolume } from '../../../helpers/tank';
import { theme } from '../../../theme';
import * as ImagePicker from 'expo-image-picker';
import validator from '../../../validators/tank';

export default function AddTank({ navigation }) {
  const user = useSelector(state => state.user.data);
  const locale = user.locale;
  const dispatch = useDispatch();

  const [errors, setErrors] = useState({});

  const defaultTank = {
    name: null,
    userId: user._id,
    image: null,
    width: null,
    length: null,
    height: null,
    liters: null,
  }
  const [tank, setTank] = useState(defaultTank);

  const sliderItems = [
      <>
        <MaterialCommunityIcons name="fishbowl-outline" size={150} color={theme.colors.accent} />
        <Paragraph>Choose a name for your new project</Paragraph>
        <TextInput
          label="Tank alias"
          name="name"
          returnKeyType="next"
          onChangeText={(name) => handleChange('name', name)}
          value={tank.name}
          error={!!errors.name}
          errorText={errors.name}
          autoCapitalize="none"
          autofill="name"
        />
      </>,
      <>
        {
          tank.image ?
            <Image source={{ uri: tank.image.uri }} style={{ marginTop: 5, width: '100%', height: 200 }} />
            :
            <>
              <MaterialCommunityIcons name="camera-plus" size={100} color={theme.colors.accent} onPress={() => pickImage()} />
              <Paragraph >Pick an image as your tank avatar</Paragraph>
            </>

        }
        <Button onPress={() => pickImage()} >Pick an image</Button>
      </>,
      <>
        <MaterialCommunityIcons name="cube-scan" size={100} color={theme.colors.accent} />
        <Paragraph >Your tank measures</Paragraph>
        <View style={styles.inputRow}>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.inputLeft}
              label="Width"
              name="width"
              returnKeyType="next"
              value={tank.width}
              onChangeText={(width) => handleChange('width', width)}
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
              value={tank.height}
              onChangeText={(height) => handleChange('height', height)}
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
              value={tank.length}
              onChangeText={(length) => handleChange('length', length)}
              error={!!errors.length}
              errorText={errors.length}
            />
          </View>
        </View>
      </>,
      <>
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
              value={tank.liters}
              error={!!errors.liters}
              errorText={errors.liters}
              autoCapitalize="none"
              autofill="liters"
              style={styles.inputLeft}
            />
          </View>
        </View>
        <Paragraph >Click on the formula to calculate your tank volume</Paragraph>
      </>,
      <>
        <MaterialCommunityIcons name="cube-outline" size={100} color={theme.colors.accent} />
        <Paragraph>You are all set!</Paragraph>
        <Button onPress={onSubmit}>Save</Button>
      </>,
  ];

  async function handleChange(field, value) {
    setTank(prevTank => ({
      ...prevTank,
      [field]: value
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
      width: tank.width,
      height: tank.height,
      length: tank.length,
    }
    calculateVolume(dimensions)
      .then((liters) => {
        handleChange('liters', String(liters));
        dispatch(alertActions.success(`Your tank is ${liters} liters`));
      })
      .catch((err) => {
        dispatch(alertActions.error(err));
      });
  }

  function onSubmit(){
    const validation = validator(tank);
    console.log('VAL',validation);

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


      dispatch(alertActions.error('Tank data is not correct'));

      return;
    }


    axios.post(backend.url + '/tank', tank)
    .then(res => {
      dispatch(alertActions.success('Now add some fishes to your tank'));
      dispatch(tankActions.getTankByUser(user._id));
      setTank(defaultTank);
      navigation.navigate('Tanks');
      navigation.navigate('Species');
    })
    .catch(err => {
      handleAlert(err);
    });
  }

  return (
    <KeyboardAwareScrollView
      resetScrollToCoords={{x:0, y:0}}
    >
      <Background>

        <Slider items={sliderItems} />

      </Background>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  background: {
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
    marginTop: 30,
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
