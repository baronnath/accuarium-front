import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './src/helpers/navigator';
import { linkingRef } from './src/helpers/linking';
import { AppRegistry } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider } from 'react-redux';
import AppLoading from 'expo-app-loading';
import { name as appName } from './app.json';
import store from './src/store';
import Navigator from './src/navigator';
import Alert from './src/components/Alert';
import { loadAsync } from 'expo-font';
import theme from './src/theme';

export default function Main() {
  const [isLoaded, setIsLoaded] = useState(false);

  const loadFonts = async () => {
    await loadAsync({
      'group-icons': require("./src/assets/group-icons/font/group-icons.ttf"),
      // All Other Fonts
    });
  };

  return (
    !isLoaded ?
      <AppLoading
        startAsync={loadFonts}
        onFinish={() => {setIsLoaded(true)}}
        onError={(error) => console.log(error)}
      />
    :
      <StoreProvider store={store}>
        <PaperProvider>
          <NavigationContainer ref={navigationRef}  linking={linkingRef} theme={theme}>
            <Navigator />
            <Alert />
          </NavigationContainer>
        </PaperProvider>
      </StoreProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);