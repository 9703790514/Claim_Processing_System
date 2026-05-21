import React, { useState, useEffect } from "react";
import "./FieldDoctor.css";
 
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import axios from "axios";
 
const FieldDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    _id: null,
    email: "",
    username: "",
    role: "FieldOfficer",
    firstName: "",
    lastName: "",
    contactPhone: "",
    createdAt: "",
    lastLoginAt: "",
    status: "",
    associatedPolicyHolderId: null,
    associatedHospitalId: null,
    address: "", // changed to string
    password: "",
    specialization: "",
    isAvailable: false,
  });
 
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    fetchDoctors();
  }, []);
 
  const fetchDoctors = () => {
    axios
      .get("http://localhost:9197/api/users")
      .then((response) => {
        setDoctors(
          response.data.filter((officer) => officer.role === "FieldOfficer")
        );
        setError(null);
      })
      .catch((error) => {
        setError(error);
      });
  };
 
  if (error) return <div>Error Loading Data</div>;
 
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{7,15}$/;
 
  const validateForm = () => {
    if (
      !form.email ||
      !form.firstName ||
      !form.lastName ||
      !form.contactPhone ||
      !form.specialization ||
      !form.address
    ) {
      alert("Please fill in all fields.");
      return false;
    }
    if (!emailRegex.test(form.email)) {
      alert("Please enter a valid email address.");
      return false;
    }
    if (!phoneRegex.test(form.contactPhone)) {
      alert("Please enter a valid phone number (7-15 digits).");
      return false;
    }
    return true;
  };
 
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
 
    if (name === "isAvailable") {
      setForm((prev) => ({
        ...prev,
        isAvailable: type === "checkbox" ? checked : value,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
 
  const handleAdd = async () => {
    if (!validateForm()) return;
 
    try {
      const newDoctor = {
        email: form.email,
        username: "",
        role: "FieldOfficer",
        firstName: form.firstName,
        lastName: form.lastName,
        contactPhone: form.contactPhone,
        createdAt: new Date().toISOString(),
        lastLoginAt: null,
        status: "Active",
        associatedPolicyHolderId: null,
        associatedHospitalId: null,
        address: form.address,
        password: form.contactPhone, // default if empty
        specialization: form.specialization,
        isAvailable: form.isAvailable,
      };
      const response = await axios.post(
        "http://localhost:9197/api/users",
        newDoctor
      );
      console.log("Doctor added:", response.data);
      fetchDoctors();
      resetForm();
    } catch (err) {
      console.error("Error adding doctor:", err);
    }
  };
 
  const handleEdit = (doctor) => {
    setForm({
      _id: doctor._id || null,
      email: doctor.email || "",
      username: doctor.username || "",
      role: doctor.role || "FieldOfficer",
      firstName: doctor.firstName || "",
      lastName: doctor.lastName || "",
      contactPhone: doctor.contactPhone || "",
      createdAt: doctor.createdAt || "",
      lastLoginAt: doctor.lastLoginAt || "",
      status: doctor.status || "",
      associatedPolicyHolderId: doctor.associatedPolicyHolderId || null,
      associatedHospitalId: doctor.associatedHospitalId || null,
      address: doctor.address || "",
      password: doctor.password || "",
      specialization: doctor.specialization || "",
      isAvailable: !!doctor.isAvailable,
    });
    setIsEditing(true);
  };
 
  const handleUpdate = async () => {
    if (!validateForm()) return;
    if (!form._id) {
      alert("Invalid doctor ID");
      return;
    }
 
    try {
      await axios.put(`http://localhost:9197/api/users/${form._id}`, form);
      fetchDoctors();
      resetForm();
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating doctor:", err);
    }
  };
 
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      try {
        await axios.delete(`http://localhost:9197/api/users/${id}`);
        fetchDoctors();
      } catch (err) {
        console.error("Error deleting doctor:", err);
      }
    }
  };
 
  const resetForm = () => {
    setForm({
      _id: null,
      email: "",
      username: "",
      role: "FieldOfficer",
      firstName: "",
      lastName: "",
      contactPhone: "",
      createdAt: "",
      lastLoginAt: "",
      status: "",
      associatedPolicyHolderId: null,
      associatedHospitalId: null,
      address: "", // reset as empty string
      password: "",
      specialization: "",
      isAvailable: false,
    });
  };
 
  return (
    <div className="fielddoctor">
      <div className="container">
        <h2 className="heading">Field Doctors</h2>
 
        <table className="doctor-table">
          <thead>
            <tr>
              <th>Email ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Phone Number</th>
              <th>Medical Specialisation</th>
              <th>Address</th>
              <th>Available</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  No doctors found.
                </td>
              </tr>
            ) : (
              doctors.map((doctor) => (
                <tr key={doctor._id} className="table-row">
                  <td>{doctor.email}</td>
                  <td>{doctor.firstName}</td>
                  <td>{doctor.lastName}</td>
                  <td>{doctor.contactPhone}</td>
                  <td>{doctor.specialization}</td>
                  <td>{doctor.address}</td>
                  <td>{doctor.isAvailable ? "Yes" : "No"}</td>
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        className="btn update-btn"
                        onClick={() => handleEdit(doctor)}
                        title="Edit"
                      >
                        <FiEdit />
                      </button>
                      <button
                        className="btn delete-btn"
                        onClick={() => handleDelete(doctor._id)}
                        title="Delete"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
 
        <div className="form-container">
          <h3 className="form-heading">
            {isEditing ? "Update Doctor" : "Add Doctor"}
          </h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              isEditing ? handleUpdate() : handleAdd();
            }}
          >
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email ID:
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="example@mail.com"
                disabled={isEditing}
              />
            </div>
            <div className="form-group">
              <label htmlFor="firstName" className="form-label">
                First Name:
              </label>
              <input
                id="firstName"
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="John"
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName" className="form-label">
                Last Name:
              </label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="Doe"
              />
            </div>
            <div className="form-group">
              <label htmlFor="contactPhone" className="form-label">
                Phone Number:
              </label>
              <input
                id="contactPhone"
                type="tel"
                name="contactPhone"
                value={form.contactPhone}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="1234567890"
                pattern="[0-9]{7,15}"
                title="Phone number should be 7 to 15 digits"
              />
            </div>
            <div className="form-group">
              <label htmlFor="specialization" className="form-label">
                Medical Specialisation:
              </label>
              <input
                id="specialization"
                type="text"
                name="specialization"
                value={form.specialization}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="Cardiology"
              />
            </div>
            <div className="form-group">
              <label htmlFor="address" className="form-label">
                Address
              </label>
              <input
                id="address"
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="123 Field St, Bengaluru"
              />
            </div>
            <div className="form-group checkbox-group">
              <label htmlFor="isAvailable" className="form-label">
                Available
              </label>
              <input
                id="isAvailable"
                type="checkbox"
                name="isAvailable"
                checked={form.isAvailable}
                onChange={handleChange}
                className="checkbox-input"
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
                    resetForm();
                    setIsEditing(false);
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
 
export default FieldDoctor;