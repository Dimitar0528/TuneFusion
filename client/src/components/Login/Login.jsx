import { useState } from "react";
import styles from "./styles/SignUp.module.css";
import showToast from "../../utils/showToast";

export default function Login() {
  const [signUpMode, setSignUpMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [signUpFormData, setSignUpFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [signInFormData, setSignInFormData] = useState({
    name: "",
    password: "",
  });

  const handleSignUpClick = () => {
    setSignUpMode(true);
  };

  const handleSignInClick = () => {
    setSignUpMode(false);
  };

  const handleSignUpInputChange = (e) => {
    const { name, value } = e.target;
    setSignUpFormData({ ...signUpFormData, [name]: value });
  };

  const handleSignInInputChange = (e) => {
    const { name, value } = e.target;
    setSignInFormData({ ...signInFormData, [name]: value });
  };

  const validateSignUp = () => {
    const newErrors = {};
    const { name, email, password } = signUpFormData;

    if (!name) newErrors.name = "Name is required.";
    if (!email) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid.";
    if (!password) newErrors.password = "Password is required.";
    else if (password.length < 8)
      newErrors.password = "Password must be at least 8 characters.";
    else if (!/[A-Z]/.test(password))
      newErrors.password =
        "Password must contain at least 1 capitalized letter";
    else if (!/[0-9]/.test(password))
      newErrors.password = "Password must contain at least 1 number";

    return newErrors;
  };

  const validateSignIn = () => {
    const newErrors = {};
    const { name, password } = signInFormData;

    if (!name) newErrors.name = "Name is required.";
    if (!password) newErrors.password = "Password is required.";

    return newErrors;
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateSignUp();
    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/auth/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(signUpFormData),
          }
        );

        if (!response.ok) {
          const message = await response.json();
          showToast(`Error: ${message.error}`, "error");
          return;
        }
        localStorage.setItem("email", signUpFormData.email);
        location.href = "/sign-in/otp";
        // location.href = "/sign-in"
      } catch (error) {
        showToast(`Error: ${error.message}`, "error");
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateSignIn();
    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await fetch(`http://localhost:3000/api/auth/login`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(signInFormData),
        });

        if (!response.ok) {
          const message = await response.json();
          showToast(`Error: ${message.error}`, "error");
          return;
        }
        const data = await response.json();
        const { user_uuid } = data;
        location.href = `/musicplayer/${user_uuid.slice(0, 6)}`;
      } catch (error) {
        showToast(`Error: ${error.message}`, "error");
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div
      className={`${styles.container} ${
        signUpMode ? styles["sign-up-mode"] : ""
      }`}>
      <div className={styles["forms-container"]}>
        <div className={styles["signin-signup"]}>
          <form
            className={styles["sign-in-form"]}
            onSubmit={handleSignInSubmit}>
            <h2 className={styles.title}>Sign in</h2>
            <label className={styles.label} htmlFor="username">
              Username
            </label>
            <div className={styles["input-field"]}>
              <i className="fas fa-user"></i>
              <input
                id="username"
                type="text"
                placeholder="John Doe"
                name="name"
                value={signInFormData.name}
                onChange={handleSignInInputChange}
              />
            </div>
            {errors.name && <p className={styles.error}>{errors.name}</p>}

            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <div className={styles["input-field"]}>
              <i className="fas fa-lock"></i>
              <input
                id="password"
                type="password"
                placeholder="Secure1234"
                name="password"
                value={signInFormData.password}
                onChange={handleSignInInputChange}
              />
            </div>
            {errors.password && (
              <p className={styles.error}>{errors.password}</p>
            )}
            <input
              type="submit"
              value="Login"
              className={`${styles.btn} ${styles.solid}`}
            />
            <p className={styles["social-text"]}>
              Or Sign in with social platforms
            </p>
            <div className={styles["social-media"]}>
              <a href="#" className={styles["social-icon"]}>
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className={styles["social-icon"]}>
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className={styles["social-icon"]}>
                <i className="fab fa-google"></i>
              </a>
              <a href="#" className={styles["social-icon"]}>
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </form>

          <form
            className={styles["sign-up-form"]}
            onSubmit={handleSignUpSubmit}>
            <h2 className={styles.title}>Sign up</h2>
            <label className={styles.label} htmlFor="signUpUsername">
              Username
            </label>
            <div className={styles["input-field"]}>
              <i className="fas fa-user"></i>
              <input
                id="signUpUsername"
                type="text"
                placeholder="John Doe"
                name="name"
                value={signUpFormData.name}
                onChange={handleSignUpInputChange}
              />
            </div>
            {errors.name && <p className={styles.error}>{errors.name}</p>}

            <label className={styles.label} htmlFor="signUpEmail">
              Email Address
            </label>
            <div className={styles["input-field"]}>
              <i className="fas fa-envelope"></i>
              <input
                id="signUpEmail"
                type="email"
                placeholder="john_doe@hotmail.com"
                name="email"
                value={signUpFormData.email}
                onChange={handleSignUpInputChange}
              />
            </div>
            {errors.email && <p className={styles.error}>{errors.email}</p>}

            <label className={styles.label} htmlFor="signUpPassword">
              Password
            </label>
            <div className={styles["input-field"]}>
              <i className="fas fa-lock"></i>
              <input
                id="signUpPassword"
                type="password"
                placeholder="Secure1234"
                name="password"
                value={signUpFormData.password}
                onChange={handleSignUpInputChange}
              />
            </div>
            {errors.password && (
              <p className={styles.error}>{errors.password}</p>
            )}

            <input type="submit" className={styles.btn} value="Sign up" />
            <p className={styles["social-text"]}>
              Or Sign up with social platforms
            </p>
            <div className={styles["social-media"]}>
              <a href="#" className={styles["social-icon"]}>
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className={styles["social-icon"]}>
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className={styles["social-icon"]}>
                <i className="fab fa-google"></i>
              </a>
              <a href="#" className={styles["social-icon"]}>
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </form>
        </div>
      </div>

      <div className={styles["panels-container"]}>
        <div className={`${styles.panel} ${styles["left-panel"]}`}>
          <div className={styles.content}>
            <h3>New to our Music Player?</h3>
            <p>
              Discover a world of music at your fingertips. Join us and explore
              countless tracks, create playlists, and enjoy an unparalleled
              listening experience.
            </p>
            <button
              className={`${styles.btn} ${styles.transparent}`}
              onClick={handleSignUpClick}>
              Sign up
            </button>
          </div>
          <img src="assets/spaceship.svg" className={styles.image} alt="" />
        </div>

        <div className={`${styles.panel} ${styles["right-panel"]}`}>
          <div className={styles.content}>
            <h3>Already a Member?</h3>
            <p>
              Welcome back! Log in to access your personalized playlists,
              favorite tracks, and continue enjoying your musical journey with
              us.
            </p>
            <button
              className={`${styles.btn} ${styles.transparent}`}
              onClick={handleSignInClick}>
              Sign in
            </button>
          </div>
          <img src="assets/computer.svg" className={styles.image} alt="" />
        </div>
      </div>
    </div>
  );
}
