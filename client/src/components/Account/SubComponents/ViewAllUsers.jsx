import { useEffect, useState } from "react";
import TableLayout from "../TableLayout";

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
              <button>Delete</button>
            </div>
          </td>
        </tr>
      )}
    />
  );
}
