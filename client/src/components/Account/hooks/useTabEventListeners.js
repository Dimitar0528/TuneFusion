import { useEffect } from "react";

const useTabEventListeners = (tabsRef, activeTab, setActiveTab, updateUnderline, updateUnderlinePosition) => {
    useEffect(() => {
        const currentRef = tabsRef.current
        const handleHover = (e) => {
            const hoveredTab = e.currentTarget;
            updateUnderlinePosition(hoveredTab);
        };

        const handleLeave = () => {
            updateUnderline();
        };

        currentRef.forEach((tab) => {
            if (tab) {
                tab.addEventListener("mouseenter", handleHover);
                tab.addEventListener("mouseleave", handleLeave);
                tab.addEventListener("keydown", (e) => {
                    if (e.code === "Enter") setActiveTab(e.currentTarget.dataset.target);
                });
            }
        });

        return () => {
            currentRef.forEach((tab) => {
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
    }, [activeTab, setActiveTab, updateUnderline, updateUnderlinePosition, tabsRef]);
};

export default useTabEventListeners;
