import React,{useContext, useState, useEffect} from 'react'

import { View, Text, ImageBackground, ScrollView, Button } from 'react-native'
import tw from 'twrnc'
import axios from 'axios';

import { ScreenView, BodyView } from '../components/view-container/view-container';
import PageHeader from '../components/header/PageHeader';
import userInfoContext from '../context/user-info-context';
import uuid from 'react-native-uuid';
import * as SecureStore from 'expo-secure-store'

import { SvgUri } from 'react-native-svg';
import { Foundation } from '@expo/vector-icons';

//svg
import MascotBunny from '../assets/mascot/mascot_bunny.svg'
import Tank from '../assets/tank/70.svg'
import Coin from '../assets/coin-icon/09.svg'

import { SimpleButton, CustomButton } from '../components/button/button';

import CircularProgress from 'react-native-circular-progress-indicator';

//admob
//import { GAMBannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads'; 

//translations
import { useTranslation } from "react-i18next";

export default function StepsScreen({ navigation }) {
  const userContext = useContext(userInfoContext)
  const {loginState,wallet} = userContext
  console.log("stepscreen")
  console.log(userContext)

  //wallet initation for new user OR loads if uuid is saved in securetoken
  useEffect(() => {

    const initiateWallet = async() => {
      const uuidExisting = await SecureStore.getItemAsync('uuid')

      //if user is logged in, get wallet from backend
      if (loginState) {
        console.log('user is logged in')
        const token = await SecureStore.getItemAsync('token')
        const config = {headers: {'Content-Type': 'application/json','Authorization': `Bearer ${token}`}}
        axios.get(`${process.env.EXPO_PUBLIC_BACKEND_IP}/api/coins/get-wallet/`,config)
          .then(response => {
            const {data} = response
            console.log("load wallet")
            userContext.setWallet({user:data.user, uuid: data.uuid, balance:data.balance})
          })
          .catch(error => {
            console.log("error getting user's wallet",error)
          })
      } else if (typeof(uuidExisting)==='string') {
        //if not logged in but there is uuid in secure store, load guest wallet
        const config = {headers: {'Content-Type': 'application/json',}}
        axios.post(`${process.env.EXPO_PUBLIC_BACKEND_IP}/api/coins/get-guest-wallet/`,{uuid:uuidExisting},config)
          .then(response => {
            const {data} = response
            console.log("load guest wallet")
            userContext.setWallet({user:data.user, uuid: data.uuid, balance:data.balance})
          })
          .catch(error => {
            console.log("error loading guest wallet", error)
            console.log("initiating new wallet...")
            //initiate new wallet for new person
            const uuidValue = uuid.v4();
            axios.post(`${process.env.EXPO_PUBLIC_BACKEND_IP}/api/coins/initiate-wallet/`,
              {uuid:uuidValue},
              config
            )
            .then(response => {
              //success, store uuid wallet in usecontext
              const {data} = response
              userContext.setWallet({user:'', uuid: data.uuid, balance: 0})
              SecureStore.setItemAsync('uuid', uuidValue)
            })
            .catch(error => {
              console.log("error initiating wallet")
            })
          })
      } else {
        //initiate new wallet for new person
        const uuidValue = uuid.v4();
        //create wallet axios 
        const config = {headers: {'Content-Type': 'application/json',}}
        axios.post(`${process.env.EXPO_PUBLIC_BACKEND_IP}/api/coins/initiate-wallet/`,
          {uuid:uuidValue},
          config
        )
        .then(response => {
          //success, store uuid wallet in usecontext
          const {data} = response
          userContext.setWallet({user:'', uuid: data.uuid, balance: 0})
          SecureStore.setItemAsync('uuid', uuidValue)
        })
        .catch(error => {
          console.log("error initiating wallet")
        })
      }
    }
    initiateWallet()
  },[])

  //translations
  const { t, i18n } = useTranslation();

  const adReward = () => {
    userContext.addBalance(60)
  }

  const noAdReward = () => {
    userContext.addBalance(10)
  }

  const bgImage = require('../assets/background.jpeg')
  //<ImageBackground source={image} resizeMode="cover" style={styles.image}>

  return (
    <ScreenView className='text-center'>
      <PageHeader/>
      <BodyView>

        <ImageBackground 
          source={bgImage} 
          resizeMode='cover' 
          imageStyle={{opacity:0.4}}
        >
          <View className='flex flex-row justify-around items-center p-2 my-3 h-60 w-full'>
            <View className='w-1/3'>
                <MascotBunny width={200} height={200} />
            </View>

            <View className='flex flex-col justify-center gap-2'>
              <CircularProgress 
                value={583}
                
                progressValueStyle={tw`hidden`}
                activeStrokeWidth={15}

                maxValue={1000}
                radius={90}
                title={<Text className='text-3xl'>300<Foundation name="foot" size={30} color="#22BFAC" /></Text>}

                //onAnimationComplete={() => { alert('callback') }}
              />
              <Text className='text-sm'>30 more steps until reward</Text>
            </View>
          </View>
        </ImageBackground>

        <View>
          <ScrollView className='flex flex-row gap-2 ml-2 my-3 overflow-scroll' horizontal={true}>
            <Tank width={90} height={90}/>
            <Tank width={90} height={90}/>
            <Tank width={90} height={90}/>
            <Tank width={90} height={90}/>
            <Tank width={90} height={90}/>
          </ScrollView>
        </View>


        <View className='w-full flex flex-col gap-3'>
          <View className='px-3'>
            <CustomButton 
              className='w-full h-10 flex justify-center items-center bg-azure rounded-full'
              onPress={() => adReward()}
            >
              <View className='flex flex-row gap-2 items-center'>
                <Coin width={30} height={30}/>
                <Text className='text-white font-bold text-lg'>Watch ad +60 coins</Text>
              </View>
            </CustomButton>
          </View>

          <View className='px-3'>
            <CustomButton 
              className='w-full h-10 flex justify-center items-center bg-crayola rounded-full'
              onPress={() => noAdReward()}
            >
              <View className='flex flex-row gap-2 items-center'>
                <Text className='text-white font-bold text-lg'>Collect 10 coins</Text>
              </View>
            </CustomButton>
          </View>
        </View>

        <View className='h-36 border border-black bg-gray-400 my-5 justify-center flex'>
          <Text>Ad Space</Text>
        </View>

      </BodyView>
    </ScreenView>
  )
}


