import { useEffect, useState } from "react";
import TableLayout from "../TableLayout";
import showToast from "../../../utils/showToast";

export default function ViewAllUsers() {
  const [users, setUsers] = useState([]);
  const usersPerPage = 10;

  useEffect(() => {
    async function getUsers() {
      const response = await fetch("http://localhost:3000/api/users", {
        method: "GET",
        credentials: "include",
      });
      const users = await response.json();
      setUsers(users);
    }
    getUsers();
  }, []);

  const handleDeleteUser = async (uuid) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
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
      }
    } catch (error) {
      console.error("Error:", error);
      showToast(`Error: ${error}`, "error");
    }
  };

  return (
    <TableLayout
      data={users}
      columns={["UUID", "Name", "Email Address", "Phone Number", "Actions"]}
      title="Users"
      hasDbSearch={true}
      itemsPerPage={usersPerPage}
      renderRow={(user) => (
        <tr key={user.uuid}>
          <td data-th="UUID">{user.uuid}</td>
          <td data-th="name">{user.name}</td>
          <td data-th="Email Address">{user.email_address}</td>
          <td data-th="Phone Number">{user.phone_number}</td>
          <td data-th="Actions">
            <div className="cta-admin-buttons">
              <button onClick={() => handleDeleteUser(user.uuid)}>
                Delete
              </button>
            </div>
          </td>
        </tr>
      )}
    />
  );
}
