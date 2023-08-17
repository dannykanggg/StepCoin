import React, {useState, useEffect} from 'react'
import {View, Text, Button, KeyboardAvoidingView, TextInput} from 'react-native'

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
import { userLogin, googleLogin, userRegister, userState } from '../../store/userSlice'
import { profileState, registerWallet, profileLogin } from '../../store/profileSlice'

import {GoogleAuthProvider, signInWithCredential, fetchSignInMethodsForEmail } from "firebase/auth"


import "expo-dev-client"
import {GoogleSignin} from '@react-native-google-signin/google-signin'
import { auth } from '../../../firebase';


export default function LoginRegisterScreen({navigation}) {
    //friebase
    GoogleSignin.configure({
        webClientId: "857409291032-5jkcg5cg0i7v8n1v7m1me1s7b7uovd8j.apps.googleusercontent.com",
        scopes: ['email']
    })

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


    const handleGoogle = async() => {
        //loading state

        //get the user id token
        const userInfo = await GoogleSignin.signIn()
        const {idToken, user} = userInfo

        setState({loading:  true, response: null, error: null})

        //check if user email already has another sign in 
        const {email} = user
        const signInList = await fetchSignInMethodsForEmail(auth, email)

        //if account has email/password, prevent google login
        if (signInList.includes('password')) {
            setState({loading:  false, response: null, error: "Use Password to Login"})
            return;
        }
        
        const response = await dispatch(googleLogin({idToken: idToken}))
        const {error, payload} = response
        if (payload) {
            //get user Profile information
            const {uid} = payload
            //get user profile
            dispatch(profileLogin(uid))

            //navigate to steps screen
            navigation.navigate('steps')
        } else {
            setState({...state, error: 'Network Error. Try again'})
        }
        setState({loading: false, response: null, error: null})
    }


    const handleSubmit = async() => {
        //validation
        const errors = validateData();
        if (Object.keys(errors).length) {
            setErrors(errors)
            return;
        }
        setErrors({})

        //loading state
        setState({loading:  true, response: null, error: null})

        //check for any current email
        try {
            const signInList = await fetchSignInMethodsForEmail(auth, email)
            //google.com OR password OR null
            console.log("this is sign in list")
            console.log(signInList)

            //if "password" is in signInList, then email user exists. login
            if (signInList.includes('password')) {
                const response = await dispatch(userLogin({email:email, password:password}))
                const {error, payload} = response
                if (payload) {
                    //get user Profile information
                    const {uid} = payload
                    dispatch(profileLogin(uid))
        
                    //navigate to steps screen
                    navigation.navigate('steps')
                } else if (error.code.includes('wrong-password')) {
                    //wrong password handler
                    setErrors({...errors, password: 'wrong password'})
                } else {
                    setState({...state, error: 'Network Error. Try again'})
                }
            }
            // if list is empty, register new user
            else if (signInList.length === 0) {
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
            //if other login exists, try creating password?
            else {
                //different error
                setState({...state, error: "Email already registered with Gmail."})
            }
        } catch(error) {
            console.log("Error. please try again.")
        }
        setState({loading: false, response: null, error: null})
    }



    return (
        <>
        <ScreenView >
            <BackHeader page='steps'/>

            <BodyView className=''>
                {state.error ? <SimpleBanner status='error' title={state.error} /> : <></>}

                <View className='my-8 flex justify-center items-center'>
                    <MascotBunny width={250} height={250} />
                </View>

                <Text className='text-2xl font-bold'>
                    Login or Register
                </Text>

                <View className='w-full flex flex-col gap-3 my-2'>
                    <CustomButton 
                        className = 'h-10 flex justify-center items-center bg-azure rounded-full'
                        onPress={() => handleSubmit()}
                    >
                        <Text className='font-bold text-white text-lg'>Continue With Apple</Text>
                    </CustomButton>
                    <CustomButton 
                        className = 'h-10 flex justify-center items-center bg-azure rounded-full'
                        onPress={() => handleGoogle()}
                    >
                        <Text className='font-bold text-white text-lg'>Continue With Google</Text>
                    </CustomButton>
                </View>

                <View className='flex flex-row w-full gap-2'>
                    <Text>OR</Text>
                </View>

                <View className='w-full px-2'>
                    <KeyboardAvoidingView className='w-full'>
                        <EmailInput
                            value={email}
                            onChangeText={setEmail}
                            error={errors.email}
                        />
                    </KeyboardAvoidingView>
                </View>
                <View className='w-full px-2'>
                    <KeyboardAvoidingView className='w-full'>
                        <PasswordInput
                            value={password}
                            onChangeText={setPassword}
                            error={errors.password}
                        />
                    </KeyboardAvoidingView>
                </View>

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
        </ScreenView>
        {state.loading && <LoadingOverlay/>}
        </>
    )
}
