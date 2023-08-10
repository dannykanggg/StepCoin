import { USER_REGISTER, USER_LOGIN, USER_LOGOUT, USER_UPDATE } from "./userTypes"


export const userRegister = (userData) => ({
    type: USER_REGISTER,
    payload: userData
})


export const userLogin = (userData) => ({
    type: USER_LOGIN,
    payload: userData
})

export const userLogout = () => ({
    type: USER_LOGOUT
})

export const userUpdate = (userData) => ({
    type: USER_UPDATE,
    payload: userData
})


 