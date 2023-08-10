import React, {useEffect} from 'react';

import { NavigationContainer } from '@react-navigation/native';


import AuthStack from './app/navigations/AuthStack';

import { UserInfoProvider } from './app/context/user-info-context';
import { Provider as PaperProvider } from "react-native-paper";


import i18n from './app/i18n/i18n';   //need this for multilang support 


//custom font
import { Font } from 'expo'


export default function App() {


  
  return (
    <PaperProvider>
      <UserInfoProvider>
        <NavigationContainer>
          <AuthStack />
        </NavigationContainer>
      </UserInfoProvider>
    </PaperProvider>
  );
}
