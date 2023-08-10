import * as React from 'react';
import {StyleSheet, View, Text, SafeAreaView} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import Ionicons from 'react-native-vector-icons/Ionicons';

import HeaderStackNav from './HeaderStack';

// screens
import StepsScreen from '../screens/StepsScreen'
import RedeemScreen from '../screens/RedeemScreen'
import AccountScreen from '../screens/auth/AccountScreen'

import CoinHistoryScreen from '../screens/CoinHistoryScreen'



const Tab = createBottomTabNavigator()

function MainBottomTab() {
  return (
        <Tab.Navigator
            initialRouteName='steps'
            screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                    let iconName;
                    let rn = route.name;
                    
                    if (rn === 'steps') {
                        iconName = focused ? 'walk' : 'walk-outline'
                    } else if (rn === 'redeem') {
                        iconName = focused ? 'wallet' : 'wallet-outline'
                    } else if (rn === 'account') {
                        iconName = focused ? 'person' : 'person-outline'
                    }
                    // You can return any component that you like here!
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: "tomato",
                tabBarLabelStyle: {
                    paddingBottom: 10,
                    fontSize: 10
                },
                tabBarStyle: {
                    padding: 10,
                    height: 90
                }
            })}
        >
            <Tab.Screen name="steps" component={HeaderStackNav} options={{headerShown: false}}/>
            <Tab.Screen name="redeem" component={RedeemScreen} options={{headerShown: false}}/>
            <Tab.Screen name='account' component={AccountScreen} options={{headerShown: false}}/>
            
            
        </Tab.Navigator>
  )
}

export default MainBottomTab;
