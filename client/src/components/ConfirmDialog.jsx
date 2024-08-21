import React, { useState } from "react";
import "../styles/ConfirmDialog.css";
const ConfirmDialog = ({ itemType, itemName, onConfirm, onCancel }) => {
  const [inputValue, setInputValue] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setIsConfirmed(e.target.value === itemName);
  };

  const handleConfirm = () => {
    if (isConfirmed) {
      onConfirm();
    }
  };

  return (
    <div className="confirm-delete-modal">
      <div className="modal-content">
        <h2>Confirm Deletion</h2>
        <p>
          To delete the specific {itemType}, please type{" "}
          <strong>{itemName}</strong> below:
        </p>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={`Type "${itemName}" to delete the ${itemType}`}
          className="confirm-input"
        />
        <div className="modal-actions">
          <button
            onClick={handleConfirm}
            disabled={!isConfirmed}
            className="confirm-button">
            Confirm
          </button>
          <button onClick={onCancel} className="cancel-button">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
