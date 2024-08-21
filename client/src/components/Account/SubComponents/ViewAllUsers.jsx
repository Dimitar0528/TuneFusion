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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleDeleteUser = async (uuid) => {
    const displayMessage = () => {
      showToast("Account deleted successfully!", "success");
      triggerRefreshHandler();
    };
    deleteUser(uuid, displayMessage);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      handleDeleteUser(userToDelete.uuid);
      setIsModalOpen(false);
      setUserToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
    setUserToDelete(null);
  };

  const handleChangeUserRole = async (user) => {
    if (!window.confirm("Are you sure you want to change this user's role?"))
      return;
    changeUserRole(user.uuid, user, triggerRefreshHandler);
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
                <button onClick={() => handleDeleteClick(user)}>Delete</button>
                <button onClick={() => handleChangeUserRole(user)}>
                  {user.role === "user" ? "Make admin" : "Remove admin"}
                </button>
              </div>
            </td>
          </tr>
        )}
      />
      {isModalOpen && (
        <ConfirmDialog
          itemType="user"
          itemName={userToDelete.name}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}
