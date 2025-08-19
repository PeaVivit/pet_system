import React, { useEffect, useState } from "react";
import LogoutButton from "./LogoutButton";
import api from "../api";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPet, setNewPet] = useState({
    name: "",
    species: "",
    color: "",
    gender: "",
    weight: "",
    image_url: "",
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await api.get("/app_user/me");
      setUser(res.data);
    } catch (err) {
      console.error("Failed to load user data", err);
      setError("Cannot fetch user data. Maybe unauthorized?");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPet = async (e) => {
    e.preventDefault();
    try {
      await api.post("/pets", {
        ...newPet,
        userId: user.id,
      });
      setShowAddForm(false);
      setNewPet({
        name: "",
        species: "",
        color: "",
        gender: "",
        weight: "",
        image_url: "",
      });
      fetchUserData();
    } catch (err) {
      console.error("Failed to add pet", err);
      alert("Error while adding pet");
    }
  };

  if (loading) return <p className="text-center">Loading user data...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      {/* ✅ User Info */}
      <h2 className="text-3xl font-bold mb-4 text-blue-600">User Dashboard</h2>
      <div className="bg-gray-50 p-4 rounded-md shadow-sm mb-6">
        <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
        <p><strong>Nickname:</strong> {user.nick_name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Age:</strong> {user.age}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Status:</strong> {user.status}</p>
        <p><strong>Created at:</strong> {new Date(user.created_at).toLocaleString()}</p>
      </div>

      {/* ✅ Pets Section */}
      <h3 className="text-2xl font-semibold mb-3">My Pets</h3>
      {user.pets && user.pets.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200 shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Image</th>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Species</th>
                <th className="border px-4 py-2">Color</th>
                <th className="border px-4 py-2">Gender</th>
                <th className="border px-4 py-2">Weight</th>
              </tr>
            </thead>
            <tbody>
              {user.pets.map((pet) => (
                <tr key={pet.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2 text-center">
                    {pet.image_url ? (
                      <img
                        src={pet.image_url}
                        alt={pet.name}
                        className="w-16 h-16 object-cover rounded-md mx-auto"
                      />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </td>
                  <td className="border px-4 py-2">{pet.name}</td>
                  <td className="border px-4 py-2">{pet.species}</td>
                  <td className="border px-4 py-2">{pet.color}</td>
                  <td className="border px-4 py-2">{pet.gender}</td>
                  <td className="border px-4 py-2">{pet.weight} kg</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 italic">🐾 You have no pets yet.</p>
      )}

      {/* ✅ Add Pet Form */}
      <div className="mt-6">
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-500 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-600"
          >
            ➕ Add Pet
          </button>
        ) : (
          <form onSubmit={handleAddPet} className="mt-4 space-y-3 bg-gray-50 p-4 rounded-md shadow-md">
            <input
              type="text"
              placeholder="Pet Name"
              value={newPet.name}
              onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Species"
              value={newPet.species}
              onChange={(e) => setNewPet({ ...newPet, species: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Color"
              value={newPet.color}
              onChange={(e) => setNewPet({ ...newPet, color: e.target.value })}
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Gender"
              value={newPet.gender}
              onChange={(e) => setNewPet({ ...newPet, gender: e.target.value })}
              className="w-full border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Weight (kg)"
              value={newPet.weight}
              onChange={(e) => setNewPet({ ...newPet, weight: e.target.value })}
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={newPet.image_url}
              onChange={(e) => setNewPet({ ...newPet, image_url: e.target.value })}
              className="w-full border p-2 rounded"
            />
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                ✅ Save
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                ❌ Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ✅ Logout */}
      <div className="mt-6">
        <LogoutButton />
      </div>
    </div>
  );
};

export default UserDashboard;
