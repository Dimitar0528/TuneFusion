import { useState, useCallback } from "react";

export function useTogglePasswordVisibility() {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = useCallback((value = null) => {
        setShowPassword(prev => value !== null ? value : !prev);
    }, []);

    return [showPassword, togglePasswordVisibility];
}
