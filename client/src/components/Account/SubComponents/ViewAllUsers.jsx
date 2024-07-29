import TableLayout from "../TableLayout";
import { useGetAllUsers } from "../../../hooks/CRUD-hooks/useUsers";
import { useDeleteUser } from "../../../hooks/CRUD-hooks/useUsers";
import showToast from "../../../utils/showToast";
export default function ViewAllUsers({ refreshFlag, triggerRefreshHandler }) {
  const deleteUser = useDeleteUser();
  const usersPerPage = 10;
  const [users] = useGetAllUsers(refreshFlag);

  const handleDeleteUser = async (uuid) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    const displayMessage = () => {
      showToast("Account deleted successfully!", "success");
      triggerRefreshHandler();
    };
    deleteUser(uuid, displayMessage);
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
