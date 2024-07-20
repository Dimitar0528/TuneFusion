import { useEffect } from "react";

const useTabEventListeners = (tabsRef, activeTab, setActiveTab, updateUnderline, updateUnderlinePosition) => {
    useEffect(() => {
        const handleHover = (e) => {
            const hoveredTab = e.currentTarget;
            updateUnderlinePosition(hoveredTab);
        };

        const handleLeave = () => {
            updateUnderline();
        };

        tabsRef.current.forEach((tab) => {
            if (tab) {
                tab.addEventListener("mouseenter", handleHover);
                tab.addEventListener("mouseleave", handleLeave);
                tab.addEventListener("keydown", (e) => {
                    if (e.code === "Enter") setActiveTab(e.currentTarget.dataset.target);
                });
            }
        });

        return () => {
            tabsRef.current.forEach((tab) => {
                if (tab) {
                    tab.removeEventListener("mouseenter", handleHover);
                    tab.removeEventListener("mouseleave", handleLeave);
                    tab.removeEventListener("keydown", (e) => {
                        if (e.code === "Enter")
                            setActiveTab(e.currentTarget.dataset.target);
                    });
                }
            });
        };
    }, [activeTab]);
};

export default useTabEventListeners;
