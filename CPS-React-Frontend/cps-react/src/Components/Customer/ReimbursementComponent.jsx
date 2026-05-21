
import React, { useState } from 'react';
import { API_ROUTES } from '../../utils/api';
import './res.css'; 

const ReimbursementComponent = () => {
  const [formData, setFormData] = useState({
    policyId: '',
    policyHolderId: '',
    dateOfBirth: '',
    contactNumber: '',
    emailAddress: '',
    relationshipToPatient: '',
    claimType: '',
    admissionDate: '',
    dischargeDate: '',
    hospitalId: '',
    hospitalName: '',
    doctorName: '',
    ailment: '',
    diagnosis: '',
    totalClaimAmount: '',
    additionalNotes: '',
    declaration: false 
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(''); 

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: (file.size / 1024).toFixed(2) + ' KB',
      type: file.type
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.policyId) newErrors.policyId = 'Policy ID is required';
      if (!formData.policyHolderId) newErrors.policyHolderId = 'Policyholder ID is required';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
         const phoneRegex = /^\+91\s\d{10}$/;
    if (!formData.contactNumber) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!phoneRegex.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Phone number must start with +91 followed by 10 digits (e.g. +91 9234567890)';
    }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.emailAddress) {
      newErrors.emailAddress = 'Email address is required';
    } else if (!emailRegex.test(formData.emailAddress)) {
      newErrors.emailAddress = 'Enter a valid email address (e.g. abc@example.com)';
    }
      if (!formData.relationshipToPatient) newErrors.relationshipToPatient = 'Relationship to patient is required';
    }

    if (step === 2) {
      if (!formData.claimType) newErrors.claimType = 'Claim type is required';
      if (!formData.admissionDate) newErrors.admissionDate = 'Admission date is required';
      if (!formData.hospitalName) newErrors.hospitalName = 'Hospital name is required';
      if (!formData.hospitalId) newErrors.hospitalId = 'Hospital ID is required';
      if (!formData.doctorName) newErrors.doctorName = 'Doctor name is required';
      if (!formData.ailment) newErrors.ailment = 'Ailment is required';
      if (!formData.diagnosis) newErrors.diagnosis = 'Diagnosis is required';
      if (!formData.totalClaimAmount) newErrors.totalClaimAmount = 'Claim amount is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

const buildClaimData = () => {
  const toISOInstant = (localDateTime) => {
    if (!localDateTime) return null;
    return new Date(localDateTime).toISOString();
  };

  return {
    claimNo: `CLM-${Date.now()}`,
    policyId: formData.policyId,
    policyHolderId: formData.policyHolderId,
    claimType: formData.claimType,
    hospitalId: formData.hospitalId,
    hospitalName: formData.hospitalName,
    admissionDate: toISOInstant(formData.admissionDate),
    dischargeDate: toISOInstant(formData.dischargeDate),
    ailment: formData.ailment,
    diagnosis: formData.diagnosis,
    totalClaimAmount: Number(formData.totalClaimAmount) || 0,
    status: "status_raised",
    claimDate: new Date().toISOString(),
    documents: uploadedFiles.map(file => ({
      documentType: "Uploaded Document",
      documentId: `DOC-${file.id}`,
      isOriginal: true,
      submissionDate: new Date().toISOString(),
      status: "Received",
      notes: "",
      verifiedBy: null,
    })),
    approvalNotes: formData.additionalNotes,
    deductionsApplied: {
      voluntaryDeductibleAmount: 0,
      outOfNetworkDeductibleAmount: 0,
      coPayAmount: 0,
      otherDeductions: 0,
      totalDeductions: 0
    }
  };
};


  const handleSubmit = async () => {
    if (!formData.declaration) {
      setErrors(prev => ({ ...prev, declaration: 'You must agree to the declaration to submit.' }));
      return;
    } else {
      setErrors(prev => ({ ...prev, declaration: '' }));
    }

    if (validateStep(2)) {
      const claimData = buildClaimData();
      setSubmitError('');
      try {
        const response = await fetch(API_ROUTES.CUSTOMER.ADD_CLAIM, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(claimData)
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
          throw new Error(`Failed to submit claim: ${errorData.message || response.statusText}`);
        }

        setIsSubmitted(true);
        console.log('Claim submitted successfully:', claimData);
      } catch (error) {
        setSubmitError(error.message || 'There was an error submitting your claim. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      policyId: '',
      policyHolderId: '',
      dateOfBirth: '',
      contactNumber: '',
      emailAddress: '',
      relationshipToPatient: '',
      claimType: '',
      admissionDate: '',
      dischargeDate: '',
      hospitalId: '',
      hospitalName: '',
      doctorName: '',
      ailment: '',
      diagnosis: '',
      totalClaimAmount: '',
      additionalNotes: '',
      declaration: false
    });
    setUploadedFiles([]);
    setCurrentStep(1);
    setIsSubmitted(false);
    setErrors({});
    setSubmitError('');
  };

  if (isSubmitted) {
    return (
      <div className="reimbursement-container">
        <div className="reimbursement-maxWidth">
          <div className="reimbursement-successCard">
            <div className="reimbursement-successIcon">
              <span style={{ color: '#16a34a', fontSize: '32px' }}>✓</span>
            </div>
            <h2 className="reimbursement-title">
              Claim Submitted Successfully!
            </h2>
            <p className="reimbursement-subtitle" style={{ marginBottom: '16px' }}>
              Your claim has been submitted for review. You'll receive an email confirmation shortly.
            </p>
            <button
              onClick={resetForm}
              className="reimbursement-buttonPrimary"
            >
              Submit Another Claim
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reimbursement-container">
      <div className="reimbursement-maxWidth">
        <div className="reimbursement-header">
          <h1 className="reimbursement-title">
            Submit Health Insurance Claim
          </h1>
          <p className="reimbursement-subtitle">Enter your claim details for processing</p>
        </div>
        <div className="reimbursement-progressContainer">
          <div className="reimbursement-progressSteps">
            {[1, 2, 3].map((step) => (
              <div key={step} className="reimbursement-step">
                <div
                  className={`reimbursement-stepCircle ${
                    currentStep >= step ? 'reimbursement-stepCircleActive' : 'reimbursement-stepCircleInactive'
                  }`}
                >
                  {step}
                </div>
                <span className="reimbursement-stepLabel">
                  {step === 1 && 'Policy & Insured'}
                  {step === 2 && 'Treatment & Claim'}
                  {step === 3 && 'Review & Submit'}
                </span>
                {step < 3 && (
                  <div
                    className={`reimbursement-stepLine ${
                      currentStep > step ? 'reimbursement-stepLineActive' : 'reimbursement-stepLineInactive'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="reimbursement-formCard">
          {/* Step 1 */}
          {currentStep === 1 && (
            <div>
              <h2 className="reimbursement-sectionTitle">
                Policy & Insured Details
              </h2>
              <div className="reimbursement-grid">
                <div className="reimbursement-inputGroup">
                  <label className="reimbursement-label">
                    Policy ID *
                  </label>
                  <input
                    type="text"
                    name="policyId"
                    value={formData.policyId}
                    onChange={handleInputChange}
                    className={`reimbursement-input ${errors.policyId ? 'reimbursement-inputError' : ''}`}
                    placeholder="Enter policy ID (e.g. pol-001)"
                  />
                  {errors.policyId && (
                    <p className="reimbursement-error">{errors.policyId}</p>
                  )}
                </div>
                <div className="reimbursement-inputGroup">
                  <label className="reimbursement-label">
                    Policyholder ID *
                  </label>
                  <input
                    type="text"
                    name="policyHolderId"
                    value={formData.policyHolderId}
                    onChange={handleInputChange}
                    className={`reimbursement-input ${errors.policyHolderId ? 'reimbursement-inputError' : ''}`}
                    placeholder="Enter policyholder ID"
                  />
                  {errors.policyHolderId && (
                    <p className="reimbursement-error">{errors.policyHolderId}</p>
                  )}
                </div>
                <div className="reimbursement-inputGroup">
                  <label className="reimbursement-label">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className={`reimbursement-input ${errors.dateOfBirth ? 'reimbursement-inputError' : ''}`}
                  />
                  {errors.dateOfBirth && (
                    <p className="reimbursement-error">{errors.dateOfBirth}</p>
                  )}
                </div>
                <div className="reimbursement-inputGroup">
                  <label className="reimbursement-label">
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    className={`reimbursement-input ${errors.contactNumber ? 'reimbursement-inputError' : ''}`}
                  />
                  {errors.contactNumber && (
                    <p className="reimbursement-error">{errors.contactNumber}</p>
                  )}
                </div>
                <div className="reimbursement-inputGroup">
                  <label className="reimbursement-label">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleInputChange}
                    className={`reimbursement-input ${errors.emailAddress ? 'reimbursement-inputError' : ''}`}
                  />
                  {errors.emailAddress && (
                    <p className="reimbursement-error">{errors.emailAddress}</p>
                  )}
                </div>
                <div className="reimbursement-inputGroup">
                  <label className="reimbursement-label">
                    Relationship to Patient *
                  </label>
                  <select
                    name="relationshipToPatient"
                    value={formData.relationshipToPatient}
                    onChange={handleInputChange}
                    className={`reimbursement-select ${errors.relationshipToPatient ? 'reimbursement-inputError' : ''}`}
                  >
                    <option value="">Select Relationship</option>
                    <option value="self">Self</option>
                    <option value="spouse">Spouse</option>
                    <option value="child">Child</option>
                    <option value="parent">Parent</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.relationshipToPatient && (
                    <p className="reimbursement-error">{errors.relationshipToPatient}</p>
                  )}
                </div>
              </div>
              <div className="reimbursement-buttonContainer">
                <div></div>
                <button
                  type="button"
                  onClick={nextStep}
                  className="reimbursement-buttonPrimary"
                >
                  Next Step
                </button>
              </div>
            </div>
          )}
          {/* Step 2 */}
          {currentStep === 2 && (
            <div>
              <h2 className="reimbursement-sectionTitle">
                Treatment & Claim Information
              </h2>
              <div className="reimbursement-grid">
                <div className="reimbursement-inputGroup">
             <label className="reimbursement-label">
  Claim Type *
</label>
<input
  type="text"
  name="claimType"
  value={formData.claimType}
  onChange={handleInputChange}
  className={`reimbursement-input ${errors.claimType ? 'reimbursement-inputError' : ''}`}
  placeholder="Enter claim type (e.g. Cashless or Reimbursement)"
/>
{errors.claimType && (
  <p className="reimbursement-error">{errors.claimType}</p>
)}

                </div>
                <div className="reimbursement-inputGroup">
                  <label className="reimbursement-label">
                    Hospital ID *
                  </label>
                  <input
                    type="text"
                    name="hospitalId"
                    value={formData.hospitalId}
                    onChange={handleInputChange}
                    className={`reimbursement-input ${errors.hospitalId ? 'reimbursement-inputError' : ''}`}
                    placeholder="Enter hospital ID"
                  />
                  {errors.hospitalId && (
                    <p className="reimbursement-error">{errors.hospitalId}</p>
                  )}
                </div>
                <div className="reimbursement-inputGroup">
                  <label className="reimbursement-label">
                    Hospital Name *
                  </label>
                  <input
                    type="text"
                    name="hospitalName"
                    value={formData.hospitalName}
                    onChange={handleInputChange}
                    className={`reimbursement-input ${errors.hospitalName ? 'reimbursement-inputError' : ''}`}
                    placeholder="Enter hospital name"
                  />
                  {errors.hospitalName && (
                    <p className="reimbursement-error">{errors.hospitalName}</p>
                  )}
                </div>
                <div className="reimbursement-inputGroup">
                  <label className="reimbursement-label">
                    Admission Date *
                  </label>
                  <input
                    type="datetime-local"
                    name="admissionDate"
                    value={formData.admissionDate}
                    onChange={handleInputChange}
                    className={`reimbursement-input ${errors.admissionDate ? 'reimbursement-inputError' : ''}`}
                  />
                  {errors.admissionDate && (
                    <p className="reimbursement-error">{errors.admissionDate}</p>
                  )}
                </div>
                <div className="reimbursement-inputGroup">
                  <label className="reimbursement-label">
                    Discharge Date
                  </label>
                  <input
                    type="datetime-local"
                    name="dischargeDate"
                    value={formData.dischargeDate}
                    onChange={handleInputChange}
                    className="reimbursement-input"
                  />
                </div>
                <div className="reimbursement-inputGroup">
                  <label className="reimbursement-label">
                    Ailment *
                  </label>
                  <input
                    type="text"
                    name="ailment"
                    value={formData.ailment}
                    onChange={handleInputChange}
                    className={`reimbursement-input ${errors.ailment ? 'reimbursement-inputError' : ''}`}
                    placeholder="Enter ailment"
                  />
                  {errors.ailment && (
                    <p className="reimbursement-error">{errors.ailment}</p>
                  )}
                </div>
                <div className="reimbursement-inputGroup">
                  <label className="reimbursement-label">
                    Diagnosis *
                  </label>
                  <input
                    type="text"
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={handleInputChange}
                    className={`reimbursement-input ${errors.diagnosis ? 'reimbursement-inputError' : ''}`}
                    placeholder="Enter diagnosis"
                  />
                  {errors.diagnosis && (
                    <p className="reimbursement-error">{errors.diagnosis}</p>
                  )}
                </div>
                <div className="reimbursement-inputGroup">
                  <label className="reimbursement-label">
                    Treating Doctor Name *
                  </label>
                  <input
                    type="text"
                    name="doctorName"
                    value={formData.doctorName}
                    onChange={handleInputChange}
                    className={`reimbursement-input ${errors.doctorName ? 'reimbursement-inputError' : ''}`}
                    placeholder="Enter doctor name"
                  />
                  {errors.doctorName && (
                    <p className="reimbursement-error">{errors.doctorName}</p>
                  )}
                </div>
                <div className="reimbursement-inputGroup">
                  <label className="reimbursement-label">
                    Claimed Amount (₹) *
                  </label>
                  <input
                    type="number"
                    name="totalClaimAmount"
                    value={formData.totalClaimAmount}
                    onChange={handleInputChange}
                    className={`reimbursement-input ${errors.totalClaimAmount ? 'reimbursement-inputError' : ''}`}
                    placeholder="Enter claim amount"
                  />
                  {errors.totalClaimAmount && (
                    <p className="reimbursement-error">{errors.totalClaimAmount}</p>
                  )}
                </div>
                <div className="reimbursement-inputGroup">
                  <label className="reimbursement-label">
                    Additional Notes
                  </label>
                  <textarea
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleInputChange}
                    rows={2}
                    className="reimbursement-textarea"
                    placeholder="Any additional information about the claim"
                  />
                </div>
              </div>
              <div className="reimbursement-buttonContainer">
                <button
                  type="button"
                  onClick={prevStep}
                  className="reimbursement-buttonSecondary"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="reimbursement-buttonPrimary"
                >
                  Next Step
                </button>
              </div>
            </div>
          )}
          {/* Step 3 */}
          {currentStep === 3 && (
            <div>
              <h2 className="reimbursement-sectionTitle">
                Review & Submit
              </h2>
              <div className="reimbursement-inputGroup">
                <label className="reimbursement-label">
                  Upload Supporting Documents
                </label>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="reimbursement-buttonPrimary"
                  style={{ display: 'inline-block', backgroundColor: '#14b8a6' }}
                >
                  Choose Files
                </label>
                {uploadedFiles.length > 0 && (
                  <div className="reimbursement-fileList">
                    <h4 className="reimbursement-label" style={{ marginBottom: '8px' }}>
                      Uploaded Documents:
                    </h4>
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="reimbursement-fileItem">
                        <div>
                          <span>📄 {file.name}</span>
                          <span style={{ color: '#6b7280', marginLeft: '8px' }}>
                            ({file.size})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(file.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            fontSize: '18px'
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="reimbursement-summary">
                <h3 className="reimbursement-sectionTitle" style={{ marginBottom: '16px' }}>
                  Claim Summary
                </h3>
                <div className="reimbursement-summaryGrid">
                  <div><strong>Policy ID:</strong> {formData.policyId}</div>
                  <div><strong>Policyholder ID:</strong> {formData.policyHolderId}</div>
                  <div><strong>Claim Type:</strong> {formData.claimType}</div>
                  <div><strong>Hospital ID:</strong> {formData.hospitalId}</div>
                  <div><strong>Hospital Name:</strong> {formData.hospitalName}</div>
                  <div><strong>Admission Date:</strong> {formData.admissionDate}</div>
                  <div><strong>Discharge Date:</strong> {formData.dischargeDate}</div>
                  <div><strong>Ailment:</strong> {formData.ailment}</div>
                  <div><strong>Diagnosis:</strong> {formData.diagnosis}</div>
                  <div><strong>Doctor Name:</strong> {formData.doctorName}</div>
                  <div><strong>Claimed Amount:</strong> ₹{formData.totalClaimAmount}</div>
                  <div><strong>Notes:</strong> {formData.additionalNotes}</div>
                </div>
              </div>
              <div className="reimbursement-inputGroup">
                <div style={{ backgroundColor: '#fef3c7', padding: '16px', borderRadius: '8px', border: '1px solid #fbbf24' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#92400e' }}>Declaration</h4>
                  <p style={{ margin: '0', fontSize: '0.875rem', color: '#92400e' }}>
                    I hereby declare the above information is true and correct. Any false information may lead to rejection.
                  </p>
                  <label style={{ display: 'flex', alignItems: 'center', marginTop: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      name="declaration"
                      checked={formData.declaration || false}
                      onChange={handleInputChange}
                      style={{ marginRight: '8px' }}
                    />
                    <span style={{ fontSize: '0.875rem', color: '#92400e' }}>
                      I agree to the above declaration
                    </span>
                  </label>
                  {errors.declaration && (
                    <p className="reimbursement-error">{errors.declaration}</p>
                  )}
                </div>
              </div>
              {submitError && <p style={{ color: 'red', marginTop: '12px', textAlign: 'center' }}>{submitError}</p>}
              <div className="reimbursement-buttonContainer">
                <button
                  type="button"
                  onClick={prevStep}
                  className="reimbursement-buttonSecondary"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="reimbursement-buttonSubmit"
                >
                  Submit Claim
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReimbursementComponent;
