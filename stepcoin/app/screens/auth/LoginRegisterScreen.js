import React, {useState, useEffect} from 'react'
import {View, Text, Button, KeyboardAvoidingView, TextInput} from 'react-native'
import tw from 'twrnc'
//import Constants from "expo-constants";
import axios from 'axios'

//import {process.env.EXPO_PUBLIC_BACKEND_IP} from '@env'

import { ScreenView, BodyView } from '../../components/view-container/view-container'
import { EmailInput } from '../../components/form-input/email-input';
import { SimpleButton, CustomButton } from '../../components/button/button';
import { isEmailValid } from '../../helpers/input-validations';
import { SimpleBanner } from '../../components/banner/banner'

import BackHeader from '../../components/header/BackHeader'
//import GoogleSignIn from '../../components/social-auth/GoogleSignIn'
import LoadingOverlay from '../../components/loadingOverlay'

import MascotBunny from '../../assets/mascot/mascot_bunny.svg'


export default function LoginRegisterScreen({navigation}) {
    //error&loading state
    const [state, setState] = useState({
        loading: false,
        response: null,
        error: null
    })

    const [email, setEmail] = useState('')
    
    //error validation
    const [errors, setErrors] = useState({})
    const validateData = () => {
        const errors = {};
        if (!email) { errors.email = 'fill in email'}
        if (!isEmailValid(email)) {errors.email='Email is invalid'}

        return errors
    }

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


    const handleSubmit = async() => {

        //validation
        const errors = validateData();
        if (Object.keys(errors).length) {
            setErrors(errors)
            return;
        }
        setErrors({})

        //loading state
        setState({ loading: true, response: null, error: null})

        //get ip address of running app
        //const { manifest } = Constants;
        //const api = (typeof manifest.packagerOpts === `object`) && manifest.packagerOpts.dev
        //    ? manifest.debuggerHost.split(`:`).shift().concat(`:3000`)
        //    : `api.example.com`;

        // check if email is in DB
        const config = {headers: {'Content-type': 'Application/json', Accept: 'Application/json'}}
        console.log(process.env.EXPO_PUBLIC_BACKEND_IP)
        axios.get(`${process.env.EXPO_PUBLIC_BACKEND_IP}/api/users/check-user-exists/${email}`, config)
            .then(res => {
                const {data, status} = res

                //user exists, login
                if (data['user-exists']==='true') {
                    setState({ loading: false, response: null, error: null })
                    //navigate to login
                    navigation.navigate('password',{
                        email:email,
                        type:'login'
                    })
                } else {
                //no user, navigate to register
                    setState({ loading: false, response: null, error: null })
                    //navigate to register
                    navigation.navigate('password',{
                        email:email,
                        type:'register'
                    })
                }
            })
            .catch(error => {
                //add alert for error?
                console.log("LoginRegisterScreen.js : error connecting axios")
                console.log(error)
                console.log(Object.keys(error))
                console.log(error.response)
                console.log(error.name)
                console.log(error.code)
                console.log(error.message)
                setState({ loading: false, response: null, error: "error connecting to axios" })
            })

    }

    return (
        <ScreenView style={tw``}>
            <BackHeader page='steps'/>

            <BodyView>
                {state.error ? <SimpleBanner status='error' title={state.error} /> : <></>}

                <View style={tw`my-8 flex justify-center items-center`}>
                    <MascotBunny width={300} height={300} />
                </View>

                <Text style={tw`text-2xl font-bold`}>
                    Login or Register
                </Text>

                <View style={tw`w-full flex flex-col gap-3`}>

                    <SimpleButton 
                        title="Continue with Apple"
                    />
                    <SimpleButton 
                        title="Continue with Google"
                    />
                </View>

                <View style={tw`flex flex-row w-full gap-2`}>
                    <Text>OR</Text>
                </View>

                <KeyboardAvoidingView style={tw`my-3 flex flex-col gap-10 w-full`}>
                    <EmailInput
                        value={email}
                        onChangeText={setEmail}
                        error={errors.email}
                    />
                </KeyboardAvoidingView>

                <View className='px-3 my-3'>
                    <CustomButton 
                        className = 'h-10 flex justify-center items-center bg-azure rounded-full'
                        onPress={() => handleSubmit()}
                    >
                        <Text className='font-bold text-white text-lg'>Continue</Text>
                    </CustomButton>
                </View>
            </BodyView> 

            {state.loading && <LoadingOverlay/>}

        </ScreenView>
    )
}
