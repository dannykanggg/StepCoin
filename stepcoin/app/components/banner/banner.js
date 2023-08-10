import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Text, View, Button, Image} from 'react-native'
import Animated, {withSpring, useAnimatedStyle, useSharedValue} from 'react-native-reanimated'
import { AntDesign } from '@expo/vector-icons';

import { Banner } from 'react-native-paper';
import { CustomButton } from '../button/button';

export function SimpleBanner({status, title, ...props}) {

    const [isVisible, setIsVisible] = useState(true)

    const offsets = [-60, 0]        //[hidden, appeared]
    const [offset, setOffset] = useState(offsets[0])


    useEffect(() => {
        if (isVisible) {
            setOffset(offsets[1])
            setTimeout(() => {
                setIsVisible(false)
            }, 3000);
        } else {
            setOffset(offsets[0])
        }
    },[isVisible])

    const customSpringStyles = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: withSpring(offset, {
                damping: 20,
                stiffness:90
            })}]
        }
    })

    return (
        <Animated.View style={customSpringStyles}>
            <Banner visible={isVisible}>
                <View className='flex flex-row w-full'>
                    <Text fontSize="lg" color="coolGray.800">
                        {title}
                    </Text>
                    <View className='ml-auto'>
                        <CustomButton 
                            onPress = {() => setIsVisible(false)}
                        >
                            <AntDesign name="close" size={24} color="black" />
                        </CustomButton>
                    </View>
                </View>
            </Banner>
        </Animated.View>
    )
}
