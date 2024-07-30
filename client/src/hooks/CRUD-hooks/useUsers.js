import { useEffect, useState } from "react";
import showToast from "../../utils/showToast";
import userAPI from "../../api/users-api";
export const validateEditAccount = (values) => {
    const errors = {};

    if (!values.name) {
        errors.name = "Username is required";
    } else if (values.name.length < 3) {
        errors.name = "Username must be at least 3 characters long";
    }

    if (!values.first_name) {
        errors.first_name = "First name is required";
    } else if (values.first_name.length < 3) {
        errors.first_name = "First name must be at least 3 characters long";
    }

    if (!values.last_name) {
        errors.last_name = "Last name is required";
    } else if (values.last_name.length < 3) {
        errors.last_name = "Last name must be at least 3 characters long";
    }

    if (!values.email_address) {
        errors.email_address = "Email address is required";
    } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email_address)
    ) {
        errors.email_address = "Invalid email address";
    }

    if (!values.phone_number) {
        errors.phone_number = "Phone number is required";
    } else if (!/^\d{10}$/.test(values.phone_number)) {
        errors.phone_number = "Phone number must be 10 digits";
    }

    return errors;
};

export const validateResetPassword = (values) => {
    const errors = {};

    if (!values.newPassword) {
        errors.newPassword = "New password is required";
    } else if (values.newPassword.length < 8) {
        errors.newPassword = "Password must contain at least 8 characters";
    } else if (!/[A-Z]/.test(values.newPassword)) {
        errors.newPassword = "Password must contain at least one capitalized letter";
    } else if (!/[0-9]/.test(values.newPassword)) {
        errors.newPassword = "Password must contain at least one number";
    }

    if (!values.repeatPassword) {
        errors.repeatPassword = "Repeat password is required";
    } else if (values.newPassword !== values.repeatPassword) {
        errors.repeatPassword = "Passwords do not match";
    }

    return errors;
};
export function useGetAllUsers(refreshFlag) {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        async function getUsers() {
            const response = await fetch("http://localhost:3000/api/users", {
                method: "GET",
                credentials: "include",
            });
            const users = await response.json();
            setUsers(users);
        }
        getUsers();
    }, [refreshFlag]);
    return [users]
}
export function useGetUserDetails(userUUID, refreshFlag) {
    const [user, setUser] = useState({});

    useEffect(() => {

        async function getUserDetails() {
            const result = await userAPI.getUser(userUUID);
            if (result.error) return showToast(`Error: ${result.error}`, "error")
            setUser(result);
        }
        getUserDetails();
    }, [userUUID, refreshFlag]);
    return [user]
}

export function useResetPassword() {
    const resetPasswordHandler = async (userEmail, passwordData, triggerRefreshHandler) => {
        const result = await userAPI.resetUserPassword(userEmail, passwordData)
        result.error ? showToast(`Error: ${result.error}`, "error") : showToast(result.message, 'success');
        triggerRefreshHandler();
    }
    return resetPasswordHandler;
}

export function useEditUser() {
    const editUserHandler = async (userUUID, userData, triggerRefreshHandler) => {
        const result = await userAPI.editUser(userUUID, userData);
        if (result.error) return showToast(`Error: ${result.error}`, "error")
        showToast(result.message, 'success');
        triggerRefreshHandler();
    }
    return editUserHandler;
}

export function useDeleteUser() {
    const deleteUserHandler = async (userUUID, callback) => {
        const result = await userAPI.deleteUser(userUUID)
        if (result.error) return showToast(`Error: ${result.error}`, "error");
        if (typeof callback === "function") {
            callback();
        }
    }
    return deleteUserHandler;
}
