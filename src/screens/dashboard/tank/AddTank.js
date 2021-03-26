// src/screens/dashboard/tank/AddTank.js

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
import { actions as alertActions } from '../../../ducks/alert';
import { handleAlert } from '../../../helpers/global';
import { theme } from '../../../theme';
import * as ImagePicker from 'expo-image-picker';
import validator from '../../../validators/species';

export default function AddTank({ navigation }) {
  const user = useSelector(state => state.user.data);
  const locale = user.locale;

  const [page, setPage] = useState(0);
  const [species, setSpecies] = useState([]);
  const [users, setUsers] = useState([]);
  const [speciesFocused, setSpeciesFocused] = useState(false);
  const [userFocused, setUserFocused] = useState(false);
  const defaultTank = {
    values: {
      name: null,
      user: {
        name: null
      },
      species: [],
      speciesIds: [],
      mainSpeciesId: null,
      quantity: {},
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
  const [userKey, setUserKey] = useState(null);
  const [speciesKey, setSpeciesKey] = useState(null);
  const dispatch = useDispatch();

  let timeout;
  const onChangeSpecies = speciesKey => {
    clearTimeout(timeout);
    setSpeciesKey(speciesKey);
  }

  const onChangeUser = userKey => {
    clearTimeout(timeout);
    setUserKey(userKey);
  }

  useEffect(()=>{
    timeout = setTimeout(() => dispatchSpeciesSearch(), 200);
  },[speciesKey]);

  function dispatchSpeciesSearch(){
    if(speciesKey) {
      const params = {
        keyword: speciesKey
      }
      axios.get(backend.url + '/species/search', {params: params})
        .then(res => {
            setSpecies(res.data.species);
            // setLoading(false);
        })
        .catch(err => {
            handleAlert(err);  
            // setLoading(false);
        });
    }else{
      setSpecies([]);
    }
  }

  useEffect(()=>{
    timeout = setTimeout(() => dispatchUserSearch(), 200);
  },[userKey]);

  function dispatchUserSearch(){
    if(userKey && userKey != tank.values.user.name) {
      const params = {
        keyword: userKey
      }
      axios.get(backend.url + '/user/search', {params: params})
        .then(res => {
            setUsers(res.data.users);
            // setLoading(false);
        })
        .catch(err => {
            handleAlert(err);  
            // setLoading(false);
        });
    }else{
      setUsers([]);
    }
  }
   

  // useEffect(() => {

  //   async function checkPlatform(){
  //     if (Platform.OS !== 'web') {
  //       const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
  //       if (status !== 'granted') {
  //         dispatch(alertActions.error('Sorry, we need camera roll permissions to make this work!'));
  //       }
  //     }
  //   }
  //   checkPlatform();

  //   // Get types
  //   axios.get(backend.url + '/species')
  //     .then(res => {
  //         setTypes(res.data.species);
  //     })
  //     .catch(err => {
  //         handleAlert(err);          
  //     });

  // }, []);

  async function handleChange(field, value) {
    setTank(prevTank => ({
      ...prevTank,
      values: { 
        ...prevTank.values,
        [field]: value
      }
    }));
  }

  function addSpecies(value) {
      // check if the species has already been added
      const speciesFound = tank.values.species.find( species => { return species._id === value._id });
      if(isObject(speciesFound)){
        dispatch(alertActions.error(`${species.name[locale]} has already been added.`));
      }
      else{
        addElement('species', value);
        addQuantity(value._id);        
      }

  }

  function removeSpecies(id) {
    removeElement('species', id);
    removeQuantity(id, true); // second parameter delete quantity, instead of substract
  }

  function addElement(field, value) {
    if(value && value.length){
      setTank(prevTank => ({
        ...prevTank,
        values: { 
          ...prevTank.values,
          [field]: prevTank.values[field].concat(value)
        }
      }));
      setSpeciesKey(null);
    }
  }

  function removeElement(field, value) {
    let array = [...tank.values[field]]; // make a separate copy of the array
    let obj = array.find((obj, index) => {
      if (obj._id === value) {
        array.splice(index, 1);
        setTank(prevTank => ({
          ...prevTank,
          values: { 
            ...prevTank.values,
            [field]: array
          }
        }));
        return true;
      }
    });
  }

  function addQuantity(id) {
    let quantities = {...tank.values.quantity}; // cloce quantities object
    if(quantities[id])
      quantities[id] = ++quantities[id]
    else
      quantities[id] = 1;

    setTank(prevTank => ({
      ...prevTank,
      values: { 
        ...prevTank.values,
        quantity: quantities
      }
    }));
  }
  

  function removeQuantity(id, remove = false) {
    let quantities = {...tank.values.quantity};

    // if remove is true, the quantity is removed instead of substract an unit
    if(remove){ 
      delete quantities[id]; // delete attribute
    }
    else{
      if(quantities[id] > 1) {
        quantities[id] = --quantities[id]; // substract an unit if species is found
        setTank(prevTank => ({
          ...prevTank,
          values: { 
            ...prevTank.values,
            quantity: quantities
          }
        }));
      }
    }

    setTank(prevTank => ({
      ...prevTank,
      values: { 
        ...prevTank.values,
        quantity: quantities
      }
    }));
  }

  function addUser(user) {
    setUserKey(user.name);
    handleChange('user', user);
    clearTimeout(timeout);
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
    const validation = validator(species);
    
    if (validation !== false) {
      setTank(prevTank => ({
        ...prevTank,
        errors: {
          // name: validation.name,
          // minTemperature: validation.minTemperature,
          // maxTemperature: validation.maxTemperature,
          // minPh: validation.minPh,
          // maxPh: validation.maxPh,
          // minDh: validvalueation.minDh,
          // maxDh: validation.maxDh,
        }
      }));

      return;
    }

    // change objects to id strings
    let tankData = clone(tank.values);

    tankData.userId = tank.values.user._id;
    delete tankData.user;
    
    tankData.species.forEach(function(species, index) {
      // this[index] = species._id;
      tankData.speciesIds.push(species._id);
    }, tankData.species);
    delete tankData.species;

    console.log(tankData);

    axios.post(backend.url + '/tank', tankData)
    .then(res => {
      dispatch(alertActions.success(res.data.message));
      // setTank(defaultTank);
      // navigation.navigate('Tanks');
    })
    .catch(err => {
      handleAlert(err);  
    });
  }

  return (
    <KeyboardAwareScrollView
      resetScrollToCoords={{x:0, y:0}}
    >
      <Background justify="top">
        <MenuButton />
        <Header>
          New tank
        </Header>

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

        <View style={{width: '100%'}}>
          <TextInput
            label="User"
            name="user"
            returnKeyType="next"
            value={userKey}
            onChangeText={(userKey) => onChangeUser(userKey)}
            onFocus={()=> setUserFocused(true)}
            autoCapitalize="none"
            autofill="user"
          />
          { users && userFocused &&
            <InputSuggestion
              data={users}
              callback={addUser}
              onPress={()=> setUserFocused(false)}
            />
          }
        </View>
        

        <View style={styles.tagContainer}>
          { tank.values.species &&
            tank.values.species.map(species => {
                return (
                  <View style={{flexDirection:'row', width: '100%'}}>
                      <Paragraph>{species.name[locale]}</Paragraph>
                      <TouchableOpacity>
                          <MaterialCommunityIcons
                            onPress={() => {removeQuantity(species._id) }}
                            name="minus-circle-outline"
                            size={24}
                            color={theme.colors.lightText}
                          />
                      </TouchableOpacity>
                      <Paragraph>{tank.values.quantity[species._id]}</Paragraph>
                      <TouchableOpacity>
                          <MaterialCommunityIcons
                            onPress={() => { addQuantity(species._id) }}
                            name="plus-circle-outline"
                            size={24}
                            color={theme.colors.lightText}
                          />
                      </TouchableOpacity>
                      <TouchableOpacity>
                        <Checkbox
                          status={tank.values.mainSpeciesId == species._id ? 'checked' : 'unchecked'}
                          onPress={() => {
                            handleChange('mainSpeciesId',species._id);
                          }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity>
                          <MaterialCommunityIcons
                            onPress={() => { removeSpecies(species._id) }}
                            name="close"
                            size={18}
                            color={theme.colors.lightText}
                          />
                      </TouchableOpacity>
                  </View>
                )
              })
          }
        </View>

        <View style={{width: '100%'}}>
          <TextInput
            label="Add species"
            name="species"
            returnKeyType="next"
            onChangeText={speciesKey => onChangeSpecies(speciesKey)}
            onFocus={()=> setSpeciesFocused(true)}
            // onBlur={()=> setSpeciesFocused(false)}
            value={speciesKey}
            autoCapitalize="none"
            style={{marginTop: 0}}
          />
          { species  && speciesFocused &&
            <InputSuggestion
              data={species}
              onPress={()=> setSpeciesFocused(false)}
              callback={addSpecies}
            />
          }

        </View>

        { tank.values.image && <Image source={{ uri: tank.values.image.uri }} style={{ marginTop: 5, width: '100%', height: 200 }} /> }
        <Button onPress={pickImage} >Pick an image</Button>

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
              value={species.values.height}
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


        <Button onPress={onSubmit} >Send</Button>

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