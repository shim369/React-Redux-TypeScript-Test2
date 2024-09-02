import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUser } from "../redux/usersSlice";
import { RootState } from "../redux/store";
import { AppDispatch } from "../redux/store";
import { useNavigate } from "react-router-dom";

const UserList = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { users, loading, error } = useSelector(
    (state: RootState) => state.users
  );

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDelete = async (userId: number) => {
    try {
      await dispatch(deleteUser(userId)).unwrap();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/profile/${id}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <table className="tbl">
      <thead>
        <tr>
          <th>ID</th>
          <th>Username</th>
          <th>Email</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td><button className="btn" onClick={() => handleEdit(user.id)}>Edit</button></td>
            <td><button className="btn" onClick={() => handleDelete(user.id)}>Delete</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserList;
