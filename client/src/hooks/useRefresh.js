import { useState, useCallback } from "react";

export const useRefresh = () => {
    const [refreshFlag, setRefreshFlag] = useState(false);

    const triggerRefreshHandler = useCallback(() => {
        setRefreshFlag((prev) => !prev);
    }, []);

    return [refreshFlag, triggerRefreshHandler];
};