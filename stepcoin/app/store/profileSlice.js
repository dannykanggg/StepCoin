import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { db, auth } from "../../firebase";
import { doc, setDoc } from "firebase/firestore"; 

import { collection, getDoc, addDoc} from "firebase/firestore";


export const registerWallet = createAsyncThunk('profile/registerWallet', 
    async (uid, {getState}) => {
        const {profile, user} = getState()
        const {balance, lastSync, lastUpdate} = profile.data.wallet

        //set doc in collection 'profile'
        const profileRef = collection(db, "profile");

        const response = await setDoc(doc(profileRef, uid), {
            //uid: uid,
            wallet: {
                balance: balance,
                lastUpdate: lastUpdate
            }
        }, {merge: true})

        //after patching DB, return state
        const currDateTime = new Date().toLocaleString(undefined, {hourCycle:'h24'});
        return {...profile.data, wallet: {...profile.data.wallet, 
            balance: balance,
            lastSync: currDateTime
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
            lastSync: currDateTime,
            lastUpdate: wallet.lastUpdate
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


export const addTransaction = createAsyncThunk('profile/addTransaction',
    //assumes signed in

    //add transaction to server & update wallet
    async (transactionData, {getState, rejectWithValue}) => {
        const {profile, user} = getState()
        const profileData = profile.data
        const userData = user.data

        const {email, uid} = userData
        const {wallet} = profileData
        if (!email) {
            return rejectWithValue('user not logged in')
        }
        
        //set doc - Transaction
        const transactionRef = collection(db, 'transactions');
        const currDateTime = new Date().toLocaleString(undefined, {hourCycle:'h24'});
        
        //send transaction to server
        const transactionResponse = await addDoc(transactionRef, {
            email: email,
            amount: transactionData.amount,
            type: transactionData.type,
            timestamp: currDateTime
        })

        //if transaction succeeds, add to wallet & send new balance back
        const {id} = transactionResponse
        let newBalance;
        if (id) {
            newBalance = wallet.balance + transactionData.amount
            const profileRef = collection(db, "profile");
            try {
                const response = await setDoc(doc(profileRef, uid), {
                    wallet: {
                        balance: newBalance,
                        lastUpdate: currDateTime
                    }
                }, {merge: true})
            } catch(error) {
                //if wallet update fails, roll back transaction as well.
                console.log("error updating wallet. rollback transaction")
                return rejectWithValue("updating wallet failed.")
            }
        } else {
            return rejectWithValue("transaction failed.")
        }

        //everything succeeded. add changes to redux
        return {...profileData, wallet: {
            balance: newBalance,
            lastUpdate: currDateTime,
            lastSync: currDateTime
        }}
    }
)



const initialState = {data:{}, error:''};
//{gender, birthday, wallet:{balance,lastUpdate, lastSync}}

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        //initiate wallet for anonymous user & new download
        initWallet : (state) => {
            const currDateTime = new Date().toLocaleString(undefined, {hourCycle:'h24'});
            state.data = {wallet: {
                balance: 0,
                lastUpdate: currDateTime,
                lastSync: currDateTime
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
            state.error = action.error.message
        })

        builder.addCase(addTransaction.pending, (state) => {
            state.status = 'pending'
        })
        builder.addCase(addTransaction.fulfilled, (state, action) => {
            state.status = 'fulfilled'
            state.data = action.payload
            state.error = ''
        })
        builder.addCase(addTransaction.rejected, (state, action) => {
            state.status = 'error'
            state.error = action.payload
        })

    }
})


export default profileSlice.reducer;
export const { initWallet, profileLogout } = profileSlice.actions

export const profileState = (state) => state.profile

