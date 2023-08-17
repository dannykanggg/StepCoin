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

//import { GoogleSignin } from '@react-native-google-signin/google-signin';


export default function App() {



  //GoogleSignin.configure({
  //  scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
  //  webClientId: "857409291032-5jkcg5cg0i7v8n1v7m1me1s7b7uovd8j.apps.googleusercontent.com",
  //  //offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  //  //hostedDomain: '', // specifies a hosted domain restriction
  //  //forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
  //  //accountName: '', // [Android] specifies an account name on the device that should be used
  //  //iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
  //  //googleServicePlistPath: '', // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
  //  //openIdRealm: '', // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
  //  //profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
  //});

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
