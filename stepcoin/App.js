import React, {useEffect} from 'react';

import { NavigationContainer } from '@react-navigation/native';

import AuthStack from './app/navigations/AuthStack';

//redux
import { store } from './app/store/store';
import { Provider as ReduxProvider } from 'react-redux'

import { Provider as PaperProvider } from "react-native-paper";

import i18n from './app/i18n/i18n';   //need this for multilang support 

//custom font
import { Font } from 'expo'

export default function App() {

  return (
    <PaperProvider>
      <ReduxProvider store={store}>
        <NavigationContainer>
          <AuthStack />
        </NavigationContainer>
      </ReduxProvider>
    </PaperProvider>
  );
}
