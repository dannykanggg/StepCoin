import React, {useState, useContext, useEffect} from 'react'
import {View, Text, Button, TextInput, KeyboardAvoidingView, Keyboard} from 'react-native'
import tw from 'twrnc'
import axios from 'axios'
//import * as SecureStore from 'expo-secure-store'

//import {process.env.EXPO_PUBLIC_BACKEND_IP} from '@env'


import userInfoContext from '../../context/user-info-context'

import { ScreenView, BodyView } from '../../components/view-container/view-container'
import { PasswordInput } from '../../components/form-input/password-input';
import { BackButton, SimpleButton } from '../../components/button/button';
import LoadingOverlay from '../../components/loadingOverlay'
import { SimpleBanner } from '../../components/banner/banner'

export default function PasswordScreen({route, navigation}) {
    const {email, type} = route.params  //type: login / register
    const userContext = useContext(userInfoContext)
    const uuid = userContext.wallet.uuid

    //form input variables
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')

    //error & loading state
    const [state, setState] = useState({
        loading: false,
        response: null,
        error:null
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

    //error validation
    const [errors, setErrors] = useState({})
    const validateData = (error) => {
        const errors = {};
        if (!password) { errors.password = 'fill in password'}

        if (type==='login') {
            if (error===401) {errors.password = 'wrong password'}
        }

        if (type==='register') {
            if (password.length<6) {errors.password = "password more than 6 char"}
            if (!passwordConfirm) { errors.passwordConfirm = 'fill in password'}
            if (password!==passwordConfirm) {errors.passwordConfirm = "passwords don't match"}
        }
        return errors
    }

    const submitHandler = async() => {
        const errors = validateData();
        if (Object.keys(errors).length){
            setErrors(errors)
            return;
        }
        setErrors({})

        setState({loading:  true, response: null, error: null})

        const config = {headers: {'Content-Type': 'application/json',}}

        //login
        if (type==='login' ) {

            try{
                const response = await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_IP}/api/users/login/`,
                    {   'email': email, 'password': password},
                    config
                )

                const {data, status} = response
                const {user, user_profile, wallet} = data
                const {token} = user
                const userData = (({email, token}) => ({email, token}))(user)

                //set token in securestore
                //const tokenAsync = await SecureStore.setItemAsync('token',token)

                //pass data to context
                userContext.updateLoginState(userData, user_profile, wallet)

                navigation.navigate('steps')
            
            } catch(error) {
                if (error.request.status===401) {
                    const errors = validateData(401);
                    if (Object.keys(errors).length){
                        setErrors(errors)
                        return;
                    }
                    setErrors({})
                } else if (error.request.status===0) {
                    console.log('PasswordScreen.js : backend not open')
                } else {
                    console.log("PasswordScreen.js : error with axios")
                }
                console.log(error)
            }
        } else {
            //register
            try {
                const response = await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_IP}/api/users/register/`,
                    {   'email': email, 'password': password, 'uuid':uuid },
                    config
                )

                const {data} = response
                const {user, user_profile, wallet} = data
                const {token} = user
                const userData = (({email, token}) => ({email, token}))(user)

                //pass data to context
                userContext.updateLoginState(userData, user_profile, wallet)
                //remove uuid token from secure store
                //SecureStore.deleteItemAsync('uuid')
                //set token in securestore
                //const tokenAsync = await SecureStore.setItemAsync('token',token)
                
                navigation.navigate('about-you',{
                    email:email, 
                    token: userData.token
                })
            } catch(error) {
                console.log("error with registration. try again.")
                console.log(error)
            }
        }
        setState({loading: false, response: null, error: null})
    }

    // need stack navigation
    return (
        <ScreenView style={tw` `}>


            <View style={tw`pt-9`}>
                <Button
                    onPress={() => navigation.goBack()}
                    title="Back"
                    color='black'
                />
            </View>


            <BodyView>

                {state.error ? <SimpleBanner status='error' title={state.error} /> : <></>}
                
                <View style={tw`h-60 border border-black w-full`}>
                    <Text>Pic goes here</Text>
                </View>

                <Text style={tw`text-2xl font-bold`}>
                    {type==='login' ? 'Welcome Back' : 'Welcome to StepCoin'}
                </Text>


                <KeyboardAvoidingView>
                    <PasswordInput
                        value={password}
                        onChangeText={setPassword}
                        error={errors.password}
                    />
                </KeyboardAvoidingView>

                { type ==='login' ? <></> : 
                    <KeyboardAvoidingView>
                        <PasswordInput
                            value={passwordConfirm}
                            onChangeText={setPasswordConfirm}
                            title="Confirm password"
                            placeholder="Confirm Password"
                            error={errors.passwordConfirm}
                        />
                    </KeyboardAvoidingView>
                }

                <SimpleButton
                onPress={() => submitHandler()}
                title="Continue"
                />

            </BodyView>
            {/*state.loading && <LoadingOverlay/>*/}

        </ScreenView>
    )
}
