
import React, { useState, useEffect } from 'react';
import './claimtrackin.css';

const ClaimTracking = ({ hospitalId }) => {
  const [claims, setClaims] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const statusColors = {
    status_raised: '#007bff',
    approved_by_fielddoctor: '#1E90FF',
    approved_by_level1: '#1E90FF',
    approved_by_level2: '#1E90FF',
    status_settled: '#28a745',
    status_quired: '#FFC107',
    status_rejected: '#DC2626',
  };

  const statusOrder = [
    'status_raised',
    'approved_by_fielddoctor',
    'approved_by_level1',
    'approved_by_level2',
    'status_settled',
    'status_quired',
    'status_rejected',
  ];

  const steps = [
    { status: 'status_raised', label: 'Raised', icon: '📌' },
    { status: 'approved_by_fielddoctor', label: 'Approved by Field Doctor', icon: '🩺' },
    { status: 'approved_by_level1', label: 'Approved by Level 1 Officer', icon: '👨‍💼' },
    { status: 'approved_by_level2', label: 'Approved by Level 2 Officer', icon: '👩‍⚖️' },
    { status: 'status_settled', label: 'Settled', icon: '✅' },
  ];

  useEffect(() => {
  if (!hospitalId) {
    console.warn('No hospitalId provided to ClaimTracking component');
    setError('Hospital ID is not available.');
    setLoading(false);
    return;
  }

  setLoading(true);
  fetch(`http://localhost:9192/api/claims/tracking/${hospitalId}`)
    .then((res) => {
      if (!res.ok) throw new Error('Failed to fetch claims');
      return res.json();
    })
    .then((data) => {
      setClaims(data);
      setLoading(false);
    })
    .catch((err) => {
      setError(err.message);
      setLoading(false);
    });
}, [hospitalId]); // 👈 include hospitalId as dependency


  const filteredClaims = claims.filter((claim) => {
    const search = searchTerm.toLowerCase();
    const matchesStatus = filterStatus === 'All' || claim.status === filterStatus;
    const matchesSearch =
      (claim.policyHolderId && claim.policyHolderId.toLowerCase().includes(search)) ||
      (claim.claimNo && claim.claimNo.toLowerCase().includes(search)) ||
      (claim.policyId && claim.policyId.toLowerCase().includes(search));
    return matchesStatus && matchesSearch;
  });

  const getStepStatus = (stepStatus) => {
    if (!selectedClaim) return 'pending';
    const currentStatus = selectedClaim.status?.toLowerCase();
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepStatus);

    if (currentStatus === 'status_rejected' && stepStatus === 'status_rejected') return 'rejected';
    if (currentStatus === 'status_quired' && stepStatus === 'status_quired') return 'queried';

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  const renderStepContent = () => {
    if (!selectedClaim) return null;

    return (
      <div className="stepContent">
        <h3 className="stepContentTitle">Claim Details</h3>
        <div className="infoGrid">
          <div className="infoItem">
            <div className="infoLabel">Claim Number</div>
            <div className="infoValue">{selectedClaim.claimNo}</div>
          </div>
          <div className="infoItem">
            <div className="infoLabel">Hospital</div>
            <div className="infoValue">{selectedClaim.hospitalName || '—'}</div>
          </div>
          <div className="infoItem">
            <div className="infoLabel">Admission Date</div>
            <div className="infoValue">
              {selectedClaim.admissionDate ? new Date(selectedClaim.admissionDate).toLocaleString() : '—'}
            </div>
          </div>
          <div className="infoItem">
            <div className="infoLabel">Amount Claimed</div>
            <div className="infoValue">₹{(selectedClaim.totalClaimAmount || 0).toLocaleString()}</div>
          </div>
          <div className="infoItem">
            <div className="infoLabel">Current Status</div>
            <div
              className="infoValue"
              style={{
                color: statusColors[selectedClaim.status] || '#666',
                fontWeight: 'bold',
              }}
            >
              {selectedClaim.status}
            </div>
          </div>
          <div className="infoItem">
            <div className="infoLabel">Policy ID</div>
            <div className="infoValue">{selectedClaim.policyId}</div>
          </div>
          <div className="infoItem">
            <div className="infoLabel">Policy Holder ID</div>
            <div className="infoValue">{selectedClaim.policyHolderId}</div>
          </div>
          <div className="infoItem">
            <div className="infoLabel">Claim Date</div>
            <div className="infoValue">
              {selectedClaim.claimDate ? new Date(selectedClaim.claimDate).toLocaleString() : '—'}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleClaimClick = (claim) => {
    setSelectedClaim(claim);
  };

  const closeModal = () => {
    setSelectedClaim(null);
  };

  if (loading) return <div className="loading">Loading claims...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">Claim Tracking System</h1>
      </div>

      <div className="controls">
        <input
          type="text"
          placeholder="Search policy ID, claim number, or policy holder ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="searchInput"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filterSelect"
        >
          <option value="All">All Statuses</option>
          {statusOrder.map((status) => (
            <option key={status} value={status}>
              {status.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </div>

      <div className="claimsGrid">
        {filteredClaims.map((claim) => (
          <div
            key={claim.claimNo}
            className="claimCard"
            onClick={() => handleClaimClick(claim)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            }}
          >
            <div className="claimHeader">
              <span className="claimId">{claim.claimNo}</span>
              <span
                className="statusBadge"
                style={{
                  backgroundColor: statusColors[claim.status] || '#708090',
                }}
              >
                {claim.status}
              </span>
            </div>

            <div className="claimDetails">
              <span className="detailLabel">Policy Holder:</span>
              <span className="detailValue">{claim.policyHolderId || '—'}</span>

              <span className="detailLabel">Policy:</span>
              <span className="detailValue">{claim.policyId}</span>

              <span className="detailLabel">Type:</span>
              <span className="detailValue">{claim.claimType}</span>

              <span className="detailLabel">Submitted:</span>
              <span className="detailValue">
                {claim.claimDate ? new Date(claim.claimDate).toLocaleString() : '—'}
              </span>
            </div>

            <div className="amount">₹{(claim.totalClaimAmount || 0).toLocaleString()}</div>
          </div>
        ))}
      </div>

      {selectedClaim && (
        <div className="modal" onClick={closeModal}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <div>
                <h2 className="modalTitle">Claim Status Tracker</h2>
                <p className="modalSubtitle">Track the progress of your claim submission</p>
              </div>
              <button className="closeButton" onClick={closeModal}>
                ×
              </button>
            </div>

            <div className="modalBody">
              {selectedClaim.status === 'status_rejected' ? (
                <div className="rejectionMessage">
                  <h1 style={{ color: '#DC2626', textAlign: 'center', marginTop: '20px' }}>
                    ❌ Claim Rejected
                  </h1>
                  <p style={{ textAlign: 'center', color: '#6B7280' }}>
                    Your claim has been rejected. Please contact support for clarification.
                  </p>
                </div>
              ) : (
                <>
                  <div className="stepperContainer">
                    <div className="stepper">
                      {steps.map((step, index) => {
                        const stepStatus = getStepStatus(step.status);
                        const isActive = stepStatus === 'active';
                        const isCompleted = stepStatus === 'completed';
                        const isRejected = stepStatus === 'rejected';
                        const isQueried = stepStatus === 'queried';

                        return (
                          <React.Fragment key={index}>
                            <div className="stepItem">
                              <div
                                className="stepCircle"
                                style={{
                                  backgroundColor: isRejected
                                    ? '#DC2626'
                                    : isQueried
                                    ? '#FFC107'
                                    : isCompleted
                                    ? '#4CAF50'
                                    : isActive
                                    ? '#4285F4'
                                    : '#E0E0E0',
                                  color:
                                    isRejected || isQueried || isCompleted || isActive ? '#FFF' : '#666',
                                }}
                              >
                                {isRejected || isQueried || isCompleted ? '✓' : index + 1}
                              </div>
                              <div
                                className="stepLabel"
                                style={{
                                  color: isRejected
                                    ? '#DC2626'
                                    : isQueried
                                    ? '#FFC107'
                                    : isCompleted
                                    ? '#4CAF50'
                                    : isActive
                                    ? '#4285F4'
                                    : '#666',
                                }}
                              >
                                {step.label}
                              </div>
                            </div>
                            {index < steps.length - 1 && (
                              <div
                                className={`stepConnector ${
                                  getStepStatus(steps[index + 1].status) === 'completed'
                                    ? 'stepConnectorActive'
                                    : ''
                                }`}
                              />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                  {renderStepContent()}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClaimTracking;
