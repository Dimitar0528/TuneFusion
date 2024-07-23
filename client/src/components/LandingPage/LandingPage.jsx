import { useEffect } from "react";
import ScrollReveal from "scrollreveal";
import Swiper from "swiper/bundle";
import styles from "./styles/LandingPage.module.css";
import GenreCard from "./SubComponents/GenreCard";
import FeatureCard from "./SubComponents/FeatureCard";
import ClientCard from "./SubComponents/ClientCard";
import { Link, useNavigate } from "react-router-dom";
export default function LandingPage({ userUUID }) {
  const navigate = useNavigate();
  useEffect(() => {
    const scrollRevealOption = {
      distance: "50px",
      origin: "bottom",
      duration: "1000",
    };

    ScrollReveal().reveal(`.${styles["header__image"]} img`, {
      ...scrollRevealOption,
      origin: "right",
    });
    ScrollReveal().reveal(`.${styles["header__container"]} h1`, {
      ...scrollRevealOption,
      delay: 500,
    });
    ScrollReveal().reveal(
      `.${styles["header__content"]} .${styles["section__description"]}`,
      {
        ...scrollRevealOption,
        delay: 1000,
      }
    );
    ScrollReveal().reveal(`.${styles["header__btns"]}`, {
      ...scrollRevealOption,
      delay: 1500,
    });
    ScrollReveal().reveal(`.${styles["header__stats"]}`, {
      ...scrollRevealOption,
      delay: 2000,
    });
    ScrollReveal().reveal(`.${styles["genre__card"]}`, {
      ...scrollRevealOption,
      interval: 500,
    });
    ScrollReveal().reveal(`.${styles["feature__image"]} img`, {
      ...scrollRevealOption,
      origin: "right",
    });
    ScrollReveal().reveal(
      `.${styles["feature__content"]} .${styles["section__header"]}`,
      {
        ...scrollRevealOption,
        delay: 500,
      }
    );
    ScrollReveal().reveal(`.${styles["feature__list"]} li`, {
      ...scrollRevealOption,
      delay: 1000,
      interval: 500,
    });

    new Swiper(".swiper", {
      slidesPerView: 1,
      spaceBetween: 20,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  }, []);

  return (
    <div>
      <header className={styles["header"]} id="home">
        <div
          className={`${styles["section__container"]} ${styles["header__container"]}`}>
          <div className={styles["header__image"]}>
            <img src="/assets/header.jpg" alt="header" />
          </div>
          <h1>Stream Music Anywhere</h1>
          <div className={styles["header__content"]}>
            <h1>
              <i>AT NO COST, WITHOUT ADS</i>
            </h1>
            <p className={styles["section__description"]}>
              Dive into a world where every note, melody, and rhythm is at your
              fingertips. Explore the vast landscapes of sound and connect with
              the essence of music streaming.
            </p>
            <div className={styles["header__btns"]}>
              <button
                className={styles["btn"]}
                onClick={() => {
                  userUUID
                    ? navigate(`/musicplayer/${userUUID}`)
                    : navigate("/sign-in");
                }}>
                {" "}
                Get Started
                <span>
                  <i className="ri-arrow-right-line"></i>
                </span>
              </button>
              <Link to="/information/aboutus">
                See More
                <span>
                  <i className="ri-arrow-right-line"></i>
                </span>
              </Link>
            </div>
            <div className={styles["header__stats"]}>
              <div className={styles["header__stats__card"]}>
                <h4>69K</h4>
                <p>Listeners</p>
              </div>
              <div className={styles["header__stats__card"]}>
                <h4>420K</h4>
                <p>Songs</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section
        className={`${styles["section__container"]} ${styles["genre__container"]}`}>
        <div className={styles["genre"]}>
          <h2 className={styles["section__header"]}>
            Choose Your Favorite Genre
          </h2>
          <p className={styles["section__description"]}>
            Explore our diverse range of genres and let the music take you on a
            journey.
          </p>
        </div>
        <div className={styles["genre__grid"]}>
          <GenreCard
            userUUID={userUUID}
            imageUrl="https://hips.hearstapps.com/hmg-prod/images/usher-raymond-at-the-2023-vanity-fair-oscar-party-held-at-news-photo-1695676021.jpg"
            genreName="R&B"
          />
          <GenreCard
            userUUID={userUUID}
            imageUrl="https://media.vogue.co.uk/photos/666022c9f41aa8be428d7eea/2:3/w_2560%2Cc_limit/2150388270"
            genreName="POP"
          />
          <GenreCard
            userUUID={userUUID}
            imageUrl="https://hips.hearstapps.com/hmg-prod/images/aap-rocky-from-the-film-monster-poses-for-a-portrait-in-the-youtube-x-getty-images-portrait-studio-at-2018-sundance-film-festival-on-january-22-2018-in-park-city-utah-photo-by-robby-klein_getty-images.jpg?resize=980:*"
            genreName="HIP HOP"
          />
          <GenreCard
            userUUID={userUUID}
            imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/James_Hetfield_live_in_Amesterdam_29_April_2023.jpg/1200px-James_Hetfield_live_in_Amesterdam_29_April_2023.jpg"
            genreName="Rock"
          />
          <GenreCard
            userUUID={userUUID}
            imageUrl="https://pbs.twimg.com/media/DUjJ38cW4AAPBy2.jpg"
            genreName="EDM"
          />
          <GenreCard
            userUUID={userUUID}
            imageUrl="https://scontent.fsof9-1.fna.fbcdn.net/v/t39.30808-6/398669671_867675838053916_6418958843618861615_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=833d8c&_nc_ohc=ieuOaTaA8dkQ7kNvgHSo6uz&_nc_ht=scontent.fsof9-1.fna&oh=00_AYAzckGNuARi6LE0yoZom4oLEiFAMttrnotSj1GhhTZHjg&oe=6695948E"
            genreName="Bulgarian Pop Folk"
          />
        </div>
      </section>

      <h2 className={styles["more"]}>AND MUCH MORE</h2>

      <section
        className={`${styles["section__container"]} ${styles["banner__container"]}`}>
        <h2>
          TuneFusion is the ultimate music streaming platform, providing a
          seamless experience for listeners to discover and enjoy their favorite
          tracks.
        </h2>
      </section>

      <section
        className={`${styles["section__container"]} ${styles["feature__container"]}`}>
        <div className={styles["feature__image"]}>
          <img src="/assets/feature.jpg" alt="feature" />
        </div>
        <div className={styles["feature__content"]}>
          <h2 className={styles["section__header"]}>Top Features</h2>
          <ul className={styles["feature__list"]}>
            <FeatureCard
              number="01"
              title="No paying needed"
              description="Enjoy your favorite music without breaking the bank with our completely free music service."
            />
            <FeatureCard
              number="02"
              title="No Ads"
              description="Experience uninterrupted listening with our ad-free streaming."
            />
            <FeatureCard
              number="03"
              title="High Quality"
              description="Stream your favorite tracks in premium quality for an immersive listening experience."
            />
          </ul>
        </div>
      </section>

      <section className={styles["client__container"]}>
        <div className={styles["client"]}>
          <h2 className={styles["section__header"]}>What Our Listeners Say</h2>
          <p className={styles["section__description"]}>
            Hear from our community of music lovers about their experience with
            TuneFusion.
          </p>
        </div>
        <div className="swiper">
          <div className="swiper-wrapper">
            <ClientCard
              rating={5}
              content="My workouts are more intense and fun with the upbeat tracks I find here."
              imageUrl="/assets/client-1.jpg"
              name="David"
              occupation="Fitness Enthusiast"
            />
            <ClientCard
              rating={4}
              content="This platform provides the perfect background music for my busy workdays."
              imageUrl="/assets/client-2.jpg"
              name="Sarah"
              occupation="Marketing Manager"
            />
            <ClientCard
              rating={5}
              content="The soothing melodies I discover here help me relax and unwind after a long day."
              imageUrl="/assets/client-3.jpg"
              name="Jennifer"
              occupation="Teacher"
            />
            <ClientCard
              rating={3}
              content="I'm always inspired by the diversity of music genres available on this platform."
              imageUrl="/assets/client-4.jpg"
              name="Michael"
              occupation="Music Producer"
            />
            <ClientCard
              rating={4}
              content="This platform provided the perfect soundtrack for our special day."
              imageUrl="/assets/client-5.jpg"
              name="Emily"
              occupation="Event Planner"
            />
          </div>
          <div className="swiper-button-next"></div>
          <div className="swiper-button-prev"></div>
        </div>
      </section>
    </div>
  );
}
