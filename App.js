import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { NavigationContainer, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import { DarkTheme as PaperDarkTheme, Provider as PaperProvider } from 'react-native-paper';
import { navigationRef } from './src/helpers/navigator';
import { linkingRef } from './src/helpers/linking';
import { AppRegistry } from 'react-native';
import { Provider as StoreProvider } from 'react-redux';
import AppLoading from 'expo-app-loading';
import { name as appName } from './app.json';
import store from './src/store';
import Navigator from './src/navigator';
import Alert from './src/components/Alert';
import { loadAsync } from 'expo-font';
import { theme } from './src/theme';


const CombinedDarkTheme = {
  ...PaperDarkTheme,
  ...NavigationDarkTheme,
  colors: theme.colors,
};

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
        <PaperProvider theme={CombinedDarkTheme}>
          <NavigationContainer ref={navigationRef}  linking={linkingRef} theme={CombinedDarkTheme}>
            <Navigator />
            <Alert />
          </NavigationContainer>
        </PaperProvider>
      </StoreProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);