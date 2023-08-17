
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { auth } from '../../firebase';

import { 
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider, signInWithCredential
} from 'firebase/auth';



export const userRegister = createAsyncThunk('user/userRegister',
  async(registerData) => {
    const response = await createUserWithEmailAndPassword(auth, registerData.email, registerData.password)
    const user = response.user
    return {email:user.email, token:user.stsTokenManager.accessToken, uid:user.uid, signInMethod: 'password'}
});

export const userLogin = createAsyncThunk('user/userLogin',
  async (loginData) => {
    const userCredential = await signInWithEmailAndPassword(auth, loginData.email, loginData.password)
    const user = userCredential.user
    return {email:user.email, token:user.stsTokenManager.accessToken, uid:user.uid, signInMethod: 'password'}
});


export const googleLogin = createAsyncThunk('user/googleLogin',
  async(idToken) => {
    //create a google credential with the token
    const googleCredential = await GoogleAuthProvider.credential(idToken.idToken)
    //sign in firebase with credential
    const response = await signInWithCredential(auth, googleCredential)
    const { email, oauthIdToken, localId } = response._tokenResponse
    return {email: email, token: oauthIdToken, uid: localId, signInMethod: 'google.com'}
})


export const userLogout = createAsyncThunk('user/userLogout',
  async () => {
    const response = await signOut(auth)
    console.log("userlogout response")
    console.log(response)
    return {}
  }
)


const initialState = {data:{}, error:''};
//data: {email, token, uid}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(userRegister.pending, (state) => {
      state.status='loading'
    })
    builder.addCase(userRegister.fulfilled, (state, action) => {
      state.status = 'fulfilled'
      state.data = action.payload
      state.error = ''
    })
    builder.addCase(userRegister.rejected, (state, action)=> {
      state.status = 'error'
      state.error = action.error.message
    })

    builder.addCase(userLogin.pending, (state) => {
      state.status= 'loading'
    })
    builder.addCase(userLogin.fulfilled, (state,action)=> {
      state.status = 'fulfilled'
      state.data = action.payload
      state.error = ''
    })
    builder.addCase(userLogin.rejected, (state, action) => {
      state.status = 'error'
      state.error = action.error.message
    })

    builder.addCase(googleLogin.pending, (state) => {
      state.status= 'loading'
    })
    builder.addCase(googleLogin.fulfilled, (state,action)=> {
      state.status = 'fulfilled'
      state.data = action.payload
      state.error = ''
    })
    builder.addCase(googleLogin.rejected, (state, action) => {
      state.status = 'error'
      state.error = action.error.message
    })

    builder.addCase(userLogout.pending, (state) => {
      state.status = 'loading'
    })
    builder.addCase(userLogout.fulfilled, (state, action) => {
      state.status = 'fulfilled'
      state.data = {}
    })
    builder.addCase(userLogout.rejected, (state, action) => {
      state.status = 'error'
      state.error = action.error.message
    })
  },
});


//export const selectUser = (state) = state.user
export default userSlice.reducer;


export const userState = (state) => state.user;