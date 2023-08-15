import React,{useEffect,useState, useContext} from 'react';
import { View, Text, SafeAreaView, Button } from 'react-native'
import * as SecureStore from 'expo-secure-store'

//import {process.env.EXPO_PUBLIC_BACKEND_IP} from '@env'


import PageHeader from '../components/header/PageHeader';

import { ScreenView, BodyView } from '../components/view-container/view-container';

export default function CoinHistoryScreen({ navigation }) {
  const [transactions, setTransactions] = useState([])
  //const [nextExists, setNextExists] = useState(false)
  const [nextUrl, setNextUrl] = useState('')

  //usecontext

  //load first page of transactions on screen load
  useEffect(() => {
    //const loadGuestTransactions = async(uuid) => {
    //  //need: uuid
    //  const config = {headers: {'Content-Type': 'application/json',}}
    //  axios.post(`${process.env.EXPO_PUBLIC_BACKEND_IP}/api/coins/get-guest-transactions/`,{uuid:uuid},config)
    //    .then(response => {
    //      const {next, previous, results} = response.data
    //      if (results.length>0) { setTransactions([...transactions, ...results]) }
    //      if (next) { setNextUrl(next)}
    //    })
    //    .catch(error => {
    //      console.log("guest transaction error")
    //      console.log(error)
    //    })
    //}

    //const loadUserTransactions = async() => {
    //  const token = await SecureStore.getItemAsync('token')
    //  const config = {headers: {'Content-Type': 'application/json','Authorization':`Bearer ${token}'}
    //  axios.get(`${process.env.EXPO_PUBLIC_BACKEND_IP}/api/coins/get-user-transactions/`,config)
    //    .then(response => {
    //      const {next, previous, results} = response.data
    //      if (results.length>0) { setTransactions([...transactions, ...results]) }
    //      if (next) { setNextUrl(next)}
    //    })
    //    .catch(error => {
    //      console.log("user transaction error")
    //      console.log(error)
    //    })
    //}
    //
    //if (wallet.user) {
    //  loadUserTransactions()
    //} else if (wallet.uuid) {
    //  loadGuestTransactions(wallet.uuid)
    //}
  },[])

  //const loadMoreGuest = () => {
  //  const uuid = wallet.uuid
  //  const config = {headers: {'Content-Type': 'application/json',}}
//
  //  //if button pressed, load next 
  //  axios.post(nextUrl,{uuid:uuid}, config)
  //    .then(response => {
  //      const {next, previous, results} = response.data
  //      if (results.length>0) { setTransactions([...transactions, ...results]) }
  //      if (next) { setNextUrl(next)}else {setNextUrl('')}
  //    })
  //    .catch(error => {
  //      console.log('load more error', error)
  //    })
  //}
  

  return (
    <ScreenView >
      <PageHeader />

      <BodyView>
        <View className='w-1/2'>
          <Button
            onPress={() => navigation.goBack()}
            className='w-12'
            title="Back"
          />
        </View>

        <View className='py-5 flex flex-col px-7'>

          <Text className='text-2xl font-bold'>
            Coin History
          </Text>
        </View>

        <View className='px-8 flex flex-col gap-2'>
          {/* transactions.length>0 ? (
            transactions.map(t => {
              //
              //console.log("loaded transaction")
              return (
                <View className='flex flex-row justify-between'>
                  <Text>{t.type}</Text>
                  <Text>{t.timestamp}</Text>
                  <Text>+{t.amount}Coin</Text>
                </View>
            )})
          ) : (
            <></>
          )
          */}
        </View>

        <View>
          { nextUrl ? (
            <Button 
              title='load more'
              onPress={() => {loadMore()}}
            />
          ) : (
            <></>
          )}

        </View>
      </BodyView>
    </ScreenView>
  )
}

 