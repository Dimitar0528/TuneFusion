import { useEffect, useState } from "react";

import authAPI from "../../api/auth-api";
import showToast from "../../utils/showToast";
import extractUUIDPrefix from "../../utils/extractUUIDPrefix";

export const validateSignUp = (values) => {
    const newErrors = {};
    const { name, email, password } = values;

    if (!name) newErrors.name = "Name is required.";
    if (!email) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid.";
    if (!password) newErrors.password = "Password is required.";
    else if (password.length < 8)
        newErrors.password = "Password must be at least 8 characters.";
    else if (!/[A-Z]/.test(password))
        newErrors.password =
            "Password must contain at least 1 capitalized letter";
    else if (!/[0-9]/.test(password))
        newErrors.password = "Password must contain at least 1 number";

    return newErrors;
};

export const validateSignIn = (values) => {
    const newErrors = {};
    const { name, password } = values;

    if (!name) newErrors.name = "Name is required.";
    if (!password) newErrors.password = "Password is required.";

    return newErrors;
};

export function useRegisterUser() {
    const registerUserHandler = async (userData) => {
        const result = await authAPI.registerUser(userData);
        if (result.error) return showToast(`Error: ${result.error}`, "error")
        localStorage.setItem("email", userData.email);

        location.href = "/sign-in/otp";
        // location.href = '/sign-in'
    }
    return registerUserHandler;
}

export function useLoginUser() {
    const loginUserHandler = async (userData) => {
        const result = await authAPI.loginUser(userData);
        if (result.error) return showToast(`Error: ${result.error}`, "error");
        const { user_uuid } = result;
        location.href = `/musicplayer/${user_uuid.slice(0, 6)}`;
    }
    return loginUserHandler;
}

export function useLogoutUser() {
    const logoutUserHandler = async (callback) => {
        await authAPI.logOutUser();
        if (typeof callback === "function") {
            callback();
        }
    }
    return logoutUserHandler;
}

export function useGetUserAuthToken() {
    const [user, setUser] = useState({
        userUUID: "",
        role: "",
    });
    useEffect(() => {
        const getUserToken = async () => {
            const result = await authAPI.getUserAuthToken();
            const userUUID = extractUUIDPrefix(result.id)
            setUser({
                userUUID,
                role: result.role,
            });

        };

        getUserToken();
    }, []);
    return [user]
}