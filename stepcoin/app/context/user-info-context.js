import React, {useState,useEffect, useContext, createContext} from "react"
import axios from 'axios';
import * as SecureStore from 'expo-secure-store'
import uuid from 'react-native-uuid';


//import {process.env.EXPO_PUBLIC_BACKEND_IP} from '@env'

const userInfoContext = createContext({
    loginState: false,
    user: {},
    userProfile: {},

    wallet:{user:'', uuid:'', balance:0},
    setWallet: () => {},


    updateLoginState: () => {},
    updateBalance: () => {},
    addBalance: () => {},
    logout: () => {},

    language: '',
    setLanguage: () => {},

    //device: ''

});


const UserInfoProvider = ({children}) => {
    const [loginState, setLoginState] = useState(false)
    const [user, setUser] = useState({email: ''})
    const [userProfile, setUserProfile] = useState({})
    const [wallet, setWallet] = useState({user:'', uuid:'', balance:0})

    const addBalance = async(val) => {
        setWallet(prev => ({...wallet, balance: prev.balance + val}))

        //if logged in, post transaction
        if (loginState) {
            const token = await SecureStore.getItemAsync('token')
            const config = {headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }}

            axios.post(`${process.env.EXPO_PUBLIC_BACKEND_IP}/api/coins/post-transaction/`,
                {amount: val},
                config
            )
                .then(response => {
                    console.log(`Created transaction: ${val}`)
                })
                .catch(error => {
                    console.log("error posting transaction")
                    console.log(error)
                })
        } else {
            const {uuid} = wallet
            const config = {headers: {'Content-Type': 'application/json',}}
            axios.post(`${process.env.EXPO_PUBLIC_BACKEND_IP}/api/coins/post-guest-transaction/`,
                {amount: val, uuid: uuid},
                config
            )
                .then(response => {
                    console.log(`Created transaction: ${val}`)
                })
                .catch(error => {
                    console.log("error posting transaction")
                    console.log(error)
                })

        }
    }

    const updateBalance = (val) => {
        setWallet({...wallet, balance: val})
    }

    const updateLoginState = async(userData, userProfile, wallet) => {
        if (userData && userProfile && wallet) {
            setUser({loggedIn: true, email: userData.email})
            setUserProfile(userProfile)
            setWallet({user:wallet.user, uuid:wallet.uuid, balance: wallet.balance})
            setLoginState(true)
        }
    }

    const logout = async() => {
        const removeToken = await SecureStore.deleteItemAsync('token')
        //remove login state
        setLoginState(false)
        setUser({email: ''})
        setUserProfile({})
        setWallet({user:'',uuid:'', balance: 0})
        //initiate new wallet
        console.log("logging out. initiating new wallet")
        const uuidValue = uuid.v4();
        const config = {headers: {'Content-Type': 'application/json',}}
        axios.post(`${process.env.EXPO_PUBLIC_BACKEND_IP}/api/coins/initiate-wallet/`,
            {uuid:uuidValue},
            config
        )
        .then(response => {
            //success, store uuid wallet in usecontext
            const {data} = response
            setWallet({user:'', uuid: data.uuid, balance: 0})
            SecureStore.setItemAsync('uuid', uuidValue)
        })
        .catch(error => {
            console.log("error initiating wallet")
        })

    }

    useEffect(() => {
        //check for login
        updateLoginState()
    },[])

    /**    LANGUAGE     */
    const [language, setLanguage] = useState('English')
    useEffect(() => {
        console.log("user context language updated: ", language)
    },[language])

    /**    DEVICE     */
    //const [device, setDevice] = useState('')
    //console.log("get device")

    return (
        <userInfoContext.Provider 
            value={{
                loginState: loginState,
                user: user,
                userProfile: userProfile,
                wallet: wallet,
                setWallet: setWallet,
                
                updateLoginState: updateLoginState,
                updateBalance: updateBalance,
                addBalance: addBalance,
                logout: logout,

                language: language,
                setLanguage: setLanguage,
            }}
        >
            {children}
        </userInfoContext.Provider>
    )
}


export default userInfoContext
export {UserInfoProvider}