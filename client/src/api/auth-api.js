import request from "./requester";

const BASE_URL = 'http://localhost:3000/api/auth'


const registerUser = async (userData) => request.post(`${BASE_URL}/register`, userData);

const loginUser = async (userData) => request.post(`${BASE_URL}/login`, userData, 'include');

const logOutUser = () => request.get(`${BASE_URL}/logout`)

const getUserAuthToken = () => request.get(`${BASE_URL}/getToken`)

const sendOTPCode = (userData) => request.post(`${BASE_URL}/sentOTP`, userData)

const authAPI = {
    registerUser,
    loginUser,
    logOutUser,
    getUserAuthToken,
    sendOTPCode
}

export default authAPI;