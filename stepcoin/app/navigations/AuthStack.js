import React, {useContext, createContext} from 'react';


import {createNativeStackNavigator} from '@react-navigation/native-stack'

//import * as SecureStore from 'expo-secure-store'


import MainBottomTab from './MainBottomTab';

//import LoginScreen from '../screens/auth/LoginScreen';
//import RegisterScreen from '../screens/auth/LoginRegisterScreen';
import LoginRegisterScreen from '../screens/auth/LoginRegisterScreen';
import PasswordScreen from '../screens/auth/PasswordScreen';


import AboutYouScreen from '../screens/auth/AboutYouScreen';



const Stack = createNativeStackNavigator();
function AuthStack() {

    //set active wallet


    return (
        <Stack.Navigator
            screenOptions = {{
                headerShown: false
            }}
        >
            <Stack.Screen name='main-tabs' component={MainBottomTab}/>
            <Stack.Screen name='login-register' component={LoginRegisterScreen} />
            <Stack.Screen name='password' component={PasswordScreen}/>

            <Stack.Screen name='about-you' component={AboutYouScreen}/>
        </Stack.Navigator>
    )
}
export default AuthStack;