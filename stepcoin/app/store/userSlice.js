
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { auth } from '../../firebase';
import { signInAnonymously, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';


export const userRegister = createAsyncThunk('user/userRegister',
  async(registerData) => {
    const response = await createUserWithEmailAndPassword(auth, registerData.email, registerData.password)
    const user = response.user
    return {email:user.email, token:user.stsTokenManager.accessToken, uid:user.uid}
});


export const userLogin = createAsyncThunk('user/userLogin',
  async (loginData) => {
    const userCredential = await signInWithEmailAndPassword(auth, loginData.email, loginData.password)
    const user = userCredential.user
    return {email:user.email, token:user.stsTokenManager.accessToken, uid:user.uid}
});


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
    //builder.addCase(initAnonymousUser.pending, (state) => {
    //  state.status = 'loading'
    //})
    //builder.addCase(initAnonymousUser.fulfilled, (state, action) => {
    //  state.status = 'fulfilled'
    //  state.data = action.payload
    //  state.error = ''
    //})
    //builder.addCase(initAnonymousUser.rejected, (state, action) => {
    //  state.status = 'error'
    //  state.error = action.error.message
    //})

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