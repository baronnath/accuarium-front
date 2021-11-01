// src/components/Login.js

import React, { memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import * as Localization from 'expo-localization';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import BackButton from '../components/BackButton';
import { theme } from '../theme';
import translator from '../translator/translator';
import validator from '../validators/login';
import { actions as userActions } from '../ducks/user';

const Login = ({ navigation }) => {
  const locale = Localization.locale
  const i18n = translator(locale);
  const [user, setUser] = useState({
        values: {
          name: '',
          email: '',
          password: '',
          locale: locale,
        },
        errors: {
          name: '',
          email: '',
          password: '',
        }
    });
  const dispatch = useDispatch();

  function handleSubmit() {
    const validation = validator(user);
    
    if (validation !== false) {
      setUser(prevUser => ({
        ...prevUser,
        errors: {
          name: validation.name,
          email: validation.email,
          password: validation.password
        }
      }));

      return;
    }

    dispatch(userActions.login(user.values));
  };

  function handleChange(field, value) {
    setUser(prevUser => ({
      ...prevUser,
      values: { 
        ...prevUser.values,
        [field]: value
      }
    }));
  }

  return (
    <KeyboardAwareScrollView
      resetScrollToCoords={{x:0, y:0}}
      contentContainerStyle={styles.contentContainerStyle}
    >
        <Background style={styles.container} justify="top">

          <BackButton goBack={() => navigation.navigate('Home')} />

          <Logo />

          <Header>{i18n.t(login.title)}</Header>

          <TextInput
            label="Email"
            name="email"
            returnKeyType="next"
            value={user.values.email}
            onChangeText={(email) => handleChange('email', email)}
            error={!!user.errors.email}
            errorText={user.errors.email}
            autoCapitalize="none"
            autofill="email"
            textContentType="emailAddress"
            keyboardType="email-address"
          />

          <TextInput
            label="Password"
            name="password"
            returnKeyType="done"
            value={user.values.password}
            onChangeText={(password) => handleChange('password', password)}
            error={!!user.errors.password}
            errorText={user.errors.password}
            secureTextEntry
          />

          <View style={styles.forgotPassword}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPasswordScreen')}
            >
              <Text style={styles.label}>Forgot your password?</Text>
            </TouchableOpacity>
          </View>

          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.button}>
              Login
          </Button>

          <View style={styles.row}>
            <Text style={styles.label}>Don’t have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.link}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </Background>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    flex: 1,
  },  
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  label: {
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  container: {
    flex: 1,
    alignSelf: 'stretch',
    flexDirection:'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default memo(Login);