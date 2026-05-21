import React, { useEffect, useState } from "react";
import "./Role.css";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import axios from "axios";
 
// You can change the endpoint below as needed
const API_URL = "http://localhost:9195/api/roles";
 
const emptyRole = {
  id: "",
  roleName: "",
  description: "",
};
 
const RoleManager = () => {
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState(emptyRole);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
 
  // Fetch roles
  const fetchRoles = () => {
    axios
      .get(API_URL)
      .then((response) => {
        setRoles(response.data);
        setError(null);
      })
      .catch((error) => setError(error));
  };
 
  useEffect(() => {
    fetchRoles();
  }, []);
 
  console.log(roles);
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
 
  const validateForm = () => {
    if (!form.roleName) {
      alert("Role name is required.");
      return false;
    }
    return true;
  };
 
  const handleAdd = async () => {
    if (!validateForm()) return;
    try {
      const res = await axios.post(`http://localhost:9195/api/roles`, form);
      fetchRoles();
      setForm(emptyRole);
      console.log(res);
    } catch (error) {
      alert("Error adding role: " + error.message);
    }
  };
 
  const handleEdit = (role) => {
    setForm(role);
    setIsEditing(true);
  };
 
  const handleUpdate = () => {
    if (!validateForm()) return;
    axios
      .put(`http://localhost:9195/api/roles/${form.id}`, form)
      .then(() => {
        fetchRoles();
        setForm(emptyRole);
        setIsEditing(false);
      })
      .catch((error) => {
        alert("Error updating role: " + error.message);
      });
  };
 
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      axios
        .delete(`http://localhost:9195/api/roles/${id}`)
        .then(() => fetchRoles())
        .catch((error) => {
          alert("Error deleting role: " + error.message);
        });
    }
  };
 
  return (
    <div className="role-manager">
      {/* <h2 className="heading">Role Management</h2> */}
      <div className="container">
        <h2 className="heading">Role Management</h2>
        <table className="role-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Role Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-data">
                  No roles found.
                </td>
              </tr>
            ) : (
              roles.map((role) => (
                <tr key={role.id}>
                  <td>{role.id}</td>
                  <td>{role.roleName}</td>
                  <td>{role.description}</td>
                  <td>
                    <button
                      className="btn update-btn"
                      onClick={() => handleEdit(role)}
                    >
                      <FiEdit />
                    </button>
                    <button
                      className="btn delete-btn"
                      onClick={() => handleDelete(role.id || role._id)}
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="form-container">
          <h3 className="form-heading">
            {isEditing ? "Update Role" : "Add Role"}
          </h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              isEditing ? handleUpdate() : handleAdd();
            }}
          >
            <div className="form-group">
              <label htmlFor="roleName" className="form-label">
                Role Name
              </label>
              <input
                id="roleName"
                name="roleName"
                type="text"
                value={form.roleName}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="e.g. Level1Officer"
              />
            </div>
            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <input
                id="description"
                name="description"
                type="text"
                value={form.description}
                onChange={handleChange}
                className="form-input"
                placeholder="Role description"
              />
            </div>
            <div className="form-buttons">
              <button
                type="submit"
                className={`btn ${isEditing ? "update-btn" : "add-btn"}`}
              >
                {isEditing ? "Update" : "Add"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  className="btn cancel-btn"
                  onClick={() => {
                    setIsEditing(false);
                    setForm(emptyRole);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
 
export default RoleManager;