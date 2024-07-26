import { useState } from "react";
import styles from "./styles/SignUp.module.css";
import { useForm } from "../../hooks/useForm";
import {
  validateSignIn,
  validateSignUp,
  useRegisterUser,
  useLoginUser,
} from "../../hooks/CRUD-hooks/useAuth";
const signUpInitialValues = {
  name: "",
  email: "",
  password: "",
};
const signInInitialValues = {
  name: "",
  password: "",
};

export default function Login() {
  const registerUser = useRegisterUser();
  const loginUser = useLoginUser();
  const [signUpMode, setSignUpMode] = useState(false);

  const handleSignUpClick = () => {
    setSignUpMode(true);
  };

  const handleSignInClick = () => {
    setSignUpMode(false);
  };

  const handleSignUpSubmit = async (formData) => {
    await registerUser(formData);
  };

  const handleSignInSubmit = async (formData) => {
    await loginUser(formData);
  };

  const {
    values: signUpFormData,
    errors: signUpErrors,
    changeHandler: signUpChangeHandler,
    submitHandler: signUpSubmitHandler,
  } = useForm(signUpInitialValues, handleSignUpSubmit, validateSignUp);

  const {
    values: signInFormData,
    errors: signInErrors,
    changeHandler: signInChangeHandler,
    submitHandler: signInSubmitHandler,
  } = useForm(signInInitialValues, handleSignInSubmit, validateSignIn);

  return (
    <div
      className={`${styles.container} ${
        signUpMode ? styles["sign-up-mode"] : ""
      }`}>
      <div className={styles["forms-container"]}>
        <div className={styles["signin-signup"]}>
          <form
            className={styles["sign-in-form"]}
            onSubmit={signInSubmitHandler}>
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
                onChange={signInChangeHandler}
              />
            </div>
            {signInErrors.name && (
              <p className={styles.error}>{signInErrors.name}</p>
            )}

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
                onChange={signInChangeHandler}
              />
            </div>
            {signInErrors.password && (
              <p className={styles.error}>{signInErrors.password}</p>
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
            onSubmit={signUpSubmitHandler}>
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
                onChange={signUpChangeHandler}
              />
            </div>
            {signUpErrors.name && (
              <p className={styles.error}>{signUpErrors.name}</p>
            )}

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
                onChange={signUpChangeHandler}
              />
            </div>
            {signUpErrors.email && (
              <p className={styles.error}>{signUpErrors.email}</p>
            )}

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
                onChange={signUpChangeHandler}
              />
            </div>
            {signUpErrors.password && (
              <p className={styles.error}>{signUpErrors.password}</p>
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
