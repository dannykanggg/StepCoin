
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';





export const userLogin = createAsyncThunk(
    'user/userLogin',
    async (loginData) => {
        const config = {headers: {'Content-Type': 'application/json',}}
      const response = await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_IP}/api/users/login/`,
        loginData,
        config
      );
      return response.data;
    },
  );




const initialState = {};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: () => {},
});

export default userSlice.reducer;