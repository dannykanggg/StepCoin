import React,{useState, useEffect, useContext} from 'react';

import { View, Text } from 'react-native'

import { useIsFocused } from '@react-navigation/native';

import PageHeader from '../components/header/PageHeader';


export default function RedeemScreen({ navigation }) {
  const isFocused = useIsFocused();

  //check if in focus
  useEffect(() => {
    if (isFocused) {
      //redirect if not logged in
      navigation.navigate('login-register')
    }
  },[isFocused])


  return (
    <View>
      <PageHeader />
      <Text>To be added</Text>
    </View>
  )
}

 