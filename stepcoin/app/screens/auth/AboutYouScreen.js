import React,{useEffect, useState, useContext} from 'react'

import {View,Text, Button, SafeAreaView, TextInput} from 'react-native'
import tw from 'twrnc'
import axios from 'axios'
//import * as SecureStore from 'expo-secure-store'

//import {process.env.EXPO_PUBLIC_BACKEND_IP} from '@env'

import userInfoContext from '../../context/user-info-context'

import { ScreenView, BodyView } from '../../components/view-container/view-container'
import GenderSelect from '../../components/form-input/gender-select'
import BirthdayInput from '../../components/form-input/birthday-input'
import { SimpleButton } from '../../components/button/button'
import LoadingOverlay from '../../components/loadingOverlay'
import { SimpleBanner } from '../../components/banner/banner'


const AboutYouScreen = ({route,navigation}) => {
    const {email, token} = route.params
    const userContext = useContext(userInfoContext)
    
    //error&loading state
    const [state, setState] = useState({
        loading: false,
        response: null,
        error: null
    })

    // if takes long, set network error
    useEffect(() => {
        if (state.loading) {
            setTimeout(() => {
                if (state.loading) {
                    setState({ loading: false, response: null, error: 'network error. try again' })
                }
            },20000)    // 10 seconds
        }
    },[state])




    const [birthday, setBirthday] = useState({month:1, day: 1, year: new Date().getFullYear()})

    const genderOptions = ['Male','Female']
    const [gender, setGender] = useState(genderOptions[0])


    //error validation
    const [errors, setErrors] = useState({})
    const validateData = () => {
        const errors = {}
        if (!birthday) {errors.birthday='required field'}
        if (!gender) {errors.gender = 'required field'}

        //check if age under 13
        return errors
    }


    const submitHandler = async() => {
        const errors = validateData();
        if (Object.keys(errors).length) {
            setErrors(errors)
            return;
        }
        setErrors({})
 
        //loading state on
        setState({ loading: true, response: null, error: null})


        //const userData = await  SecureStore.getItemAsync('userData')
        //const {email, token} = userData

        if (token) {
            const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`} }
            axios.patch(`${process.env.EXPO_PUBLIC_BACKEND_IP}/api/users/update/`,
                {
                    'gender': gender,
                    'birthday': `${birthday.year}-${birthday.month}-${birthday.day}`
                },
                config
            )
                .then(response => {
                    console.log("heres response")
                    console.log(response.data)

                    const {data} = response
                    const {user, user_profile, wallet} = data
                    const {token} = user
                    const userData = (({email, token}) => ({email, token}))(user)

                    //update login
                    userContext.updateLoginState(userData, user_profile, wallet)

                    //navigate to next page
                    navigation.navigate('steps')
                })
                .catch(error => {
                    console.log("here is error")
                    console.log(error)
                })
        } else {
            console.log("no credentials error. navigate back to register screen")
            //navigate back to email w/ alert
            navigation.navigate('login-register')
        }
        //loading state on
        setState({ loading: false, response: null, error: null})
    }

    // need stack navigation
    return (
        <ScreenView style={tw` px-2 py-14`}>
            {state.error ? <SimpleBanner status='error' title={state.error} /> : <></>}


            <View style={tw`py-9`}>
                <Text style={tw`text-2xl font-bold`}>
                    About You
                </Text>
            </View>

            <BodyView>
                <View style={tw`flex flex-col gap-3 w-full pb-8`}>
                    <Text>Birthday</Text>
                    <BirthdayInput
                        birthday={birthday}
                        setBirthday={setBirthday}
                    />
                    
                    <Text>Gender</Text>
                    <GenderSelect 
                        genderOptions={genderOptions}
                        gender={gender}
                        //onChange = {v => setGender(v)}
                        setGender = {setGender}
                    />
                </View>

                <SimpleButton
                    onPress={() => submitHandler()}
                    title="Finish"
                />
            </BodyView>
            {/*state.loading && <LoadingOverlay/>*/}
        </ScreenView>
    )
}

export default AboutYouScreen