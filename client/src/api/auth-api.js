import request from "./requester";

const BASE_URL = 'http://localhost:3000/api/auth'


const registerUser = async (userData) => request.post(`${BASE_URL}/register`, userData);

const loginUser = async (userData) => request.post(`${BASE_URL}/login`, userData, 'include');

const logOutUser = () => request.get(`${BASE_URL}/logout`, undefined, 'include')

const getUserAuthToken = () => request.get(`${BASE_URL}/getToken`, undefined, 'include')


const authAPI = {
    registerUser,
    loginUser,
    logOutUser,
    getUserAuthToken,
}

export default authAPI;