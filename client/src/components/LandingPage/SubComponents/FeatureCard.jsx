import styles from "../../../styles/LandingPage.module.css";

export default function FeatureCard ({ number, title, description }) {
  return (
    <li>
      <div className={styles["feature__card"]}>
        <span>{number}</span>
        <div>
          <h4>{title}</h4>
          <p>{description}</p>
        </div>
      </div>
    </li>
  );
};

