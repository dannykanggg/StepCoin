import React,{useEffect,useState, useContext} from 'react';
import { View, Text, SafeAreaView, Button } from 'react-native'
import axios from 'axios';
import tw from 'twrnc'
import * as SecureStore from 'expo-secure-store'

//import {process.env.EXPO_PUBLIC_BACKEND_IP} from '@env'


import PageHeader from '../components/header/PageHeader';
import userInfoContext from '../context/user-info-context';

import { ScreenView, BodyView } from '../components/view-container/view-container';

export default function CoinHistoryScreen({ navigation }) {
  const [transactions, setTransactions] = useState([])
  //const [nextExists, setNextExists] = useState(false)
  const [nextUrl, setNextUrl] = useState('')

  //usecontext
  const userContext = useContext(userInfoContext)
  const {loginState, user, userProfile, wallet} = userContext

  //load first page of transactions on screen load
  useEffect(() => {
    const loadGuestTransactions = async(uuid) => {
      //need: uuid
      const config = {headers: {'Content-Type': 'application/json',}}
      axios.post(`${process.env.EXPO_PUBLIC_BACKEND_IP}/api/coins/get-guest-transactions/`,{uuid:uuid},config)
        .then(response => {
          const {next, previous, results} = response.data
          if (results.length>0) { setTransactions([...transactions, ...results]) }
          if (next) { setNextUrl(next)}
        })
        .catch(error => {
          console.log("guest transaction error")
          console.log(error)
        })
    }

    const loadUserTransactions = async() => {
      const token = await SecureStore.getItemAsync('token')
      const config = {headers: {'Content-Type': 'application/json','Authorization':`Bearer ${token}`}}
      axios.get(`${process.env.EXPO_PUBLIC_BACKEND_IP}/api/coins/get-user-transactions/`,config)
        .then(response => {
          const {next, previous, results} = response.data
          if (results.length>0) { setTransactions([...transactions, ...results]) }
          if (next) { setNextUrl(next)}
        })
        .catch(error => {
          console.log("user transaction error")
          console.log(error)
        })
    }
    
    if (wallet.user) {
      loadUserTransactions()
    } else if (wallet.uuid) {
      loadGuestTransactions(wallet.uuid)
    }
  },[])

  const loadMoreGuest = () => {
    const uuid = wallet.uuid
    const config = {headers: {'Content-Type': 'application/json',}}

    //if button pressed, load next 
    axios.post(nextUrl,{uuid:uuid}, config)
      .then(response => {
        const {next, previous, results} = response.data
        if (results.length>0) { setTransactions([...transactions, ...results]) }
        if (next) { setNextUrl(next)}else {setNextUrl('')}
      })
      .catch(error => {
        console.log('load more error', error)
      })
  }

  const loadMoreUser = async() => {
    const token = await SecureStore.getItemAsync('token')
    const config = {headers: {'Content-Type': 'application/json','Authorization':`Bearer ${token}`}}
    //if button pressed, load next 
    axios.get(nextUrl, config)
      .then(response => {
        const {next, previous, results} = response.data
        if (results.length>0) { setTransactions([...transactions, ...results]) }
        if (next) { setNextUrl(next)} else {setNextUrl('')}
      })
      .catch(error => {
        console.log('load more error', error)
      })
  }

  const loadMore = () => {
    if (wallet.user) {
      loadMoreUser()
    } else if (wallet.uuid) {
      loadMoreGuest()
    }
  }

  return (
    <ScreenView  style={tw``} >
      <PageHeader />

      <BodyView>
        <View style={tw`w-1/2`}>
          <Button
            onPress={() => navigation.goBack()}
            style={tw`w-12`}
            title="Back"
          />
        </View>

        <View style={tw`py-5 flex flex-col px-7`}>

          <Text style={tw`text-2xl font-bold`}>
            Coin History
          </Text>
        </View>

        <View style={tw`px-8 flex flex-col gap-2`}>
          { transactions.length>0 ? (
            transactions.map(t => {
              //
              //console.log("loaded transaction")
              return (
                <View style={tw`flex flex-row justify-between`}>
                  <Text>{t.type}</Text>
                  <Text>{t.timestamp}</Text>
                  <Text>+{t.amount}Coin</Text>
                </View>
            )})
          ) : (
            <></>
          )
          }
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

 