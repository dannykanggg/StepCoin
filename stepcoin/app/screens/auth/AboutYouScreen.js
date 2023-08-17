import React,{useEffect, useState, useContext} from 'react'

import {View,Text, Button, SafeAreaView, TextInput} from 'react-native'


//render components
import { ScreenView, BodyView } from '../../components/view-container/view-container'
import GenderSelect from '../../components/form-input/gender-select'
import BirthdayInput from '../../components/form-input/birthday-input'
import { SimpleButton } from '../../components/button/button'
import LoadingOverlay from '../../components/loadingOverlay'
import { SimpleBanner } from '../../components/banner/banner'


//redux
import { useDispatch } from 'react-redux'
import { profileUpdate } from '../../store/profileSlice'

const AboutYouScreen = ({route,navigation}) => {
    //redux
    const dispatch = useDispatch();
    
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

        //update data preprocess
        const birthdayString = `${birthday.day}/${birthday.month}/${birthday.year}`
        const newProfileData = {birthday:birthdayString, gender:gender.label}

        //perform dispatch
        const response = await dispatch(profileUpdate(newProfileData))

        const {error} = response
        if (error) {
            setState({...state, loading: false, error: 'something went wrong. try again.'})
        } else {
            setState({ loading: false, response: null, error: null})
            navigation.navigate('steps')
        }
    }

    // need stack navigation
    return (
        <>
        <ScreenView className='px-2 py-14'>
            {state.error ? <SimpleBanner status='error' title={state.error} /> : <></>}


            <View className='py-9'>
                <Text className='text-2xl font-bold'>
                    About You
                </Text>
            </View>

            <BodyView>
                <View className='flex flex-col gap-3 w-full pb-8'>
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
        </ScreenView>
        {state.loading && <LoadingOverlay/>}
        </>

    )
}

export default AboutYouScreen