// src/screens/dashboard/compatibility/Compatibilities.js

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { axios }from '../../../helpers/axios';
import { ucFirst } from '../../../helpers/helpers';
import { backend } from '../../../../app.json';
import { StyleSheet, View, Platform, Image, Picker, ScrollView } from 'react-native';
import { ToggleButton } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Fab from '../Fab';
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

export default function Compatibilities({ navigation }) {
  const user = useSelector(state => state.user.data);
  const locale = user.locale;

  const [uploadFile, setUploadFile] = useState(null);
  const dispatch = useDispatch();
   
  useEffect(() => {
  });

  return (
    <>
      <Background justify="top">
        <MenuButton />
        <Header>
          Compatibilities
      	</Header>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        </ScrollView>

      </Background>
  	  <Fab />
    </>
  );
}

const styles = StyleSheet.create({
	background: {
	    flex: 1,
	    width: '100%',
	    flexDirection:'column',
	    alignItems: 'center',
	    justifyContent: 'center',
	},
	scroll: {
    	width: '100%',
	},
	scrollContainer: {
		alignItems: 'center',
		justifyContent: 'center',
	},
});