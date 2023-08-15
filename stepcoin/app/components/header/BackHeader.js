import React, {useContext, useState} from 'react';
import {Text, View, Button, TouchableOpacity, Platform, Dimensions} from 'react-native'

import { useNavigation } from '@react-navigation/native';

import { CustomButton } from '../button/button';

function BackHeader({page}) {
    const navigation = useNavigation()

    //header height by device/os
    const {height, width} = Dimensions.get('window'); 
    const aspectRatio = height/width;
    //const heightTW = Platform.OS === 'ios' ? 'pt-10' : 'pt-8'
    const heightTW = aspectRatio > 2.1 ? 'pt-14' : 'pt-8'

    return (
        <View className={`flex flex-row items-center justify-between border-b border-black z-50 bg-white ${heightTW}`}>
            <View className='flex pl-4 py-2'>
                <CustomButton 
                    onPress={() => {page ? navigation.navigate(page) : navigation.goBack()}}
                >
                    <Text>Back</Text>
                </CustomButton>
            </View>

            <View className='flex ml-auto pr-4 py-2'>
            </View>
        </View>
    )
}


export default BackHeader;