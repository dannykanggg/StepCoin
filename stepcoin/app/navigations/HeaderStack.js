import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

//import MainBottomNavigation from './MainBottomNavigation'

import StepsScreen from '../screens/StepsScreen'
import CoinHistoryScreen from '../screens/CoinHistoryScreen'



const Stack = createNativeStackNavigator();

function HeaderStack() {


    return (
        <Stack.Navigator
            screenOptions = {{
                headerShown: false
            }}
        >
            <Stack.Screen name="step-screen" component={StepsScreen}/>
            <Stack.Screen name="coin-history" component={CoinHistoryScreen}/>
        </Stack.Navigator>

    )
}


export default HeaderStack;