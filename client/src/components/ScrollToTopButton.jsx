import { useState, useEffect } from "react";
import "../styles/index.css";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 700) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <div className="scrollToTop">
      <button
        onClick={scrollToTop}
        className={`scrollButton ${isVisible ? "show" : ""}`}
        title="Scroll to top">
        <i className="ri-arrow-up-line"></i>
      </button>
    </div>
  );
}
