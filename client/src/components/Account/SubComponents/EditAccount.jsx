import { useState, useEffect } from "react";
import styles from "./styles/EditAccount.module.css"; // Import CSS module
import { useNavigate } from "react-router-dom";
import showToast from "../../../utils/showToast";

export default function EditAccount({ user }) {
  const {
    uuid,
    name,
    first_name,
    last_name,
    email_address,
    phone_number,
    gender,
  } = user;

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    first_name: "",
    last_name: "",
    email_address: "",
    phone_number: "",
    gender: "",
  });

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  useEffect(() => {
    setFormData({
      name: name ?? "",
      first_name: first_name ?? "",
      last_name: last_name ?? "",
      email_address: email_address ?? "",
      phone_number: phone_number ?? "",
      gender: gender ?? "",
    });
  }, [uuid, name, first_name, last_name, email_address, phone_number, gender]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((oldFormData) => ({ ...oldFormData, [id]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
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

    const response = await fetch(
      `http://localhost:3000/api/users/editAccount/${uuid}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      showToast(responseData.message, "success");
      navigate(`/account/${uuid.slice(0, 6)}`);
    } else {
      const responseData = await response.json();
      showToast(`Error: ${responseData.error}`, "error");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword === "" && repeatPassword === "")
      return showToast("Enter the new password!", "error");

    if (newPassword.length < 8)
      return showToast("Password must contain at least 8 characters!", "error");
    if (!/[A-Z]/.test(newPassword))
      return showToast("Password must contain capitalized letters!", "error");
    if (!/[0-9]/.test(newPassword))
      return showToast("Password must contain numbers!", "error");
    if (newPassword !== repeatPassword)
      return showToast("Passwords do not match. Please try again.", "error");

    const response = await fetch(
      `http://localhost:3000/api/users/resetPassword/${formData.email_address}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: newPassword }),
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      showToast(responseData.message, "success", 1500, true);
      setPasswordModalOpen(false);
    } else {
      const responseData = await response.json();
      showToast(responseData.error, "error");
    }
  };
  const logOutUser = async (callback) => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/logout", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        showToast(`Error: ${errorData.error}`, "error");
      } else {
        if (typeof callback === "function") {
          callback();
        }
      }
    } catch (error) {
      console.error("Error:", error);
      showToast(`Error: ${error}`, "error");
    }
  };

  const handleUserLogout = async () => {
    if (!window.confirm("Are you sure you want to log out from your account?"))
      return;
    logOutUser(
      showToast(
        "You have successfully logged out of your account!",
        "success",
        1500,
        true
      )
    );
  };

  const handleUserDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account?"))
      return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/users/deleteUser/${uuid}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        showToast(`Error: ${errorData.error}`, "error");
      } else {
        const responseData = await response.json();
        showToast(responseData.message, "success", 1500, true);
        localStorage.clear();
      }
    } catch (error) {
      console.error("Error:", error);
      showToast(`Error: ${error}`, "error");
    }
    logOutUser();
  };

  return (
    <div className={styles.editAccount}>
      <form
        name="edit-form"
        className={styles.editContainer}
        onSubmit={handleFormSubmit}>
        <h1 className={styles.editTitle}>Edit my account</h1>
        <div className={styles.grid}>
          <div className={`${styles.formGroup} ${styles.a}`}>
            <label htmlFor="name">Username</label>
            <input
              id="name"
              type="text"
              placeholder="example"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={`${styles.formGroup} ${styles.b}`}>
            <label htmlFor="first_name">First Name</label>
            <input
              id="first_name"
              type="text"
              placeholder="John"
              value={formData.first_name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={`${styles.formGroup} ${styles.c}`}>
            <label htmlFor="last_name">Last Name</label>
            <input
              id="last_name"
              type="text"
              placeholder="Doe"
              value={formData.last_name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email_address">Email Address</label>
            <input
              id="email_address"
              type="text"
              placeholder="john_doe@hotmail.com"
              value={formData.email_address}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="phone_number">Phone Number</label>
            <input
              id="phone_number"
              type="tel"
              placeholder="0877696969"
              value={formData.phone_number}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="gender">
              Gender <span className={styles.notRequired}>(Optional)</span>
            </label>
            <select
              name="gender"
              id="gender"
              value={formData.gender}
              onChange={handleInputChange}>
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
            <form onSubmit={handleResetPassword}>
              <label htmlFor="newPassword">New Password:</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="off"
                required
              />
              <br />
              <label htmlFor="repeatPassword">Repeat New Password:</label>
              <input
                type="password"
                id="repeatPassword"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                autoComplete="off"
                required
              />
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
