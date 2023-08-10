import React,{useState, useEffect, useContext} from 'react';

import { View, Text } from 'react-native'

import { useIsFocused } from '@react-navigation/native';

import userInfoContext from '../context/user-info-context';
import PageHeader from '../components/header/PageHeader';


export default function RedeemScreen({ navigation }) {
  const isFocused = useIsFocused();
  const userContext = useContext(userInfoContext)

  //check if in focus
  useEffect(() => {
    if (isFocused) {
      if (userContext) {
        console.log('user info')
        console.log(userContext)
        const {user} = userContext
        const {email, loggedIn} = user

        if (loggedIn) {
          //render user login data

        } else {
          navigation.navigate('login-register')
        }
      }
    }
  },[isFocused, userContext])


  return (
    <View>
      <PageHeader />
      <Text>To be added</Text>
    </View>
  )
}

 