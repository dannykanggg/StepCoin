import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet,View, Text, Button, ScrollView } from 'react-native'
import tw from 'twrnc';
//import * as Keychain from 'react-native-keychain'
import * as SecureStore from 'expo-secure-store'
import { useIsFocused } from "@react-navigation/native";


import userInfoContext from '../../context/user-info-context';

import PageHeader from '../../components/header/PageHeader';

import { ScreenView, BodyView } from '../../components/view-container/view-container';
//import colors from '../../config/colors';


export default function AccountScreen({ navigation }) {
  const isFocused = useIsFocused();
  const userContext = useContext(userInfoContext)
  const {loginState, user, userProfile, wallet} = userContext

  useEffect(() => {
    if (isFocused) {
      //redirect to login-register if not logged in
      if (!loginState) {
        navigation.navigate('login-register')
      }
    }
  },[isFocused, userContext])

  const logoutHandler = () => {
    userContext.logout()
    navigation.navigate('steps')
  }

  //if not logged in, ad login & register buttons
  return (
    <ScreenView>

      <PageHeader/>


      <BodyView style={tw`px-3`}>

        <Text style={tw` text-xl font-bold p-4 text-black `}>My Page</Text>
        <View style={tw`flex flex-col gap-4`}>
          { loginState ? 
            <>
              <View style={tw`flex flex-col`}>
                <Text>Email: </Text>
                <View style={tw`flex flex-row`}>
                  <Text>{user.email}</Text>
                  <Text style={tw`ml-auto`}>edit</Text>
                </View>
              </View>

              <View style={tw`flex flex-col`}>
                <Text>Password</Text>
                <View style={tw`flex flex-row`}>
                  <Text>*********</Text>
                  <Text style={tw`ml-auto`}>edit</Text>
                </View>
              </View>

              <View style={tw`flex flex-col`}>
                <Text>Birthday</Text>
                <View style={tw`flex flex-row`}>
                  <Text>{userProfile.birthday}</Text>
                  <Text style={tw`ml-auto`}>edit</Text>
                </View>
              </View>

              <View style={tw`flex flex-col`}>
                <Text>Gender</Text>
                <View style={tw`flex flex-row`}>
                  <Text>{userProfile.gender}</Text>
                  <Text style={tw`ml-auto`}>edit</Text>
                </View>
              </View>
            </>
            : 
            <View style={tw`w-1/2`}>
            </View>
          }
        </View>

        <View style={tw`flex flex-col`}>
          <Text>Help(Link to FAQ website)</Text>
          <Text>Private Policy</Text>
        </View>

        { userContext.user.loggedIn ?
          <View style={tw`flex flex-row`}>
            <Button
              onPress={() => logoutHandler()}
              title="Log Out"
              color='black'
            />
          </View>
          : <></>
        }

    </BodyView>

    </ScreenView>
  )
}

