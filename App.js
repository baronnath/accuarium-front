import 'react-native-gesture-handler';
import Bugsnag from '@bugsnag/expo';
import React, { useCallback, useState, useEffect } from 'react';
import { NavigationContainer, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import { DarkTheme as PaperDarkTheme, Provider as PaperProvider } from 'react-native-paper';
import { navigationRef } from './src/helpers/navigator';
import { linkingRef } from './src/helpers/linking';
import { AppRegistry, View, StatusBar } from 'react-native';
import { Provider as StoreProvider } from 'react-redux';
import * as SplashScreen from 'expo-splash-screen';
import { loadAsync } from 'expo-font';
import { Aleo_700Bold } from '@expo-google-fonts/aleo';
import {
  useFonts,
  Montserrat_300Light,
  Montserrat_300Light_Italic,
  Montserrat_400Regular,
  Montserrat_400Regular_Italic,
  Montserrat_700Bold,
  Montserrat_700Bold_Italic,
} from '@expo-google-fonts/montserrat';
import { name as appName } from './app.json';
import store from './src/store';
import Navigator from './src/navigator';
import Alert from './src/components/Alert';
import { theme } from './src/theme';

const CombinedDarkTheme = {
  ...PaperDarkTheme,
  ...NavigationDarkTheme,
  colors: theme.colors,
};

SplashScreen.preventAutoHideAsync();

// Crash reporting init.
Bugsnag.start({});

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await loadFonts();
       
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setIsLoaded(true);
      }
    }

    prepare();
  }, []);
  

  const loadFonts = async () => {
    await loadAsync({
      'group-icons': require("./src/assets/group-icons/font/group-icons.ttf"),
      Aleo_700Bold,
      Montserrat_300Light,
      Montserrat_300Light_Italic,
      Montserrat_400Regular,
      Montserrat_400Regular_Italic,
      Montserrat_700Bold,
      Montserrat_700Bold_Italic,
    });
  };

  const onLayoutRootView = useCallback(async () => {
    if (isLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [isLoaded]);

  if (!isLoaded) {
    return null;
  }

  return (
    <View
      style={{ flex: 1 }}
      onLayout={onLayoutRootView}>
        <StatusBar barStyle="light-content" />
        <StoreProvider store={store}>
        <PaperProvider theme={CombinedDarkTheme}>
          <NavigationContainer ref={navigationRef}  linking={linkingRef} theme={CombinedDarkTheme}>
            <Navigator />
            <Alert />
          </NavigationContainer>
        </PaperProvider>
      </StoreProvider>
    </View>
  );
}

AppRegistry.registerComponent(appName, () => App);