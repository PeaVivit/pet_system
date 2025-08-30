import { useEffect, useState } from "react";
import api from "../api";
import LogoutButton from "./LogoutButton";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    role: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
      setError("");
    } catch (err) {
      setError("Cannot fetch users. Maybe unauthorized?");
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/admin/users/${userId}`);
        fetchUsers();
      } catch (err) {
        setError("Failed to delete user.");
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
    });
  };

  const handleCloseModal = () => {
    setEditingUser(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        first_name: formData.first_name || editingUser.first_name,
        last_name: formData.last_name || editingUser.last_name,
        role: formData.role || editingUser.role,
      };

      await api.put(`/admin/users/${editingUser.id}`, updatedData);
      fetchUsers();
      setEditingUser(null);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("Failed to update user.");
    }
  };

  return (
    <div className="p-6">
      {/* ✅ จัด layout บนสุดให้ title กับปุ่ม logout อยู่คนละฝั่ง */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <LogoutButton />
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {users.length === 0 && !error && <p>No users found.</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">First Name</th>
              <th className="border px-4 py-2">Last Name</th>
              <th className="border px-4 py-2">Role</th>
              <th className="border px-4 py-2">Pets</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{u.id}</td>
                <td className="border px-4 py-2">{u.first_name}</td>
                <td className="border px-4 py-2">{u.last_name}</td>
                <td className="border px-4 py-2">{u.role}</td>
                <td className="border px-4 py-2">
                  {u.pets && u.pets.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {u.pets.map((p) => (
                        <li key={p.id}>
                          {p.name} ({p.species})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "No pets"
                  )}
                </td>
                <td className="border px-4 py-2 space-x-2 whitespace-nowrap">
                  <button
                    onClick={() => handleEdit(u)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(u.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-2xl font-bold mb-4">Edit User</h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block text-gray-700">First Name</label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Last Name</label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
