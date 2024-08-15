import { useState, useEffect, useRef } from "react";

const useTabs = () => {
    const queryParams = new URLSearchParams(location.search);
    const tab = queryParams.get("tab")
    const [activeTab, setActiveTab] = useState(tab);
    const underlineRef = useRef(null);
    const tabsRef = useRef([]);
    const contentsRef = useRef([]);

    const updateUnderline = () => {
        const activeTabElement = tabsRef.current.find(
            (tab) => tab.dataset.target === activeTab
        );
        if (activeTabElement && underlineRef.current) {
            underlineRef.current.style.width = `${activeTabElement.offsetWidth}px`;
            underlineRef.current.style.left = `${activeTabElement.offsetLeft}px`;
        }
    };
    useEffect(() => {
        updateUnderline();
        window.addEventListener("resize", updateUnderline);
        return () => window.removeEventListener("resize", updateUnderline);
    },);

    return {
        activeTab,
        setActiveTab,
        underlineRef,
        tabsRef,
        contentsRef,
        updateUnderline
    };
};

export default useTabs;
