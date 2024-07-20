import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function useUserDetailsFetch(userUUID) {
    const [user, setUser] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        async function getUser() {
            const response = await fetch(
                `http://localhost:3000/api/users/${userUUID}`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            if (response.status === 404) {
                navigate("/");
            }
            const data = await response.json();
            setUser(data);
        }
        getUser();
    }, [userUUID]);
    return { user }
}