

import React, { useState } from 'react';
import '../Hospital/admit.css';

// SVG Icons
const IconUser = () => (
  <svg width="32" height="32" fill="#1A3E72" viewBox="0 0 24 24" stroke="none">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 8-4 8-4s8 0 8 4v2H4v-2z" />
  </svg>
);

const IconCalendar = () => (
  <svg width="16" height="16" fill="#708090" viewBox="0 0 24 24" stroke="none" className="icon-inline">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" stroke="#708090" strokeWidth="2" />
    <line x1="8" y1="2" x2="8" y2="6" stroke="#708090" strokeWidth="2" />
  </svg>
);

const IconPhone = () => (
  <svg width="16" height="16" fill="#708090" viewBox="0 0 24 24" stroke="none" className="icon-inline">
    <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.21.49 2.53.76 3.88.76a1 1 0 011 1v3.5a1 1 0 01-1 1C10.07 21 3 13.93 3 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.35.27 2.67.76 3.88a1 1 0 01-.21 1.11l-2.43 2.43z" />
  </svg>
);

const IconMapPin = () => (
  <svg width="16" height="16" fill="#708090" viewBox="0 0 24 24" stroke="none" className="icon-inline">
    <path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zM12 9a2 2 0 110-4 2 2 0 010 4z" />
  </svg>
);

const IconUserCheck = () => (
  <svg width="16" height="16" fill="#708090" viewBox="0 0 24 24" stroke="none" className="icon-inline">
    <circle cx="12" cy="7" r="4" />
    <path d="M5 21v-2a4 4 0 014-4h6a4 4 0 014 4v2" />
    <polyline points="16 11 18 13 22 9" stroke="#708090" strokeWidth="2" fill="none" />
  </svg>
);

const AdmitPatients = () => {
  const [patientData, setPatientData] = useState({
    patientId: '',
    name: '',
    age: '',
    gender: '',
    phone: '',
    address: '',
    emergencyContact: '',
    admissionDate: '',
    roomType: '',
    doctorAssigned: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    if (
      !patientData.patientId ||
      !patientData.name ||
      !patientData.age ||
      !patientData.gender ||
      !patientData.phone ||
      !patientData.address ||
      !patientData.emergencyContact ||
      !patientData.admissionDate ||
      !patientData.roomType ||
      !patientData.doctorAssigned
    ) {
      alert('Please fill all mandatory fields (*)');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:9092/hospital/admitpatient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 
          'Access-Control-Allow-Origin': '*' },
        
        body: JSON.stringify(patientData),
      });

      if (response.ok) {
        alert('Patient admitted successfully!');
        setPatientData({
          patientId: '',
          name: '',
          age: '',
          gender: '',
          phone: '',
          address: '',
          emergencyContact: '',
          admissionDate: '',
          roomType: '',
          doctorAssigned: '',
        });
      } else {
        alert('Failed to admit patient. Please try again.');
      }
    } catch (error) {
      alert('Error connecting to server. Please try again.');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="medical-container">
      <div className="medical-wrapper">
        <div className="medical-max-width">
          <div className="medical-main-card">
            <div className="medical-header">
              <IconUser />
              <h2 className="main-title">Admit Patients</h2>
            </div>

            <form className="form-section" onSubmit={handleSubmit}>
              {/* Patient ID and Name */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="patientId">Patient ID *</label>
                  <input
                    id="patientId"
                    type="text"
                    value={patientData.patientId}
                    onChange={(e) => setPatientData({ ...patientData, patientId: e.target.value })}
                    className="form-input"
                    placeholder="Enter unique patient ID"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="name">Full Name *</label>
                  <input
                    id="name"
                    type="text"
                    value={patientData.name}
                    onChange={(e) => setPatientData({ ...patientData, name: e.target.value })}
                    className="form-input"
                    placeholder="Enter patient's full name"
                  />
                </div>
              </div>

              {/* Age and Gender */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="age">Age *</label>
                  <input
                    id="age"
                    type="number"
                    value={patientData.age}
                    onChange={(e) => setPatientData({ ...patientData, age: e.target.value })}
                    className="form-input"
                    placeholder="Enter age"
                    min="0"
                    max="150"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="gender">Gender *</label>
                  <select
                    id="gender"
                    value={patientData.gender}
                    onChange={(e) => setPatientData({ ...patientData, gender: e.target.value })}
                    className="form-select"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Phone and Emergency Contact */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="phone">
                    <IconPhone /> Phone Number *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={patientData.phone}
                    onChange={(e) => setPatientData({ ...patientData, phone: e.target.value })}
                    className="form-input"
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="emergencyContact">Emergency Contact *</label>
                  <input
                    id="emergencyContact"
                    type="tel"
                    value={patientData.emergencyContact}
                    onChange={(e) => setPatientData({ ...patientData, emergencyContact: e.target.value })}
                    className="form-input"
                    placeholder="Enter emergency contact number"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="form-group">
                <label className="form-label" htmlFor="address">
                  <IconMapPin /> Address *
                </label>
                <textarea
                  id="address"
                  value={patientData.address}
                  onChange={(e) => setPatientData({ ...patientData, address: e.target.value })}
                  className="form-textarea"
                  rows="3"
                  placeholder="Enter complete address"
                />
              </div>

              {/* Admission Date and Room Type */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="admissionDate">
                    <IconCalendar /> Admission Date *
                  </label>
                  <input
                    id="admissionDate"
                    type="date"
                    value={patientData.admissionDate}
                    onChange={(e) => setPatientData({ ...patientData, admissionDate: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="roomType">Room Type *</label>
                  <select
                    id="roomType"
                    value={patientData.roomType}
                    onChange={(e) => setPatientData({ ...patientData, roomType: e.target.value })}
                    className="form-select"
                  >
                    <option value="">Select Room Type</option>
                    <option value="General Ward">General Ward</option>
                    <option value="Semi Private">Semi Private</option>
                    <option value="Private">Private</option>
                    <option value="ICU">ICU</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
              </div>

              {/* Doctor Assigned */}
              <div className="form-group">
                <label className="form-label" htmlFor="doctorAssigned">
                  <IconUserCheck /> Doctor Assigned *
                </label>
                <input
                  id="doctorAssigned"
                  type="text"
                  value={patientData.doctorAssigned}
                  onChange={(e) => setPatientData({ ...patientData, doctorAssigned: e.target.value })}
                  className="form-input"
                  placeholder="Enter assigned doctor's name"
                />
              </div>

              {/* Submit Button */}
              <div className="submit-container">
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Admitting..." : "Admit Patient"}
                </button>
              </div>

              {/* Info Box */}
              <div className="info-box">
                <h3 className="info-title">Important Information</h3>
                <ul className="info-text">
                  <li>• All fields marked with * are mandatory</li>
                  <li>• Patient ID must be unique in the system</li>
                  <li>• Emergency contact should be easily reachable</li>
                  <li>• Room assignment will be confirmed based on availability</li>
                </ul>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmitPatients;
