import { useEffect, useState } from "react";
import api from "../api";
import LogoutButton from "./LogoutButton";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/admin/users"); // ✅ ใช้ api instance ที่มี token
        setUsers(res.data);
      } catch (err) {
        setError("Cannot fetch users. Maybe unauthorized?");
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {error && <p className="text-red-500">{error}</p>}

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
              </tr>
              
            ))}
          </tbody>
        </table>
      </div>
      <LogoutButton/>
    </div>
  );
}
