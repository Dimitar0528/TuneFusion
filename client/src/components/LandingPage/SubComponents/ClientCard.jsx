import styles from "../styles/LandingPage.module.css";

export default function ClientCard({
  rating,
  content,
  imageUrl,
  name,
  occupation,
}) {
  const maxStars = 5;
  const activeStars = Math.min(rating, maxStars);

  return (
    <div className="swiper-slide">
      <div className={styles["client__card"]}>
        <div className={styles["client__ratings"]}>
          {[...Array(maxStars)].map((_, index) => (
            <span key={index}>
              <i
                className={
                  index < activeStars ? "ri-star-fill" : "ri-star-line"
                }></i>
            </span>
          ))}
        </div>
        <p>{content}</p>
        <div className={styles["client__details"]}>
          <img src={imageUrl} alt="client" />
          <div>
            <h4>{name}</h4>
            <h5>{occupation}</h5>
          </div>
        </div>
      </div>
    </div>
  );
}
