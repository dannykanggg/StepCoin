import { USER_REGISTER, USER_LOGIN, USER_LOGOUT, USER_UPDATE } from "./userTypes"

const initialState = {
    tasks: [
        {"task": "HTML", 'done': true, 'id': '1'},
        {"task": "HTML", 'done': true, 'id': '1'},
    ]
}




const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_REGISTER: 
            //axios call
            return {
                ...state,
                tasks: {}
            }
        case USER_LOGIN: 
            //axios call 
            return {
                ...state,
            }
        case USER_LOGOUT:
            //axios call
            return {
                ...state
            }
        default:
            return state;
            
    }
}

export default userReducer