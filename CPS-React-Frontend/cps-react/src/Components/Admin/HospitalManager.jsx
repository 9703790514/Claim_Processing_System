import React, { useEffect, useState } from "react";
import "./HospitalManager.css";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import axios from "axios";
 
const HospitalManager = ({ initialData }) => {
  const [hospitals, setHospitals] = useState(initialData || []);
  const [form, setForm] = useState({
    _id: null,
    name: "",
    email: "",
    contact: "",
    isNetwork: true,
    networkId: "",
    address: { street: "", city: "", state: "", pincode: "" },
    images: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
 
  const fetchHospitals = () => {
    axios
      .get("http://localhost:9196/api/hospitals")
      .then((response) => setHospitals(response.data))
      .catch((error) => setError(error));
  };
 
  useEffect(() => {
    fetchHospitals();
  }, []);
 
  console.log(hospitals);
 
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{7,15}$/;
 
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        address: { ...prev.address, [key]: value },
      }));
    } else if (name === "isNetwork") {
      setForm((prev) => ({ ...prev, isNetwork: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };
 
  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, images: Array.from(e.target.files) }));
  };
 
  const validateForm = () => {
    if (
      !form.email ||
      !form.address.street ||
      !form.address.city ||
      !form.address.state ||
      !form.address.pincode
    ) {
      alert("Please fill in all required fields.");
      return false;
    }
    if (!emailRegex.test(form.email)) {
      alert("Please enter a valid email address.");
      return false;
    }
    if (form.contact && !phoneRegex.test(form.contact)) {
      alert("Please enter a valid contact number (7-15 digits).");
      return false;
    }
    return true;
  };
 
  const handleAdd = () => {
    if (!validateForm()) return;
    const newHospital = {
      _id: null,
      name: form.name,
      email: form.email,
      contact: form.contact,
      isNetwork: form.isNetwork,
      networkId: form.networkId ? form.networkId : "",
      address: { ...form.address },
      // images: form.images,
    };
 
    axios
      .post("http://localhost:9196/api/hospitals", newHospital)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
 
    resetForm();
  };
 
  const handleEdit = (hospital) => {
    setForm({
      _id: hospital._id ?? hospital.id ?? "",
      name: hospital.name ?? "",
      email: hospital.email ?? "",
      contact:
        hospital.contact ?? hospital.contactPhone ?? hospital.phone ?? "",
      isNetwork:
        hospital.isNetwork ?? hospital.type === "Networked" ? true : false,
      networkId: hospital.networkId ?? "",
      address: hospital.address ?? {
        street: "",
        city: "",
        state: "",
        pincode: "",
      },
      images: hospital.images ?? [],
    });
    setIsEditing(true);
  };
 
  const handleUpdate = () => {
    if (!validateForm()) return;
 
    axios
      .post("http://localhost:9196/api/hospitals", form)
      .then((response) => {
        console.log(response);
        fetchHospitals();
      })
      .catch((error) => {
        console.log(error);
      });
 
    // setHospitals((prev) =>
    //   prev.map((h) => (h._id === form._id ? { ...form } : h))
    // );
    resetForm();
    setIsEditing(false);
  };
 
  const handleDelete = (_id) => {
    if (window.confirm("Are you sure you want to delete this hospital?")) {
      // setHospitals((prev) => prev.filter((h) => h._id !== _id));
      axios
        .delete(`http://localhost:9196/api/hospitals/${_id}`)
        .then((response) => {
          console.log(response);
          fetchHospitals();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
 
  const resetForm = () => {
    setForm({
      _id: null,
      name: "",
      email: "",
      contact: "",
      isNetwork: true,
      networkId: "",
      address: { street: "", city: "", state: "", pincode: "" },
      images: [],
    });
  };
 
  if (error) return <div>Error Loading Data</div>;
 
  return (
    <div className="hospital-manager">
      <div className="container">
        <h2 className="heading">Manage Hospitals</h2>
        <table className="hospital-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Networked</th>
              <th>Network ID</th>
              <th>Address</th>
              <th>Images</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {hospitals.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  No hospitals found.
                </td>
              </tr>
            ) : (
              hospitals.map((hospital) => (
                <tr key={hospital.id}>
                  {/* Show "-" if data is missing */}
                  <td>{hospital.firstName}</td>
                  <td>{hospital.email || "-"}</td>
                  <td>{hospital.contactPhone}</td>
                  <td>{hospital.network ? "Yes" : "No"}</td>
                  <td>{hospital.networkId}</td>
                  <td>
                    {hospital.address
                      ? `${hospital.address.street || ""}, ${
                          hospital.address.city || ""
                        }, ${hospital.address.state || ""} - ${
                          hospital.address.pincode || ""
                        }`
                      : "-"}
                  </td>
                  <td>
                    {hospital.images && hospital.images.length > 0
                      ? hospital.images.map((file, idx) => (
                          <span key={idx} className="image-name">
                            {file.name || file}
                          </span>
                        ))
                      : "No images"}
                  </td>
                  <td>
                    <div className="buttons">
                      <button
                        className="btn update-btn"
                        onClick={() => handleEdit(hospital)}
                      >
                        <FiEdit />
                      </button>
                      <button
                        className="btn delete-btn"
                        onClick={() => handleDelete(hospital.id)}
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
            {isEditing ? "Update Hospital" : "Add Hospital"}
          </h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              isEditing ? handleUpdate() : handleAdd();
            }}
          >
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Name:
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="form-input"
                placeholder="Hospital Name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email:
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="example@hospital.com"
              />
            </div>
            <div className="form-group">
              <label htmlFor="contact" className="form-label">
                Contact:
              </label>
              <input
                id="contact"
                type="tel"
                name="contact"
                value={form.contact}
                onChange={handleChange}
                className="form-input"
                placeholder="Contact Number"
                pattern="[0-9]{7,15}"
                title="Contact number should be 7 to 15 digits"
              />
            </div>
            <div className="form-group checkbox-group">
              <label htmlFor="isNetwork" className="form-label">
                Networked:
              </label>
              <input
                id="isNetwork"
                type="checkbox"
                name="isNetwork"
                checked={form.isNetwork}
                onChange={handleChange}
              />
            </div>
            {form.isNetwork && (
              <div className="form-group">
                <label htmlFor="networkId" className="form-label">
                  Network ID:
                </label>
                <input
                  id="networkId"
                  type="text"
                  name="networkId"
                  value={form.networkId}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter Network ID"
                />
              </div>
            )}
            <div className="form-group">
              <label htmlFor="street" className="form-label">
                Street:
              </label>
              <input
                id="street"
                type="text"
                name="address.street"
                value={form.address.street}
                onChange={handleChange}
                className="form-input"
                placeholder="Street Address"
              />
            </div>
            <div className="form-group">
              <label htmlFor="city" className="form-label">
                City:
              </label>
              <input
                id="city"
                type="text"
                name="address.city"
                value={form.address.city}
                onChange={handleChange}
                className="form-input"
                placeholder="City"
              />
            </div>
            <div className="form-group">
              <label htmlFor="state" className="form-label">
                State:
              </label>
              <input
                id="state"
                type="text"
                name="address.state"
                value={form.address.state}
                onChange={handleChange}
                className="form-input"
                placeholder="State"
              />
            </div>
            <div className="form-group">
              <label htmlFor="pincode" className="form-label">
                Pincode:
              </label>
              <input
                id="pincode"
                type="text"
                name="address.pincode"
                value={form.address.pincode}
                onChange={handleChange}
                className="form-input"
                placeholder="Pincode"
              />
            </div>
            <div className="form-group">
              <label htmlFor="images" className="form-label">
                Images:
              </label>
              <input
                id="images"
                type="file"
                name="images"
                onChange={handleFileChange}
                className="form-input"
                multiple
                accept="image/*"
              />
              {form.images.length > 0 && (
                <div className="selected-images">
                  {form.images.map((file, idx) => (
                    <span key={idx} className="image-name">
                      {file.name}
                    </span>
                  ))}
                </div>
              )}
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
                    resetForm();
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
 
export default HospitalManager