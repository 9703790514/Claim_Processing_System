import React, { useEffect, useState } from "react";
import "./PolicyDetailManager.css";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import axios from "axios";
 
const emptyPolicy = {
  id: "",
  policyNo: "",
  productId: "",
  policyHolderId: "",
  startDate: "",
  endDate: "",
  sumAssured: "",
  status: "Active",
  premiums: [],
  deductibles: {
    coPayPercentage: "",
  },
  covers: [],
  exclusions: [],
  preExistingDiseasesDisclosed: [],
  freeLookPeriodEnd: "",
  minClaimPeriodEnd: "",
};
 
const PolicyDetailManager = () => {
  const [policies, setPolicies] = useState([]);
  const [form, setForm] = useState(emptyPolicy);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
 
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:9194/api/policies")
      .then((res) => setPolicies(res.data))
      .catch((err) => {
        setError(err);
        alert("Error loading policies: " + err.message);
      })
      .finally(() => setLoading(false));
  }, []);
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("deductibles.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        deductibles: { ...prev.deductibles, [key]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };
 
  // Premiums handlers
  const handlePremiumChange = (index, e) => {
    const { name, value } = e.target;
    const premiumsCopy = [...form.premiums];
    premiumsCopy[index] = { ...premiumsCopy[index], [name]: value };
    setForm((prev) => ({ ...prev, premiums: premiumsCopy }));
  };
 
  const addPremium = () =>
    setForm((prev) => ({
      ...prev,
      premiums: [...prev.premiums, { dueDate: "", amount: "", status: "Due" }],
    }));
 
  const removePremium = (index) => {
    const premiumsCopy = [...form.premiums];
    premiumsCopy.splice(index, 1);
    setForm((prev) => ({ ...prev, premiums: premiumsCopy }));
  };
 
  // Covers handlers
  const addCover = () =>
    setForm((prev) => ({ ...prev, covers: [...prev.covers, ""] }));
 
  const handleCoverChange = (idx, value) => {
    const coversCopy = [...form.covers];
    coversCopy[idx] = value;
    setForm((prev) => ({ ...prev, covers: coversCopy }));
  };
 
  const removeCover = (idx) => {
    const coversCopy = [...form.covers];
    coversCopy.splice(idx, 1);
    setForm((prev) => ({ ...prev, covers: coversCopy }));
  };
 
  // Exclusions handlers
  const addExclusion = () =>
    setForm((prev) => ({ ...prev, exclusions: [...prev.exclusions, ""] }));
 
  const handleExclusionChange = (idx, value) => {
    const exclusionsCopy = [...form.exclusions];
    exclusionsCopy[idx] = value;
    setForm((prev) => ({ ...prev, exclusions: exclusionsCopy }));
  };
 
  const removeExclusion = (idx) => {
    const exclusionsCopy = [...form.exclusions];
    exclusionsCopy.splice(idx, 1);
    setForm((prev) => ({ ...prev, exclusions: exclusionsCopy }));
  };
 
  // Pre-existing diseases handlers
  const addPreExistingDisease = () =>
    setForm((prev) => ({
      ...prev,
      preExistingDiseasesDisclosed: [...prev.preExistingDiseasesDisclosed, ""],
    }));
 
  const handlePreExistingChange = (idx, value) => {
    const copy = [...form.preExistingDiseasesDisclosed];
    copy[idx] = value;
    setForm((prev) => ({ ...prev, preExistingDiseasesDisclosed: copy }));
  };
 
  const removePreExistingDisease = (idx) => {
    const copy = [...form.preExistingDiseasesDisclosed];
    copy.splice(idx, 1);
    setForm((prev) => ({ ...prev, preExistingDiseasesDisclosed: copy }));
  };
 
  const validateForm = () => {
    if (!form.id || !form.policyNo || !form.policyHolderId) {
      alert("ID, Policy Number, and Policy Holder ID are required.");
      return false;
    }
    return true;
  };
 
  const handleAdd = async () => {
    if (!validateForm()) return;
    try {
      await axios
        .post("http://localhost:9194/api/policies", form)
        .then((response) => {
          console.log(response);
        });
 
      setForm(emptyPolicy);
      setIsEditing(false);
    } catch (error) {
      alert("Add failed: " + error.message);
    }
  };
 
  const handleEdit = (policy) => {
    setForm({
      ...policy,
      premiums: policy.premiums || [],
      covers: policy.covers || [],
      exclusions: policy.exclusions || [],
      preExistingDiseasesDisclosed: policy.preExistingDiseasesDisclosed || [],
      deductibles: policy.deductibles || { coPayPercentage: "" },
    });
    setIsEditing(true);
  };
 
  const handleUpdate = async () => {
    if (!validateForm()) return;
    try {
      const res = await axios.put(
        `http://localhost:9194/api/policies/${form.id}`,
        form
      );
      setPolicies((prev) => prev.map((p) => (p.id === form.id ? res.data : p)));
      setForm(emptyPolicy);
      setIsEditing(false);
    } catch (error) {
      alert("Update failed: " + error.message);
    }
  };
 
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this policy?")) return;
    try {
      await axios.delete(`http://localhost:9194/api/policies/${id}`);
      setPolicies((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      alert("Delete failed: " + error.message);
    }
  };
 
  return (
    <div className="policy-manager">
      <div className="container">
        <h2 className="heading">Policy Detail Manager</h2>
 
        {loading && <p>Loading...</p>}
        {error && <p className="error">Error loading policies</p>}
 
        <table className="policy-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Policy No</th>
              <th>Product ID</th>
              <th>Policy Holder ID</th>
              <th>Status</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {policies.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  No policies found.
                </td>
              </tr>
            ) : (
              policies.map((policy) => (
                <tr key={policy.id}>
                  <td>{policy.id}</td>
                  <td>{policy.policyNo}</td>
                  <td>{policy.productId}</td>
                  <td>{policy.policyHolderId}</td>
                  <td>{policy.status}</td>
                  <td>
                    {policy.startDate
                      ? new Date(policy.startDate).toLocaleDateString()
                      : ""}
                  </td>
                  <td>
                    {policy.endDate
                      ? new Date(policy.endDate).toLocaleDateString()
                      : ""}
                  </td>
                  <td>
                    <button
                      className="btn update-btn"
                      onClick={() => handleEdit(policy)}
                    >
                      <FiEdit />
                    </button>
                    <button
                      className="btn delete-btn"
                      onClick={() => handleDelete(policy.id)}
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
            {isEditing ? "Update Policy" : "Add Policy"}
          </h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              isEditing ? handleUpdate() : handleAdd();
            }}
          >
            <div className="form-group">
              <label htmlFor="id" className="form-label">
                ID
              </label>
              <input
                id="id"
                name="id"
                type="text"
                value={form.id}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="policyNo" className="form-label">
                Policy Number
              </label>
              <input
                id="policyNo"
                name="policyNo"
                type="text"
                value={form.policyNo}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="productId" className="form-label">
                Product ID
              </label>
              <input
                id="productId"
                name="productId"
                type="text"
                value={form.productId}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="policyHolderId" className="form-label">
                Policy Holder ID
              </label>
              <input
                id="policyHolderId"
                name="policyHolderId"
                type="text"
                value={form.policyHolderId}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <input
                id="status"
                name="status"
                type="text"
                value={form.status}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="sumAssured" className="form-label">
                Sum Assured
              </label>
              <input
                id="sumAssured"
                name="sumAssured"
                type="number"
                value={form.sumAssured}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="startDate" className="form-label">
                Start Date
              </label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={form.startDate ? form.startDate.substr(0, 10) : ""}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="endDate" className="form-label">
                End Date
              </label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                value={form.endDate ? form.endDate.substr(0, 10) : ""}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="freeLookPeriodEnd" className="form-label">
                Free Look Period End
              </label>
              <input
                id="freeLookPeriodEnd"
                name="freeLookPeriodEnd"
                type="date"
                value={
                  form.freeLookPeriodEnd
                    ? form.freeLookPeriodEnd.substr(0, 10)
                    : ""
                }
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="minClaimPeriodEnd" className="form-label">
                Min Claim Period End
              </label>
              <input
                id="minClaimPeriodEnd"
                name="minClaimPeriodEnd"
                type="date"
                value={
                  form.minClaimPeriodEnd
                    ? form.minClaimPeriodEnd.substr(0, 10)
                    : ""
                }
                onChange={handleChange}
                className="form-input"
              />
            </div>
 
            {/* Deductibles */}
            <div className="form-group">
              <label
                htmlFor="deductibles.coPayPercentage"
                className="form-label"
              >
                Co-Pay Percentage
              </label>
              <input
                id="deductibles.coPayPercentage"
                name="deductibles.coPayPercentage"
                type="number"
                min="0"
                max="100"
                value={form.deductibles.coPayPercentage || ""}
                onChange={handleChange}
                className="form-input"
              />
            </div>
 
            {/* Premiums */}
            <fieldset className="premiums">
              <legend>Premiums</legend>
              {form.premiums.map((prem, idx) => (
                <div key={idx} className="form-group premium-row">
                  <input
                    type="date"
                    name="dueDate"
                    value={prem.dueDate ? prem.dueDate.substr(0, 10) : ""}
                    onChange={(e) => handlePremiumChange(idx, e)}
                    required
                    className="form-input premium-input"
                  />
                  <input
                    type="number"
                    name="amount"
                    value={prem.amount}
                    onChange={(e) => handlePremiumChange(idx, e)}
                    placeholder="Amount"
                    required
                    min={0}
                    className="form-input premium-input"
                  />
                  <select
                    name="status"
                    value={prem.status}
                    onChange={(e) => handlePremiumChange(idx, e)}
                    className="form-input premium-input"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Due">Due</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                  <button
                    type="button"
                    className="btn delete-btn premium-remove-btn"
                    onClick={() => removePremium(idx)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn add-btn"
                onClick={addPremium}
              >
                Add Premium
              </button>
            </fieldset>
 
            {/* Covers */}
            <fieldset className="covers">
              <legend>Covers</legend>
              {form.covers.map((cover, idx) => (
                <div key={idx} className="form-group cover-row">
                  <input
                    type="text"
                    value={cover}
                    onChange={(e) => handleCoverChange(idx, e.target.value)}
                    required
                    className="form-input cover-input"
                  />
                  <button
                    type="button"
                    className="btn delete-btn cover-remove-btn"
                    onClick={() => removeCover(idx)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" className="btn add-btn" onClick={addCover}>
                Add Cover
              </button>
            </fieldset>
 
            {/* Exclusions */}
            <fieldset className="exclusions">
              <legend>Exclusions</legend>
              {form.exclusions.map((exclusion, idx) => (
                <div key={idx} className="form-group exclusion-row">
                  <input
                    type="text"
                    value={exclusion}
                    onChange={(e) => handleExclusionChange(idx, e.target.value)}
                    required
                    className="form-input exclusion-input"
                  />
                  <button
                    type="button"
                    className="btn delete-btn exclusion-remove-btn"
                    onClick={() => removeExclusion(idx)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn add-btn"
                onClick={addExclusion}
              >
                Add Exclusion
              </button>
            </fieldset>
 
            {/* Pre-existing Diseases */}
            <fieldset className="pre-existing-diseases">
              <legend>Pre-existing Diseases Disclosed</legend>
              {form.preExistingDiseasesDisclosed.map((disease, idx) => (
                <div key={idx} className="form-group disease-row">
                  <input
                    type="text"
                    value={disease}
                    onChange={(e) =>
                      handlePreExistingChange(idx, e.target.value)
                    }
                    required
                    className="form-input disease-input"
                  />
                  <button
                    type="button"
                    className="btn delete-btn disease-remove-btn"
                    onClick={() => removePreExistingDisease(idx)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn add-btn"
                onClick={addPreExistingDisease}
              >
                Add Disease
              </button>
            </fieldset>
 
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
                    setForm(emptyPolicy);
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
 
export default PolicyDetailManager;