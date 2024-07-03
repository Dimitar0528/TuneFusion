import React, { useState, useEffect } from "react";
import "./styles/EditAccount.css";
import { useNavigate } from "react-router-dom";
import showToast from "../../../showToast";
export default function EditAccount({ user }) {
  const {
    uuid,
    username,
    first_name,
    last_name,
    email_address,
    phone_number,
    gender,
  } = user;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: username ?? "",
    first_name: first_name ?? "",
    last_name: last_name ?? "",
    email_address: email_address ?? "",
    phone_number: phone_number ?? "",
    gender: gender ?? "",
  });

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  useEffect(() => {
    // Populate initial form data
    setFormData({
      username: username ?? "",
      first_name: first_name ?? "",
      last_name: last_name ?? "",
      email_address: email_address ?? "",
      phone_number: phone_number ?? "",
      gender: gender ?? "",
    });
  }, [
    uuid,
    username,
    first_name,
    last_name,
    email_address,
    phone_number,
    gender,
  ]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      formData.username === username &&
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

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to log out from your account?"))
      return;

    try {
      const response = await fetch("http://localhost:3000/api/users/logout", {
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
        const responseData = await response.json();
        showToast(responseData.message, "success", 1500, true);
      }
    } catch (error) {
      console.error("Error:", error);
      showToast(`Error: ${error}`, "error");
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account?"))
      return;

    try {
      const response = await fetch(`/api/users/deleteUser/${uuid}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        showToast(`Error: ${errorData.error}`, "error");
      } else {
        const responseData = await response.json();
        showToast(responseData.message, "success");
      }
    } catch (error) {
      console.error("Error:", error);
      showToast(`Error: ${error}`, "error");
    }

    try {
      const response = await fetch("/api/users/miscellaneous/deleteCookie", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        showToast(`Error: ${errorData.error}`, "error");
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error:", error);
      showToast(`Error: ${error}`, "error");
    }
  };

  return (
    <div className="edit-account">
      <form name="edit-form" className="edit-container" onSubmit={handleSubmit}>
        <h1 className="edit-title">Edit my account</h1>
        <div className="grid">
          <div className="form-group a">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username..."
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group b">
            <label htmlFor="first_name">First Name</label>
            <input
              id="first_name"
              type="text"
              placeholder="Enter your first name..."
              value={formData.first_name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group c">
            <label htmlFor="last_name">Last Name</label>
            <input
              id="last_name"
              type="text"
              placeholder="Enter your last name..."
              value={formData.last_name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email_address">Email Address</label>
            <input
              id="email_address"
              type="text"
              placeholder="Enter your email address..."
              value={formData.email_address}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone_number">Phone Number</label>
            <input
              id="phone_number"
              type="tel"
              placeholder="Enter your phone number..."
              value={formData.phone_number}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="gender">
              Gender <span className="not-required">(Optional)</span>
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
        <div className="button-container">
          <button
            type="button"
            className="button delete-btn"
            onClick={handleDeleteAccount}>
            Delete Account
          </button>
          <button
            type="button"
            className="button log-out"
            onClick={handleLogout}>
            Log Out
          </button>
          <button
            type="button"
            className="button edit-password"
            onClick={() => setPasswordModalOpen(true)}>
            Reset Password
          </button>
          <input
            type="submit"
            value="Save changes"
            className="button submit-btn"
          />
        </div>
      </form>

      {passwordModalOpen && (
        <dialog open className="password-modal">
          <div className="modal-content">
            <h2>Reset Password</h2>
            <p>
              The same rules apply for new password: To be at least 8 characters
              long and to have at least one capitalized letter and number
            </p>
            <form className="reset-password" onSubmit={handleResetPassword}>
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
                className="button"
              />
            </form>
            <button
              type="button"
              className="button close-btn"
              onClick={() => setPasswordModalOpen(false)}>
              Cancel
            </button>
          </div>
        </dialog>
      )}
    </div>
  );
}
