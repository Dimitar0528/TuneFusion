import request from "./requester";

const BASE_URL = 'http://localhost:3000/api/users'

const getAllUsers = () => request.get(BASE_URL);

const getUser = (userUUID) => request.get(`${BASE_URL}/${userUUID}`)

const deleteUser = (userUUID) => request.del(`${BASE_URL}/deleteUser/${userUUID}`)

const editUser = (userUUID, userData) => request.put(`${BASE_URL}/editAccount/${userUUID}`, userData)

const resetUserPassword = (userEmail, passwordData) => request.put(`${BASE_URL}/resetPassword/${userEmail}`, passwordData)

const userAPI = {
    getUser,
    getAllUsers,
    deleteUser,
    editUser,
    resetUserPassword,
}

export default userAPI;