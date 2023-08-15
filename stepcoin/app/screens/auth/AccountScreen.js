import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet,View, Text, Button, ScrollView } from 'react-native'
//import * as Keychain from 'react-native-keychain'
import * as SecureStore from 'expo-secure-store'
import { useIsFocused } from "@react-navigation/native";


import PageHeader from '../../components/header/PageHeader';

import { ScreenView, BodyView } from '../../components/view-container/view-container';
//import colors from '../../config/colors';

//redux
import { useSelector, useDispatch } from 'react-redux'
import { userState, userLogout } from '../../store/userSlice';
import { profileLogout } from '../../store/profileSlice';


export default function AccountScreen({ navigation }) {

  //redux
  const dispatch = useDispatch()
  const user = useSelector(userState)

  const [loggedIn, setLoggedIn] = useState(false)

  const isFocused = useIsFocused();

  
  useEffect(() => {
    if (isFocused) {
      //redirect to login-register if not logged in
      //change login condition to uid
      const {data} = user
      const {email} = data

      if (!email) {
        navigation.navigate('login-register')
      } else {
        setLoggedIn(true)
      }
    }
  },[isFocused])

  const logoutHandler = () => {
    //logout redux
    //userLogout
    dispatch(userLogout())
    
    //profileLogout
    dispatch(profileLogout())
    navigation.navigate('steps')
  }

  //if not logged in, ad login & register buttons
  return (
    <ScreenView>

      <PageHeader/>


      <BodyView className='px-3'>

        <Text className=' text-xl font-bold p-4 text-black '>My Page</Text>
        <View className='flex flex-col gap-4'>
          { loggedIn ? 
            <>
              <View className='flex flex-col'>
                <Text>Email: </Text>
                <View className='flex flex-row'>
                  <Text>{user.email ? user.email : 'nothing'}</Text>
                  <Text className='ml-auto'>edit</Text>
                </View>
              </View>

              <View className='flex flex-col'>
                <Text>Password</Text>
                <View className='flex flex-row'>
                  <Text>*********</Text>
                  <Text className='ml-auto'>edit</Text>
                </View>
              </View>

              <View className='flex flex-col'>
                <Text>Birthday</Text>
                <View className='flex flex-row'>
                  <Text>birthday</Text>
                  <Text className='ml-auto'>edit</Text>
                </View>
              </View>

              <View className='flex flex-col'>
                <Text>Gender</Text>
                <View className='flex flex-row'>
                  <Text>gender</Text>
                  <Text className='ml-auto'>edit</Text>
                </View>
              </View>
            </>
            : 
            <View className='w-1/2'>
            </View>
          }
        </View>

        <View className='flex flex-col'>
          <Text>Help(Link to FAQ website)</Text>
          <Text>Private Policy</Text>
        </View>

        { loggedIn ?
          <View className='flex flex-row'>
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

