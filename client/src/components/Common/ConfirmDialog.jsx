import React, { useState } from "react";
import "../../styles/ConfirmDialog.css";
const ConfirmDialog = ({
  actionType,
  action,
  itemType,
  itemName,
  onConfirm,
  onCancel,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setIsConfirmed(e.target.value === itemName);
  };

  const handleConfirm = () => {
    if (isConfirmed) {
      handleClose()
      onConfirm()
    }
  };

  const handleClose = () => {
    const dialog = document.querySelector(".confirm-delete-modal");
    dialog.classList.add("closing");
    dialog.addEventListener(
      "animationend",
      () => {
        onCancel();
        dialog.classList.remove("closing");
      },
      { once: true }
    );
  };

  return (
    <dialog open className="confirm-delete-modal">
      <div className="modal-content">
        <h2>Confirm {actionType}</h2>
        <p>
          To {action} the specific {itemType}, please type{" "}
          <strong>{itemName}</strong> below:
        </p>
        <input
          type="text"
          name="input"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={`Type "${itemName}" to ${action} the ${itemType}`}
          className="confirm-input"
        />
        <div className="modal-actions">
          <button
            onClick={handleConfirm}
            disabled={!isConfirmed}
            className="confirm-button">
            Confirm
          </button>
          <button onClick={handleClose} className="cancel-button">
            Cancel
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ConfirmDialog;
