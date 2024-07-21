import { useState } from "react";
import styles from "./styles/Faq.module.css";

export default function Faq() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <>
      <div className={styles["accordion"]}>
        <div className={styles["accordion-item"]}>
          <div
            onClick={() => toggleAccordion(0)}
            className={`${styles["accordion-item-header"]} ${
              activeIndex === 0 ? styles["active"] : ""
            }`}>
            What makes TuneFusion unique?
          </div>
          <div
            className={`${styles["accordion-item-body"]} ${
              activeIndex === 0 ? styles["active"] : ""
            }`}>
            <div className={styles["accordion-item-body-content"]}>
              TuneFusion stands out by offering a diverse library of music from
              various genres, ensuring there&apos;s something for every
              listener. Our platform provides high-quality audio streaming,
              personalized playlists, and an ad-free experience.
            </div>
          </div>
        </div>
        <div className={styles["accordion-item"]}>
          <div
            onClick={() => toggleAccordion(1)}
            className={`${styles["accordion-item-header"]} ${
              activeIndex === 1 ? styles["active"] : ""
            }`}>
            How can I discover new music on TuneFusion?
          </div>
          <div
            className={`${styles["accordion-item-body"]} ${
              activeIndex === 1 ? styles["active"] : ""
            }`}>
            <div className={styles["accordion-item-body-content"]}>
              Explore new music effortlessly with TuneFusion&apos;s curated
              playlists and personalized recommendations. Our intuitive
              interface allows you to explore different genres, artists, and
              trending tracks easily.
            </div>
          </div>
        </div>
        <div className={styles["accordion-item"]}>
          <div
            onClick={() => toggleAccordion(2)}
            className={`${styles["accordion-item-header"]} ${
              activeIndex === 2 ? styles["active"] : ""
            }`}>
            Can I use TuneFusion offline?
          </div>
          <div
            className={`${styles["accordion-item-body"]} ${
              activeIndex === 2 ? styles["active"] : ""
            }`}>
            <div className={styles["accordion-item-body-content"]}>
              Yes, TuneFusion offers offline listening capabilities. Simply
              download your favorite tracks or playlists to enjoy them offline,
              whether you&apos;re commuting, traveling, or in areas with limited
              internet connectivity.
            </div>
          </div>
        </div>
        <div className={styles["accordion-item"]}>
          <div
            onClick={() => toggleAccordion(3)}
            className={`${styles["accordion-item-header"]} ${
              activeIndex === 3 ? styles["active"] : ""
            }`}>
            How do I create playlists on TuneFusion?
          </div>
          <div
            className={`${styles["accordion-item-body"]} ${
              activeIndex === 3 ? styles["active"] : ""
            }`}>
            <div className={styles["accordion-item-body-content"]}>
              Creating playlists on TuneFusion is easy! Simply browse through
              our extensive catalog, add your favorite songs to a playlist, and
              customize it to suit your mood or occasion. You can also share
              your playlists with friends and discover new music together.
            </div>
          </div>
        </div>
        <div className={styles["accordion-item"]}>
          <div
            onClick={() => toggleAccordion(4)}
            className={`${styles["accordion-item-header"]} ${
              activeIndex === 4 ? styles["active"] : ""
            }`}>
            Is my data secure with TuneFusion?
          </div>
          <div
            className={`${styles["accordion-item-body"]} ${
              activeIndex === 4 ? styles["active"] : ""
            }`}>
            <div className={styles["accordion-item-body-content"]}>
              Protecting your privacy and data security is a top priority at
              TuneFusion. We utilize advanced encryption methods to secure your
              personal information and ensure safe transactions. Your data is
              never shared with third parties without your consent.
            </div>
          </div>
        </div>
        <div className={styles["accordion-item"]}>
          <div
            onClick={() => toggleAccordion(5)}
            className={`${styles["accordion-item-header"]} ${
              activeIndex === 5 ? styles["active"] : ""
            }`}>
            Can I request specific songs or features on TuneFusion?
          </div>
          <div
            className={`${styles["accordion-item-body"]} ${
              activeIndex === 5 ? styles["active"] : ""
            }`}>
            <div className={styles["accordion-item-body-content"]}>
              TuneFusion welcomes feedback and suggestions from users. You can
              submit requests for specific songs or features through our
              customer support or community forums. We strive to enhance our
              platform based on user input to provide the best music streaming
              experience.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
