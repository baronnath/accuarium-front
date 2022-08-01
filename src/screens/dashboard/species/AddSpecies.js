// src/screens/dashboard/species/AddSpecies.js

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { axios }from '../../../helpers/axios';
import { ucFirst } from '../../../helpers/helpers';
import { backend } from '../../../../app.json';
import { StyleSheet, View, Platform, Image, Picker } from 'react-native';
import { ToggleButton } from 'react-native-paper';
import Background from '../../../components/Background';
import Header from '../../../components/Header';
import MenuButton from '../../../components/MenuButton';
import TextInput from '../../../components/TextInput';
import Button from '../../../components/Button';
import Searchbar from '../../../components/Searchbar';
import Tag from '../../../components/Tag';
import Spinner from '../../../components/Spinner';
import Paragraph from '../../../components/Paragraph';
import Separator from '../../../components/Separator';
import { actions as alertActions } from '../../../ducks/alert';
import { handleAlert } from '../../../helpers/global';
import { theme } from '../../../theme';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import validator from '../../../validators/species';

export default function AddSpecies({ navigation }) {
  const user = useSelector(state => state.user.data);
  const locale = user.locale;

  const [page, setPage] = useState(0);
  const [types, setTypes] = useState(null);
  const [families, setFamilies] = useState(null);
  const [groups, setGroups] = useState(null);
  const [depths, setDepths] = useState(null);
  const [behaviors, setBehaviors] = useState(null);
  const [feeds, setFeeds] = useState(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const defaultSpecies = {
    values: {
      image: null,
      name: null,
      otherNames: [],
      type: null,
      familyId: null,
      groupId: null,
      minTemperature: null,
      maxTemperature: null,
      minPh: null,
      maxPh: null,
      miDPh: null,
      maxDh: null,
      minLength: null,
      maxLength: null,
    },
    errors:{
      image: null,
      name: null,
      otherNames: null,
      type: null,
      familyId: null,
      groupId: null,
      minTemperature: null,
      maxTemperature: null,
      minDh: null,
      maxDh: null,
      minLength: null,
      maxLength: null,
    }
  }
  const [species, setSpecies] = useState(defaultSpecies);
  const [otherName, setOtherName] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const dispatch = useDispatch();
   
  useEffect(() => {

    async function checkPlatform(){
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== 'granted') {
          dispatch(alertActions.error('Sorry, we need camera roll permissions to make this work!'));
        }
      }
    }
    checkPlatform();

    // Get types
    axios.get(backend.url + '/types')
      .then(res => {
          setTypes(res.data.types);
      })
      .catch(err => {
          handleAlert(err);          
      });

    // Get families
    axios.get(backend.url + '/families')
      .then(res => {
          setFamilies(res.data.families);
      })
      .catch(err => {
          handleAlert(err)
      });

    // Get groups
    axios.get(backend.url + '/groups')
      .then(res => {
          setGroups(res.data.groups);
      })
      .catch(err => {
          handleAlert(err)
      });

    // Get depth
    axios.get(backend.url + '/depths')
      .then(res => {
          setDepths(res.data.depths);
      })
      .catch(err => {
          handleAlert(err);          
      });

    // Get behaviors
    axios.get(backend.url + '/behaviors')
      .then(res => {
          setBehaviors(res.data.behaviors);
      })
      .catch(err => {
          handleAlert(err);          
      });

    // Get feeds
    axios.get(backend.url + '/feeds')
      .then(res => {
          setFeeds(res.data.feeds);
      })
      .catch(err => {
          handleAlert(err);          
      });
  }, []);

  function handleChange(field, value) {
    setSpecies(prevSpecies => ({
      ...prevSpecies,
      values: { 
        ...prevSpecies.values,
        [field]: value
      }
    }));
  }

  function addTag(field, value) {
    if(value && value.length){
      setSpecies(prevSpecies => ({
        ...prevSpecies,
        values: { 
          ...prevSpecies.values,
          [field]: prevSpecies.values[field].concat(value)
        }
      }));
      setOtherName(null);
    }
  }

  function removeTag(field, name) {
    let array = [...species.values[field]]; // make a separate copy of the array
    let index = array.indexOf(name)
    if (index !== -1) {
      array.splice(index, 1);
      setSpecies(prevSpecies => ({
        ...prevSpecies,
        values: { 
          ...prevSpecies.values,
          [field]: array
        }
      }));
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

  }

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});

    if (result.size) {
      setUploadFile(result);
    }
    else{
      setUploadFile(null);
    }
  }

  function onSubmit(){
    const validation = validator(species);
    
    if (validation !== false) {
      setSpecies(prevSpecies => ({
        ...prevSpecies,
        errors: {
          name: validation.name,
          minTemperature: validation.minTemperature,
          maxTemperature: validation.maxTemperature,
          minPh: validation.minPh,
          maxPh: validation.maxPh,
          minDh: validation.minDh,
          maxDh: validation.maxDh,
        }
      }));

      return;
    }

    axios.post(backend.url + '/species', species.values)
    .then(res => {
      dispatch(alertActions.success(res.data.message));
      setSpecies(defaultSpecies);
      navigation.navigate('Livestock');
    })
    .catch(err => {
      handleAlert(err);  
    });
  }

  function onUpload(){
    if (!uploadFile) {
      dispatch(alertActions.error('Please select a file to upload'));
      return;
    }

    let data = new FormData();
    data.append('file',
    {
        uri: 'file://' + uploadFile.uri,
        name: uploadFile.name,
        type:'application/vnd.ms-excel'
    });
    
    axios.post(backend.url + '/species/uploadFile', data)
      .then(res => {
        dispatch(alertActions.success(res.data.message));
        // setUploadFile(null);
        // navigation.navigate('Livestock');
      })
      .catch(err => {
        handleAlert(err);  
      });
  }

  return (
      <Background justify="top">
        <MenuButton />
        <Header>
          New species
        </Header>

        <View style={styles.toggleContainer}>
          { !types ?
              <Spinner />
            :
              types.map(type => {     
                return (
                  <ToggleButton
                    icon={type.icon}
                    value={type._id}
                    onPress={() => handleChange('type', type._id)}
                    status={species.values.type == type._id ? 'checked' : 'unchecked'}
                    style={styles.toggleButton}
                    theme={theme}
                    color={species.values.type == type._id ? theme.colors.primary : theme.colors.lightText}
                    size={40}
                  />
                )
              })
          }
        </View>

        <TextInput
          label="Name"
          name="name"
          returnKeyType="next"
          value={species.values.name}
          onChangeText={(name) => handleChange('name', name)}
          error={!!species.errors.name}
          errorText={species.errors.name}
          autoCapitalize="none"
          autofill="name"
        />

        <View style={styles.tagContainer}>
          { species.values.otherNames &&
            species.values.otherNames.map(name => {
                return (
                  <Tag onClose={() => removeTag('otherNames', name)}>{name}</Tag>
                )
              })
          }
        </View>

        <View style={styles.inputRow}>
          <TextInput
            label="Another name"
            name="otherName"
            returnKeyType="next"
            value={otherName}
            onChangeText={(otherNames) => setOtherName(otherNames)}
            autoCapitalize="none"
            style={{flex:9, marginRight: 4, marginTop: 0}}
          />
          <Button
            style={{flex: 1, marginTop: 6, marginBottom: 12, marginLeft: 4}}
            onPress={() => addTag('otherNames', otherName)}
          >Add</Button>
        </View>

        <View style={styles.pickerContainer}>
          { !families ?
              <Spinner />
            :
              <Picker
                selectedValue={species.values.familyId}
                style={
                  styles.picker,
                  species.values.family ? { color: theme.colors.text } : { color: theme.colors.placeholder }
                }
                itemStyle={styles.itemPicker}
                onValueChange={(familyId) => handleChange('familyId', familyId)}
              >
                <Picker.Item label="Select family" value={null} />
                {
                  families.map(family => {    
                    return (
                      <Picker.Item label={ucFirst(family.name[locale])} value={family._id} />
                    )
                  })
                }
              </Picker>
          }
        </View>

        <View style={styles.pickerContainer}>
          { !groups ?
              <Spinner />
            :
              <Picker
                selectedValue={species.values.groupId}
                style={
                  styles.picker,
                  species.values.group ? { color: theme.colors.text } : { color: theme.colors.placeholder }
                }
                itemStyle={styles.itemPicker}
                onValueChange={(groupId) => handleChange('groupId', groupId)}
              >
                <Picker.Item label="Select group" value={null} />
                {
                  groups.map(group => {    
                    return (
                      <Picker.Item label={ucFirst(group.name[locale])} value={group._id} />
                    )
                  })
                }
              </Picker>
          }
        </View>

        { species.values.image && <Image source={{ uri: species.values.image.uri }} style={{ marginTop: 5, width: '100%', height: 200 }} /> }
        <Button onPress={pickImage} >Pick an image</Button>

        <View style={styles.inputRow}>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.inputLeft}
              label="Min. temperature"
              name="minTemperature"
              returnKeyType="next"
              value={species.values.minTemperature}
              onChangeText={(minTemperature) => handleChange('minTemperature', minTemperature)}
              error={!!species.errors.minTemperature}
              errorText={species.errors.minTemperature}
            />
          </View>
          <View style={styles.inputWrap}>
            <TextInput 
              style={styles.inputRight}
              label="Max. temperature"
              name="maxTemperature"
              returnKeyType="next"
              value={species.values.maxTemperature}
              onChangeText={(maxTemperature) => handleChange('maxTemperature', maxTemperature)}
              error={!!species.errors.maxTemperature}
              errorText={species.errors.maxTemperature}
            />
          </View>
        </View>

        <View style={styles.inputRow}>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.inputLeft}
              label="Min. pH"
              name="minPh"
              returnKeyType="next"
              value={species.values.minPh}
              onChangeText={(minPh) => handleChange('minPh', minPh)}
              error={!!species.errors.minPh}
              errorText={species.errors.minPh}
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputWrap}>
            <TextInput 
              style={styles.inputRight}
              label="Max. pH"
              name="maxPh"
              returnKeyType="next"
              value={species.values.maxPh}
              onChangeText={(maxPh) => handleChange('maxPh', maxPh)}
              error={!!species.errors.maxPh}
              errorText={species.errors.maxPh}
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.inputRow}>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.inputLeft}
              label="Min. dH"
              name="minDh"
              returnKeyType="next"
              value={species.values.minDh}
              onChangeText={(minDh) => handleChange('minDh', minDh)}
              error={!!species.errors.minDh}
              errorText={species.errors.minDh}
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputWrap}>
            <TextInput 
              style={styles.inputRight}
              label="Max. dH"
              name="maxDh"
              returnKeyType="next"
              value={species.values.maxDh}
              onChangeText={(maxDh) => handleChange('maxDh', maxDh)}
              error={!!species.errors.maxDh}
              errorText={species.errors.maxDh}
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.inputRow}>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.inputLeft}
              label="Min. length"
              name="minLength"
              returnKeyType="next"
              value={species.values.minLength}
              onChangeText={(minLength) => handleChange('minLength', minLength)}
              error={!!species.errors.minLength}
              errorText={species.errors.minLength}
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputWrap}>
            <TextInput 
              style={styles.inputRight}
              label="Max. length"
              name="maxLength"
              returnKeyType="next"
              value={species.values.maxLength}
              onChangeText={(maxLength) => handleChange('maxLength', maxLength)}
              error={!!species.errors.maxLength}
              errorText={species.errors.maxLength}
              autoCapitalize="none"
            />
          </View>
        </View>

        <Button onPress={onSubmit} >Save</Button>

        <Separator/>

        <Paragraph>or</Paragraph>

        <View style={styles.inputRow}>
          <TextInput
            label="XLSX file"
            name="uploadFile"
            returnKeyType="next"
            value={uploadFile ? uploadFile.name : ''}
            editable={false}
            autoCapitalize="none"
            style={{flex:9, marginRight: 4, marginTop: 0}}
          />
          <Button
            style={{flex: 1, marginTop: 6, marginBottom: 12, marginLeft: 4}}
            onPress={pickDocument}
          >...</Button>
        </View>
        <Button onPress={onUpload}>Upload</Button>

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
    paddingRight: 4,
  },
  inputRight: {
    marginTop: 0,
    marginBottom: 8,    
    paddingLeft: 4,
  },
  tagContainer: {
    flex:1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    borderTopColor: theme.colors.lightText,
    borderTopWidth: 1,
    paddingTop: 8,
    width: '100%',
  }
});