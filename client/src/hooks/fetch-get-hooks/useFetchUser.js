import { useState, useEffect } from "react";

const useFetchUserToken = () => {
    const [user, setUser] = useState({
        userUUID: "",
        role: "",
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();

    useEffect(() => {
        const getUserToken = async () => {
            try {
                const response = await fetch(
                    "http://localhost:3000/api/auth/getToken",
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch user token");
                }

                const token = await response.json();
                const userUUID = token.id.slice(0, 6);
                setUser({
                    userUUID,
                    role: token.role,
                });
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        getUserToken();
    }, []);

    return { user, loading, error };
};

export default useFetchUserToken;
