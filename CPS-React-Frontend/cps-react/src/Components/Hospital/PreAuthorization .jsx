
import React, { useState } from 'react';
import './pre.css';

// SVG Icon Components (unchanged)
const CheckCircle = ({ size = 32, className = '' }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#008080"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" fill="#E6F7F7" />
    <path d="M9 12l2 2 4-4" stroke="#008080" />
  </svg>
);

const XCircle = ({ size = 32, className = '' }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#FF6B6B"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" fill="#FFE6E6" />
    <line x1="15" y1="9" x2="9" y2="15" stroke="#FF6B6B" />
    <line x1="9" y1="9" x2="15" y2="15" stroke="#FF6B6B" />
  </svg>
);

const PreAuthorization = ({ onNavigate }) => {
  
  const [healthCard, setHealthCard] = useState('');
  const [policyDetails, setPolicyDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkPolicy = () => {
    setLoading(true);
    setPolicyDetails(null);

    fetch('http://localhost:9092/preAuthorization')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch policies');
        }
        return response.json();
      })
      .then(data => {
        // data is expected to be an array of policy objects
        const foundPolicy = data.find(
          (policy) => policy.cardNumber.toLowerCase() === healthCard.toLowerCase()
        );

        if (foundPolicy) {
          setPolicyDetails(foundPolicy);
        } else {
          setPolicyDetails('not_found');
        }
        setLoading(false);
      })
      .catch(() => {
        setPolicyDetails('not_found');
        setLoading(false);
      });
  };

  return (
    <div className="main-container">
      <div className="p-8">
        <div className="max-w-4xl">
          <div className="rounded-lg shadow-lg p-8 card-container">
            <h2 className="main-title">Pre Authorization</h2>
            <div className="mb-8">
              <label className="label-text">Health Card Number</label>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={healthCard}
                  onChange={(e) => setHealthCard(e.target.value)}
                  placeholder="Enter health card number"
                  className="flex-1 px-4 py-3 health-card-input"
                />
                <button
                  onClick={checkPolicy}
                  disabled={!healthCard || loading}
                  className="verify-btn"
                >
                  {loading ? 'Checking...' : 'Verify'}
                </button>
              </div>
            </div>

            {policyDetails && (
              <div className="mt-8">
                {policyDetails === 'not_found' ? (
                  <div className="error-container flex items-center gap-4">
                    <XCircle size={32} />
                    <div>
                      <h3 className="error-title">Policy Not Found</h3>
                      <p className="error-text">
                        No active policy found for this health card number.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="success-container">
                    <div className="flex items-center gap-4 mb-6">
                      <CheckCircle size={32} />
                      <h3 className="success-title">
                        Policy Found - You can proceed
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
                      <div className="detail-card">
                        <span className="detail-label">Patient Name:</span>
                        <div className="detail-value">
                          {policyDetails.patientName}
                        </div>
                      </div>
                      <div className="detail-card">
                        <span className="detail-label">Policy Number:</span>
                        <div className="detail-value">
                          {policyDetails.policyNumber}
                        </div>
                      </div>
                      <div className="detail-card">
                        <span className="detail-label">Policy Type:</span>
                        <div className="detail-value">
                          {policyDetails.policyType}
                        </div>
                      </div>
                      <div className="detail-card">
                        <span className="detail-label">Coverage Amount:</span>
                        <div className="detail-value">
                          {policyDetails.coverageAmount}
                        </div>
                      </div>
                      <div className="detail-card">
                        <span className="detail-label">Valid Until:</span>
                        <div className="detail-value">
                          {policyDetails.validUntil}
                        </div>
                      </div>
                      <div className="detail-card">
                        <span className="detail-label">Status:</span>
                        <div>
                          <span className="status-badge">
                            {policyDetails.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      className="proceed-btn"
                      onClick={() => onNavigate('reimbursement')} // Switches to Cashless/Claim page
                    >
                      Proceed to Claim Request
                    </button>

                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreAuthorization;
