// src/screens/client/tank/AddTank.js

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { axios }from '../../../helpers/axios';
import { backend } from '../../../../app.json';
import {
  StyleSheet, View, Image, TouchableOpacity
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Background from '../../../components/Background';
import TextInput from '../../../components/TextInput';
import Button from '../../../components/Button';
import Paragraph from '../../../components/Paragraph';
import Slider from '../../../components/Slider';
import { actions as tankActions } from '../../../ducks/tank';
import { actions as alertActions } from '../../../ducks/alert';
import { handleAlert } from '../../../helpers/global';
import unitConverter from '../../../helpers/unitConverter';
import { calculateVolume } from '../../../helpers/tank';
import { theme } from '../../../theme';
import * as ImagePicker from 'expo-image-picker';
import validator from '../../../validators/tank';
import translator from '../../../translator/translator';

export default function AddTank({ navigation }) {
  const user = useSelector(state => state.user.data);
  const locale = user.locale;
  const i18n = translator(locale);
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
        <Paragraph>{i18n.t('addTank.slide1.title')}</Paragraph>
        <TextInput
          label={i18n.t('addTank.slide1.label')}
          name="name"
          returnKeyType="next"
          onChangeText={(name) => handleChange('name', name)}
          value={tank.name}
          error={!!errors.name}
          errorText={errors.name}
          autoCapitalize="none"
          textContentType="none"
          keyboardType="default"
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
              <Paragraph>{i18n.t('addTank.slide2.title')}</Paragraph>
            </>

        }
        <Button onPress={() => pickImage()} >{i18n.t('addTank.slide2.button')}</Button>
      </>,
      <>
        <MaterialCommunityIcons name="cube-scan" size={100} color={theme.colors.accent} />
        <Paragraph>{i18n.t('addTank.slide3.title')}</Paragraph>
        <View style={styles.inputRow}>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.inputLeft}
              label={i18n.t('general.width')}
              name="width"
              returnKeyType="next"
              value={tank.width}
              onChangeText={(width) => handleChange('width', width)}
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
              value={tank.height}
              onChangeText={(height) => handleChange('height', height)}
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
              value={tank.length}
              onChangeText={(length) => handleChange('length', length)}
              error={!!errors.length}
              errorText={errors.length}
              textContentType="none"
              keyboardType="numeric"
            />
          </View>
        </View>
        <TouchableOpacity style={{flex:0.3}}>
          <Paragraph style={styles.link} fontWeight="bold">
            {i18n.t('addTank.warning.title', { unit: i18n.t(`measures.${user.units.length}`).toLowerCase(), unitAbbr: i18n.t(`measures.${user.units.length}Abbr`)})}
          </Paragraph>
          <Paragraph style={styles.link} fontWeight="light">
            {i18n.t('addTank.warning.subtitle')}
          </Paragraph>
        </TouchableOpacity>
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
              label={i18n.t('general.liters')}
              name="liters"
              returnKeyType="next"
              onChangeText={(liters) => handleChange('liters', liters)}
              value={tank.liters}
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
        <Paragraph fontWeight="light">{i18n.t('addTank.slide4.title')}</Paragraph>
        <Button onPress={onSubmit}>{i18n.t('general.save')}</Button>
      </>,
  ];

  async function handleChange(field, value) {
    setTank(prevTank => ({
      ...prevTank,
      [field]: value
    }));

    // Automatic volume calculation if measures are filled
    if(field == 'height' || field == 'width' || field == 'length') {
      if(tank.height && tank.width && tank.length)
        calculateLiters();
    }
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
        dispatch(alertActions.success('tank.litersSuccess', { liters: liters }));
      })
      .catch((err) => {
        dispatch(alertActions.error(err));
      });
  }

  async function onSubmit(){
    const validation = validator(tank);

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


      dispatch(alertActions.error('addTank.notValid'));

      return;
    }

    // Convert to base lenght measure units
    try{
      if(tank.width)
        tank.width = unitConverter(tank.width, 'length', user.units.length);
      if(tank.height)
        tank.height = unitConverter(tank.height, 'length', user.units.length);
      if(tank.length)
        tank.length = unitConverter(tank.length, 'length', user.units.length);
    }catch(err){
      dispatch(alertActions.error(err.message));
      return;
    }
    

    axios.post(backend.url + '/tank', tank)
    .then(res => {
      dispatch(alertActions.success('addTank.addSpecies'));
      dispatch(tankActions.getTankByUser(user._id));
      setTank(defaultTank); // Clean inputs after creation success
      navigation.navigate('Tanks'); // Reset tank stack navigator to main screen
      navigation.navigate('Species', { screen: 'SpeciesSearch', params: { setMainSpeciesTank: res.data.tank } });
    })
    .catch(err => {
      handleAlert(err);
    });
  }

  return (
    <Background>

      <Slider items={sliderItems} button={i18n.t('general.next')} />

    </Background>
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
  },
  link: {
    flex: 1,
    color: theme.colors.secondary,
  }
});
