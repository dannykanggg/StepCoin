import React,{useContext, useState, useEffect} from 'react'

import { View, Text, ImageBackground, ScrollView, Button } from 'react-native'

import { ScreenView, BodyView } from '../components/view-container/view-container';
import PageHeader from '../components/header/PageHeader';

import { Foundation } from '@expo/vector-icons';

//svg
import MascotBunny from '../assets/mascot/mascot_bunny.svg'
import Tank from '../assets/tank/70.svg'
import Coin from '../assets/coin-icon/09.svg'

import { SimpleButton, CustomButton } from '../components/button/button';

import CircularProgress from 'react-native-circular-progress-indicator';

//redux
import { useDispatch, useSelector } from 'react-redux';
import { userState } from '../store/userSlice';
import { profileState, initWallet } from '../store/profileSlice';
//admob
//import { GAMBannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads'; 

//translations
import { useTranslation } from "react-i18next";

export default function StepsScreen({ navigation }) {
  //redux 
  const dispatch = useDispatch()
  const user = useSelector(userState)
  const profile = useSelector(profileState)

  //initialize anonymous user
  useEffect(() => {
    console.log("user data updated")
    console.log(user)
  },[user])

  //initialize profile
  useEffect(() => {
    console.log("profile updated")
    console.log(profile)
    const {wallet} = profile.data
    if (!wallet) {
      console.log("initiating wallet")
      dispatch(initWallet())
    }
  },[profile])

  //translations
  const { t, i18n } = useTranslation();

  const adReward = () => {
    //userContext.addBalance(60)
  }

  const noAdReward = () => {
    //userContext.addBalance(10)
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
                
                progressValueStyle={{display: 'none'}}
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


