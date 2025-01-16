import React, { useState } from "react";
import TableLayout from "../TableLayout";
import { useGetAllUsers } from "../../../hooks/CRUD-hooks/useUsers";
import {
  useDeleteUser,
  useChangeUserRole,
} from "../../../hooks/CRUD-hooks/useUsers";
import showToast from "../../../utils/showToast";
import extractUUIDPrefix from "../../../utils/extractUUIDPrefix";
import ConfirmDialog from "../../ConfirmDialog";

export default function ViewAllUsers({
  refreshFlag,
  triggerRefreshHandler,
  userUUID,
}) {
  const deleteUser = useDeleteUser();
  const changeUserRole = useChangeUserRole();
  const [users] = useGetAllUsers(refreshFlag);
  const filteredUsers = users.filter(
    (user) => extractUUIDPrefix(user.uuid) !== userUUID
  );

  // State for deletion dialog
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // State for edit dialog
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  const handleDeleteUser = async (uuid) => {
    const displayMessage = () => {
      showToast("Account deleted successfully!", "success");
      triggerRefreshHandler();
    };
    deleteUser(uuid, displayMessage);
  };

  const handleDeleteAction = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteAction = () => {
    if (userToDelete) {
      handleDeleteUser(userToDelete.uuid);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  const cancelDeleteAction = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleEditAction = (user) => {
    setUserToEdit(user);
    setIsEditModalOpen(true);
  };

  const confirmEditAction = () => {
    if (userToEdit) {
      changeUserRole(userToEdit.uuid, userToEdit, triggerRefreshHandler);
      setIsEditModalOpen(false);
      setUserToEdit(null);
    }
  };

  const cancelEditAction = () => {
    setIsEditModalOpen(false);
    setUserToEdit(null);
  };

  return (
    <div>
      <TableLayout
        data={filteredUsers}
        columns={["UUID", "Name", "Email Address", "Phone Number", "Actions"]}
        title="Users"
        hasDbSearch={true}
        renderRow={(user) => (
          <tr key={user.uuid}>
            <td data-th="UUID">{user.uuid}</td>
            <td data-th="Name">{user.name}</td>
            <td data-th="Email Address">{user.email_address}</td>
            <td data-th="Phone Number">{user.phone_number}</td>
            <td data-th="Actions">
              <div
                style={{ flexDirection: "row" }}
                className="cta-admin-buttons">
                <button onClick={() => handleDeleteAction(user)}>Delete</button>
                <button onClick={() => handleEditAction(user)}>
                  {user.role === "user" ? "Make admin" : "Remove admin"}
                </button>
              </div>
            </td>
          </tr>
        )}
      />
      {isDeleteModalOpen && (
        <ConfirmDialog
          actionType="Deletion"
          action="delete"
          itemType="user"
          itemName={userToDelete.name}
          onConfirm={confirmDeleteAction}
          onCancel={cancelDeleteAction}
        />
      )}
      {isEditModalOpen && (
        <ConfirmDialog
          actionType="Edit Role"
          action="edit"
          itemType="user role"
          itemName={`${
            users.find((user) => user.uuid === userToEdit.uuid).role ===
            "admin"
              ? "Remove admin"
              : "Make admin"
          }`}
          onConfirm={confirmEditAction}
          onCancel={cancelEditAction}
        />
      )}
    </div>
  );
}
