import { useState, useEffect, useRef } from "react";

const useTabs = () => {
    const [activeTab, setActiveTab] = useState('Account');
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
    }, [activeTab]);

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
