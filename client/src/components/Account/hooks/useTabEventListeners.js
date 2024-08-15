import { useEffect } from "react";

const useTabEventListeners = (tabsRef, activeTab, setActiveTab, updateUnderline, updateUnderlinePosition) => {
    useEffect(() => {
        const currentRef = tabsRef.current;

        const handleHover = (e) => {
            const hoveredTab = e.currentTarget;
            updateUnderline();
            updateUnderlinePosition(hoveredTab);
        };

        const handleLeave = () => {
            updateUnderline();
        };

        const handleKeyDown = (e) => {
            if (e.code === "Enter") {
                const newTab = e.currentTarget.dataset.target;
                setActiveTab(newTab);
            }
        };

        currentRef.forEach((tab) => {
            if (tab) {
                tab.addEventListener("mouseenter", handleHover);
                tab.addEventListener("mouseleave", handleLeave);
                tab.addEventListener("keydown", handleKeyDown);
            }
        });

        return () => {
            currentRef.forEach((tab) => {
                if (tab) {
                    tab.removeEventListener("mouseenter", handleHover);
                    tab.removeEventListener("mouseleave", handleLeave);
                    tab.removeEventListener("keydown", handleKeyDown);
                }
            });
        };
    }, [activeTab, setActiveTab, updateUnderline, tabsRef, updateUnderlinePosition]);
};

export default useTabEventListeners;
