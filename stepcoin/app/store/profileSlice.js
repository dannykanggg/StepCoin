import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { db, auth } from "../../firebase";
import { doc, setDoc } from "firebase/firestore"; 

import { collection, getDoc, where } from "firebase/firestore";


export const registerWallet = createAsyncThunk('profile/registerWallet', 
    async (uid, {getState}) => {
        const {profile, user} = getState()
        const {balance, last_sync, last_update} = profile.data.wallet

        //set doc in collection 'profile'
        const profileRef = collection(db, "profile");

        const response = await setDoc(doc(profileRef, uid), {
            //uid: uid,
            wallet: {
                balance: balance,
                lastUpdate: last_update
            }
        }, {merge: true})

        //after patching DB, return state
        const currDateTime = new Date().toLocaleString(undefined, {hourCycle:'h24'});
        return {...profile.data, wallet: {...profile.data.wallet, 
            balance: balance,
            last_sync: currDateTime
        }}
    }
)

export const profileLogin = createAsyncThunk('profile/profileLogin',
    async (uid, {getState}) => {
        const {profile} = getState()

        //retrieve data from firestore
        const docRef = doc(db, 'profile', uid)
        const docSnap = await getDoc(docRef)
        const {wallet} = docSnap.data()

        const currDateTime = new Date().toLocaleString(undefined, {hourCycle:'h24'});
        return {...profile.data, wallet: {...profile.data.wallet,
            balance: wallet.balance,
            last_sync: currDateTime,
            last_update: wallet.lastUpdate
        }}
    }
)


export const profileUpdate = createAsyncThunk('profile/profileUpdate',
    // update any profile variables except wallet
    async (newProfileData, {getState}) => {
        //get uid of 
        const {profile, user} = getState()
        const profileData = profile.data
        const userData = user.data
        const {uid} = userData

        //set doc (patch DB)
        const profileRef = collection(db, "profile");

        const response = await setDoc(doc(profileRef, uid), {
            ...profileData,
            ...newProfileData
        }, {merge: true})

        //return profile w/ wallet 
        return {
            ...profileData, 
            ...newProfileData
        }
    }
)


const initialState = {data:{}, error:''};
//{gender, birthday, wallet:{balance,last_update, last_sync}}

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        //initiate wallet for anonymous user & new download
        initWallet : (state) => {
            const currDateTime = new Date().toLocaleString(undefined, {hourCycle:'h24'});
            state.data = {wallet: {
                balance: 0,
                last_update: currDateTime,
                last_sync: currDateTime
            }}
        },
        profileLogout: (state) => {
            state.data = {}
        }
    },
    extraReducers: (builder) => {
        builder.addCase(registerWallet.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(registerWallet.fulfilled, (state, action) => {
            state.status = 'fulfilled'
            state.data = action.payload
            state.error = ''
        })
        builder.addCase(registerWallet.rejected, (state, action) => {
            state.status = 'error'
            state.error = action.error.message
        })

        builder.addCase(profileLogin.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(profileLogin.fulfilled, (state, action) => {
            state.status = 'fulfilled'
            state.data = action.payload
            state.error = ''
        })
        builder.addCase(profileLogin.rejected, (state, action) => {
            state.status = 'error'
            state.error = action.error.message
        })

        builder.addCase(profileUpdate.pending, (state) => {
            state.status = 'pending'
        })
        builder.addCase(profileUpdate.fulfilled, (state, action) => {
            state.status = 'fulfilled'
            state.data = action.payload
            state.error = ''
        })
        builder.addCase(profileUpdate.rejected, (state, action) => {
            state.status = 'error'
            state.data = action.error.message
        })

    }
})


export default profileSlice.reducer;
export const { initWallet, profileLogout } = profileSlice.actions

export const profileState = (state) => state.profile

