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
import { actions as alertActions } from '../../../ducks/alert';
import { handleAlert } from '../../../helpers/global';
import { theme } from '../../../theme';
import * as ImagePicker from 'expo-image-picker';
import validator from '../../../validators/tank';

export default function AddTank({ navigation }) {
  const user = useSelector(state => state.user.data);
  const dispatch = useDispatch();
  const locale = user.locale;

  const defaultTank = {
    values: {
      name: null,
      userId: user._id,
      image: null,
      width: null,
      length: null,
      height: null,
      liters: null,
    },
    errors:{
      name: null,
      width: null,
      length: null,
      height: null,
      liters: null,
    }
  }
  const [tank, setTank] = useState(defaultTank);

  const sliderItems = [
      <>
        <Text>Chose a name for your new project</Text>
        <TextInput
          label="Tank alias"
          name="name"
          returnKeyType="next"
          onChangeText={(name) => handleChange('name', name)}
          value={tank.values.name}
          error={!!tank.errors.name}
          errorText={tank.errors.name}
          autoCapitalize="none"
          autofill="name"
        />
      </>,
      <>
        <Text>Pick an image as your tank avatar</Text>
        { tank.values.image && <Image source={{ uri: tank.values.image.uri }} style={{ marginTop: 5, width: '100%', height: 200 }} /> }
        <Button onPress={() => pickImage()} >Pick an image</Button>
      </>,
      <>
        <View style={styles.inputRow}>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.inputLeft}
              label="Width"
              name="width"
              returnKeyType="next"
              value={tank.values.width}
              onChangeText={(width) => handleChange('width', width)}
              error={!!tank.errors.width}
              errorText={tank.errors.width}
            />
          </View>
          <View style={styles.inputWrap}>
            <TextInput 
              style={styles.inputLeft}
              label="Height"
              name="height"
              returnKeyType="next"
              value={tank.values.height}
              onChangeText={(height) => handleChange('height', height)}
              error={!!tank.errors.height}
              errorText={tank.errors.height}
            />
          </View>
          <View style={styles.inputWrap}>
            <TextInput 
              style={styles.inputRight}
              label="Length"
              name="length"
              returnKeyType="next"
              value={tank.values.length}
              onChangeText={(length) => handleChange('length', length)}
              error={!!tank.errors.length}
              errorText={tank.errors.length}
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
              value={tank.values.liters}
              error={!!tank.errors.liters}
              errorText={tank.errors.liters}
              autoCapitalize="none"
              autofill="liters"
              style={styles.inputLeft}
            />
          </View>
          
        </View>
      </>,
      <>
        <Text>That's all you need for this new project!</Text>
        <Button onPress={onSubmit}>Save tank</Button>
      </>,
  ];

  async function handleChange(field, value) {
    setTank(prevTank => ({
      ...prevTank,
      values: { 
        ...prevTank.values,
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
    const { width, height, length } = tank.values;
    const liters = width * height * length / 1000;
    handleChange('liters', String(liters));
    dispatch(alertActions.success(`Your tank is ${liters} liters`));
  }

  function onSubmit(){
    const validation = validator(tank);
    
    if (validation !== false) {
      setTank(prevTank => ({
        ...prevTank,
        errors: {
          name: validation.name,
          // minTemperature: validation.minTemperature,
          // maxTemperature: validation.maxTemperature,
          // minPh: validation.minPh,
          // maxPh: validation.maxPh,
          // minDh: validvalueation.minDh,
          // maxDh: validation.maxDh,
        }
      }));


      dispatch(alertActions.error('Tank data is not correct'));

      return;
    }


    axios.post(backend.url + '/tank', tank.values)
    .then(res => {
      dispatch(alertActions.success('Now add some fish to your tank'));
      setTank(defaultTank);
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