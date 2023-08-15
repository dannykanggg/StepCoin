import React, {useContext, useState} from 'react';
import {Text, View, Button, TouchableOpacity, Platform, Dimensions} from 'react-native'

import { useNavigation } from '@react-navigation/native';
import { useTranslation } from "react-i18next";

import { Entypo } from '@expo/vector-icons';

import ModalContainer from '../modal-container/ModalContainer';
import LanguageSelect from '../form-input/language-select';

import { CustomButton } from '../button/button';

function PageHeader({}) {
    //language selection
    const { t, i18n } = useTranslation();

    //user info

    const [modalVisible, setModalVisible] = useState(false)

    const navigation = useNavigation()

    //header height by device/os
    const {height, width} = Dimensions.get('window'); 
    const aspectRatio = height/width;
    //const heightTW = Platform.OS === 'ios' ? 'pt-10' : 'pt-8'
    const heightTW = aspectRatio > 2.1 ? 'pt-14' : 'pt-8'

    const receiveLanguage = (language) => {
        //set language in redux
        
        //pass language selection to i18n
        i18n.changeLanguage(language.value);
        //clsoe modal
        setModalVisible(false)
    }

    return (
        <View className={`flex flex-row items-center justify-between border-b border-black z-50 bg-white ${heightTW}`}>
            <View className={`flex pl-4 py-2`}>
                <CustomButton 
                    onPress={() => {setModalVisible(true)}}
                >
                    <Entypo name="globe" size={24} color="blue" />
                </CustomButton>
            </View>

            <View className={`flex ml-auto pr-4 py-2`}>
                <TouchableOpacity
                    className={`rounded-full py-1 px-2 bg-green-600 shadow-md`}
                    onPress={() => navigation.navigate('coin-history')}
                >
                    <Text className={`text-white font-bold`}>
                        000 Coins
                    </Text>
                </TouchableOpacity>
            </View>

            <ModalContainer isVisible={modalVisible} setIsVisible={setModalVisible}>
                <View>
                    <Text>Select Language</Text>

                    <LanguageSelect 
                        selectHandler={receiveLanguage}
                        devaultValue='English' //change later to variable
                    />

                </View>

            </ModalContainer>

        </View>
    )
}


export default PageHeader;