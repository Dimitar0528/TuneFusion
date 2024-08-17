import { useEffect } from "react";

const useLocalStorage = (key, value) => {
    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);
};

export default useLocalStorage;
