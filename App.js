import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './src/helpers/navigator';
import { AppRegistry } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider } from 'react-redux';
import { name as appName } from './app.json';
import store from './src/store';
import Navigator from './src/navigator';
import Alert from './src/components/Alert';
import * as Font from 'expo-font';
import theme from './src/theme';

export default function Main() {

  return (
    <StoreProvider store={store}>
      <PaperProvider>
        <NavigationContainer ref={navigationRef} theme={theme}>
          <Navigator />
          <Alert />
        </NavigationContainer>
      </PaperProvider>
    </StoreProvider>
    
  );
}

AppRegistry.registerComponent(appName, () => Main);