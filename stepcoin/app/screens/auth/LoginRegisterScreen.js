import React, {useState, useEffect} from 'react'
import {View, Text, Button, KeyboardAvoidingView, TextInput} from 'react-native'
//import Constants from "expo-constants";


//import {process.env.EXPO_PUBLIC_BACKEND_IP} from '@env'

import { ScreenView, BodyView } from '../../components/view-container/view-container'
import { EmailInput } from '../../components/form-input/email-input';
import { PasswordInput } from '../../components/form-input/password-input'
import { SimpleButton, CustomButton } from '../../components/button/button';
import { isEmailValid } from '../../helpers/input-validations';
import { SimpleBanner } from '../../components/banner/banner'

import BackHeader from '../../components/header/BackHeader'
//import GoogleSignIn from '../../components/social-auth/GoogleSignIn'
import LoadingOverlay from '../../components/loadingOverlay'

import MascotBunny from '../../assets/mascot/mascot_bunny.svg'

//redux & firestore
import { useSelector, useDispatch } from 'react-redux'
import { userLogin, userRegister, userState } from '../../store/userSlice'
import { profileState, registerWallet, profileLogin } from '../../store/profileSlice'
import { collection, query, where } from "firebase/firestore";

import { auth } from '../../../firebase';


export default function LoginRegisterScreen({navigation}) {
    //redux 
    const dispatch = useDispatch()
    const user = useSelector(userState)
    const profile = useSelector(profileState)

    //error&loading state
    const [state, setState] = useState({
        loading: false,
        response: null,
        error: null
    })

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    
    //error validation
    const [errors, setErrors] = useState({})
    const validateData = () => {
        const errors = {};
        if (!email) { errors.email = 'fill in email'}
        if (!isEmailValid(email)) {errors.email='Email is invalid'}
        if (!password) { errors.password = 'fill in password'}
        if (password.length<6) {errors.password="password must be more than 6 characters"}

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
        
        setState({loading:  true, response: null, error: null})
        //register dispatch
        const response = await dispatch(userLogin({email:email, password:password}))
        const {error, payload} = response
        
        // login success handler
        if (payload) {
            //get user Profile information
            const {uid} = payload
            dispatch(profileLogin(uid))

            //navigate to steps screen
            navigation.navigate('steps')
        } else if (error.code.includes('wrong-password')) {
            //wrong password handler
            setErrors({...errors, password: 'wrong password'})
        }  
        else if (error.code.includes('user-not-found')) {
            //no user. register handler
            console.log("new user register")
            //register dispatch
            dispatch(userRegister({email:email, password:password}))
                .then(response => {
                    const {payload} = response
                    const {uid} = payload
                    //get uid & register wallet
                    dispatch(registerWallet(uid))
                    
                    //route to about you
                    navigation.navigate('about-you')
                })
                .catch(error => {
                    console.log("user register error")
                    //add banner?
                    setState({...state, error: "Error registering user. Try again later."})
                })
        }
        //all fail. set network error
        else {
            setState({...state, error: 'Network Error'})
        }

        setState({loading: false, response: null, error: null})
    }

    return (
        <ScreenView >
            <BackHeader page='steps'/>

            <BodyView>
                {state.error ? <SimpleBanner status='error' title={state.error} /> : <></>}

                <View className='my-8 flex justify-center items-center'>
                    <MascotBunny width={250} height={250} />
                </View>

                <Text className='text-2xl font-bold'>
                    Login or Register
                </Text>

                <View className='w-full flex flex-col gap-3'>

                    <SimpleButton 
                        title="Continue with Apple"
                    />
                    <SimpleButton 
                        title="Continue with Google"
                    />
                </View>

                <View className='flex flex-row w-full gap-2'>
                    <Text>OR</Text>
                </View>

                <KeyboardAvoidingView className='my-2 flex flex-col gap-10 w-full'>
                    <EmailInput
                        value={email}
                        onChangeText={setEmail}
                        error={errors.email}
                    />
                </KeyboardAvoidingView>
                <KeyboardAvoidingView className='my-2 flex flex-col gap-10 w-full'>
                    <PasswordInput
                        value={password}
                        onChangeText={setPassword}
                        error={errors.password}
                    />
                </KeyboardAvoidingView>

                <View>
                    <Text>Reset Password</Text>
                </View>

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
