import styles from "./styles/AboutUs.module.css";
export default function AboutUs() {
  return (
    <>
      <div className={styles["we-are-block"]}>
        <div id="about-us-section" className={styles["about-us-section"]}>
          <div className={styles["about-us-image"]}>
            <img
              src="https://www.billboard.com/wp-content/uploads/2020/09/music-streaming-2020-billboard-1548-1601492250.jpg"
              width="808"
              height="458"
              alt="TuneFusion App Image"
              className={styles.img}
            />
          </div>

          <div className={styles["about-us-info"]}>
            <h2>What is TuneFusion?</h2>

            <p>
              TuneFusion is a cutting-edge music player app designed to
              revolutionize the way you listen to and discover music. Our app
              offers a seamless and immersive listening experience for both
              casual listeners and audiophiles. Our mission is to bring the joy
              of music to everyone, with a focus on exceptional user experience
              and innovative features.
            </p>
          </div>
        </div>

        <div id="history-section" className={styles["history-section"]}>
          <div className={styles["history-info"]}>
            <h2>What We Offer</h2>
            <div className={styles["history-image"]}>
              <img
                src="https://media.licdn.com/dms/image/C4E12AQH5d3iDIVB4uA/article-cover_image-shrink_720_1280/0/1633697610814?e=2147483647&v=beta&t=F9xUQrgO_riJ4j4G-r4Rm4SIasfneABMRnmYQkGDB9A"
                width="900"
                height="500"
                alt="TuneFusion Office"
                className={styles.img}
              />
            </div>

            <p>
              TuneFusion provides a comprehensive range of features to satisfy
              all your music listening needs. Whether you&apos;re looking for
              the latest hits, curated playlists, or advanced sound settings,
              TuneFusion has it all! Our app includes personalized
              recommendations, offline listening, and social sharing options to
              enhance your music experience. Join us and discover why TuneFusion
              is the ultimate destination for music lovers worldwide!
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
