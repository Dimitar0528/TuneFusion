import React, { useState, useRef } from "react";
import styles from "./styles/SignUp.module.css";
import showToast from "../../showToast";
const SignUp = () => {
  const [signUpMode, setSignUpMode] = useState(false);
  const [errors, setErrors] = useState({});
  const signUpname = useRef();
  const signUpEmail = useRef();
  const signPassword = useRef();
  const signInname = useRef();
  const signInPassword = useRef();

  const handleSignUpClick = () => {
    setSignUpMode(true);
  };

  const handleSignInClick = () => {
    setSignUpMode(false);
  };

  const validateSignUp = () => {
    const newErrors = {};
    const name = signUpname.current.value.trim();
    const email = signUpEmail.current.value.trim();
    const password = signPassword.current.value.trim();

    if (!name) {
      newErrors.name = "name is required.";
    }

    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password =
        "Password must contain at least 1 capitalized letter";
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = "Password must contain at least 1 number";
    }
    return newErrors;
  };

  const validateSignIn = () => {
    const newErrors = {};
    const name = signInname.current.value.trim();
    const password = signInPassword.current.value.trim();

    if (!name) {
      newErrors.name = "name is required.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    }

    return newErrors;
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateSignUp();
    if (Object.keys(validationErrors).length === 0) {
      const name = signUpname.current.value.trim();
      const email = signUpEmail.current.value.trim();
      const password = signPassword.current.value.trim();
      const user = {
        name,
        password,
        email,
      };
      const response = await fetch(`http://localhost:3000/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const message = await response.json();
        showToast(`Error: ${message.error}`, "error");
        return;
      }
      location.href = "/sign-in";
    } else {
      setErrors(validationErrors);
    }
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateSignIn();
    if (Object.keys(validationErrors).length === 0) {
      // Proceed with sign-in logic
      const name = signInname.current.value.trim();
      const password = signInPassword.current.value.trim();
      const requestBody = {
        name,
        password,
      };
      const response = await fetch(`http://localhost:3000/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const message = await response.json();
        showToast(`Error: ${message.error}`, "error");
        return;
      }
      const data = await response.json();
      let { user_uuid } = data;
      location.href = `/musicplayer/${user_uuid.slice(0, 6)}`;
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
            action="#"
            className={styles["sign-in-form"]}
            onSubmit={handleSignInSubmit}>
            <h2 className={styles.title}>Sign in</h2>
            <div className={styles["input-field"]}>
              <i className="fas fa-user"></i>
              <input type="text" placeholder="John Doe" ref={signInname} />
            </div>
            {errors.name && <p className={styles.error}>{errors.name}</p>}
            <div className={styles["input-field"]}>
              <i className="fas fa-lock"></i>
              <input
                type="password"
                placeholder="Secure1234"
                ref={signInPassword}
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
            action="#"
            className={styles["sign-up-form"]}
            onSubmit={handleSignUpSubmit}>
            <h2 className={styles.title}>Sign up</h2>
            <div className={styles["input-field"]}>
              <i className="fas fa-user"></i>
              <input type="text" placeholder="John Doe" ref={signUpname} />
            </div>
            {errors.name && <p className={styles.error}>{errors.name}</p>}
            <div className={styles["input-field"]}>
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                placeholder="john_doe@hotmail.com"
                ref={signUpEmail}
              />
            </div>
            {errors.email && <p className={styles.error}>{errors.email}</p>}
            <div className={styles["input-field"]}>
              <i className="fas fa-lock"></i>
              <input
                type="password"
                placeholder="Secure1234"
                ref={signPassword}
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
};

export default SignUp;
