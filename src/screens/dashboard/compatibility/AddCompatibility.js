// src/screens/dashboard/compatibility/AddCompatibility.js

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { axios }from '../../../helpers/axios';
import { ucFirst } from '../../../helpers/helpers';
import { backend } from '../../../../app.json';
import { StyleSheet, View, Platform, Image, Picker } from 'react-native';
import { ToggleButton } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
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

export default function AddCompatibility({ navigation }) {
  const user = useSelector(state => state.user.data);
  const locale = user.locale;

  const [uploadFile, setUploadFile] = useState(null);
  const dispatch = useDispatch();
   
  useEffect(() => {
  });

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});

    if (result.size) {
      setUploadFile(result);
    }
    else{
      setUploadFile(null);
    }
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
    
    axios.post(backend.url + '/compatibility/uploadFile', data)
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
    <KeyboardAwareScrollView
      resetScrollToCoords={{x:0, y:0}}
    >
      <Background justify="top">
        <MenuButton />
        <Header>
          New compatibility
        </Header>

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
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  inputRow: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 0,
  },
  inputWrap: {
    marginBottom: 0,
    flex: 1,
  }
});