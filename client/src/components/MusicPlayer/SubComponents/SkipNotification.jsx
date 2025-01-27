import "../styles/SkipNotification.css";

export default function SkipNotification ({ skipValue, isVisible }) {
  if (!isVisible) return null;

  const animationDirection = skipValue > 0 ? "forward" : "backward";
  return (
    <div className={`skip-notification ${animationDirection}`}>
      {skipValue > 0 ? `+${skipValue}s` : `${skipValue}s`}
    </div>
  );
};