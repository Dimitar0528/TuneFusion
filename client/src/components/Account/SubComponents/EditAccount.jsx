import { useState, useEffect } from "react";
import styles from "./styles/EditAccount.module.css";
import showToast from "../../../utils/showToast";
import { useLogoutUser } from "../../../hooks/CRUD-hooks/useAuth";
import { useForm } from "../../../hooks/useForm";
import {
  validateEditAccount,
  validateResetPassword,
} from "../../../hooks/CRUD-hooks/useUsers";
import {
  useEditUser,
  useDeleteUser,
  useResetPassword,
} from "../../../hooks/CRUD-hooks/useUsers";

const initialUserData = {
  name: "",
  first_name: "",
  last_name: "",
  email_address: "",
  phone_number: "",
  gender: "",
};

const initialPasswordData = {
  newPassword: "",
  repeatPassword: "",
};

export default function EditAccount({ user, triggerRefreshHandler }) {
  const {
    uuid,
    name,
    first_name,
    last_name,
    email_address,
    phone_number,
    gender,
  } = user;

  const logoutUser = useLogoutUser();
  const editUser = useEditUser();
  const deleteUser = useDeleteUser();
  const resetPassword = useResetPassword();
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  const onSubmit = async (formData) => {
    if (
      formData.name === name &&
      formData.first_name === first_name &&
      formData.last_name === last_name &&
      formData.email_address === email_address &&
      formData.phone_number === phone_number &&
      formData.gender === gender
    ) {
      return showToast(
        "First change your details in order to update them!",
        "warning"
      );
    }

    editUser(uuid, formData, triggerRefreshHandler);
  };

  const {
    values: formData,
    changeHandler,
    submitHandler,
    setValuesWrapper: setUserValuesWrapper,
    errors,
  } = useForm(initialUserData, onSubmit, validateEditAccount);

  useEffect(() => {
    setUserValuesWrapper({
      name: name ?? "",
      first_name: first_name ?? "",
      last_name: last_name ?? "",
      email_address: email_address ?? "",
      phone_number: phone_number ?? "",
      gender: gender ?? "",
    });
  }, [uuid, name, first_name, last_name, email_address, phone_number, gender]);

  const handleResetPassword = async (formData) => {
    resetPassword(user.email_address, formData, triggerRefreshHandler);
    setPasswordModalOpen(false);
    setPasswordValuesWrapper(initialPasswordData);
  };

  const {
    values: passwordData,
    changeHandler: passwordChangeHandler,
    submitHandler: passwordSubmitHandler,
    errors: passwordErrors,
    setValuesWrapper: setPasswordValuesWrapper,
  } = useForm(initialPasswordData, handleResetPassword, validateResetPassword);

  const handleUserLogout = async () => {
    if (!window.confirm("Are you sure you want to log out from your account?"))
      return;
    logoutUser(
      showToast(
        "You have successfully logged out of your account!",
        "success",
        1500,
        true,
        true
      )
    );
  };
  const handleUserDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account?"))
      return;

    const displayMessage = () => {
      showToast("Account deleted successfully!", "success", 1500, true, true);
      localStorage.clear();
    };

    deleteUser(uuid, displayMessage);
    logoutUser();
  };

  return (
    <div className={styles.editAccount}>
      <form
        name="edit-form"
        className={styles.editContainer}
        onSubmit={submitHandler}>
        <h1 className={styles.editTitle}>Edit my account</h1>
        <div className={styles.grid}>
          <div className={`${styles.formGroup} ${styles.a}`}>
            <label htmlFor="name">Username</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="example"
              value={formData.name}
              onChange={changeHandler}
              required
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>
          <div className={`${styles.formGroup} ${styles.b}`}>
            <label htmlFor="first_name">First Name</label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              placeholder="John"
              value={formData.first_name}
              onChange={changeHandler}
              required
            />
            {errors.first_name && <p className="error">{errors.first_name}</p>}
          </div>
          <div className={`${styles.formGroup} ${styles.c}`}>
            <label htmlFor="last_name">Last Name</label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              placeholder="Doe"
              value={formData.last_name}
              onChange={changeHandler}
              required
            />
            {errors.last_name && <p className="error">{errors.last_name}</p>}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email_address">Email Address</label>
            <input
              id="email_address"
              name="email_address"
              type="text"
              placeholder="john_doe@hotmail.com"
              value={formData.email_address}
              onChange={changeHandler}
              required
            />
            {errors.email_address && (
              <p className="error">{errors.email_address}</p>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="phone_number">Phone Number</label>
            <input
              id="phone_number"
              name="phone_number"
              type="tel"
              placeholder="0877696969"
              value={formData.phone_number}
              onChange={changeHandler}
              required
            />
            {errors.phone_number && (
              <p className="error">{errors.phone_number}</p>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="gender">
              Gender <span className={styles.notRequired}>(Optional)</span>
            </label>
            <select
              name="gender"
              id="gender"
              value={formData.gender}
              onChange={changeHandler}>
              <option value=""></option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <button
            type="button"
            className={`${styles.button} ${styles.deleteBtn}`}
            onClick={handleUserDeleteAccount}>
            Delete Account
          </button>
          <button
            type="button"
            className={`${styles.button} ${styles.logOut}`}
            onClick={handleUserLogout}>
            Log Out
          </button>
          <button
            type="button"
            className={`${styles.button} ${styles.editPassword}`}
            onClick={() => setPasswordModalOpen(true)}>
            Reset Password
          </button>
          <input
            type="submit"
            value="Save changes"
            className={`${styles.button} ${styles.submitBtn}`}
          />
        </div>
      </form>

      {passwordModalOpen && (
        <dialog open className={styles["password-modal"]}>
          <div className={styles["modal-content"]}>
            <h2>Reset Password</h2>
            <p>
              The same rules apply for new password: To be at least 8 characters
              long and to have at least one capitalized letter and number
            </p>
            <form onSubmit={passwordSubmitHandler}>
              <label htmlFor="newPassword">New Password:</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={passwordChangeHandler}
                autoComplete="off"
                required
              />
              {passwordErrors.newPassword && (
                <p className="error">{passwordErrors.newPassword}</p>
              )}
              <br />
              <label htmlFor="repeatPassword">Repeat New Password:</label>
              <input
                type="password"
                id="repeatPassword"
                name="repeatPassword"
                value={passwordData.repeatPassword}
                onChange={passwordChangeHandler}
                autoComplete="off"
                required
              />
              {passwordErrors.repeatPassword && (
                <p className="error">{passwordErrors.repeatPassword}</p>
              )}
              <br />
              <input
                type="submit"
                value="Save New Password"
                className={styles.button}
              />
            </form>
            <button
              type="button"
              className={`${styles.button} ${styles.closeBtn}`}
              onClick={() => setPasswordModalOpen(false)}>
              Cancel
            </button>
          </div>
        </dialog>
      )}
    </div>
  );
}
