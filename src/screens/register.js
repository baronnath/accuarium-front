// src/screens/register.js

import React, { memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import BackButton from '../components/BackButton';
import { theme } from '../theme';
import validator from '../validators/register';
import { actions as userActions } from '../ducks/user';

function Register ({ navigation }) {
  const [user, setUser] = useState({
        values: {
          name: '',
          email: '',
          password: '',
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

    dispatch(userActions.register(user.values));
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
    >
      <View style={styles.container}>
        <Background>
          <BackButton goBack={() => navigation.navigate('Home')} />

          <Logo />

          <Header>Create Account</Header>


          <TextInput
            label="Name"
            name="name"
            returnKeyType="next"
            value={user.values.name}
            onChangeText={(name) => handleChange('name', name)}
            error={!!user.errors.name}
            errorText={user.errors.name}
          />

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
            

          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.button}>
              Sign up
          </Button>

          <View style={styles.row}>
            <Text style={styles.label}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.link}>Login</Text>
            </TouchableOpacity>
          </View>
        </Background>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  label: {
    color: theme.colors.secondary,
  },
  button: {
    marginTop: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  container: {
    width: '100%',
  },
});

export default memo(Register);