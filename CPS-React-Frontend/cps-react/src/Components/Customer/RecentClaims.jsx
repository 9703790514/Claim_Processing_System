


import React, { useEffect, useState } from 'react';

export default function RecentClaims({ onClaimSelect, patientId }) {
  const [claims, setClaims] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredBack, setHoveredBack] = useState(false);

  useEffect(() => {
    if (!patientId) {
      setError('No patient ID provided');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(API_ROUTES.CUSTOMER.GET_CLAIMS(patientId))
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        const filteredClaims = data.filter((c) => c.policyHolderId === patientId);
        setClaims(filteredClaims);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [patientId]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return '#30ca3aff';
      case 'pending review':
        return '#FFA500';
      case 'under review':
        return '#708090';
      case 'rejected':
        return '#dc2626';
      case 'regd':
        return '#007bff';
      default:
        return '#708090';
    }
  };

  const styles = {
    container: {
      backgroundColor: '#FFFFFF',
      border: '2px solid #1A3E72',
      borderRadius: '12px',
      margin: '20px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      fontFamily: 'system-ui',
    },
    header: {
      backgroundColor: '#f8f9fa',
      borderBottom: '2px solid #1A3E72',
      padding: '16px 24px',
      borderRadius: '10px 10px 0 0',
    },
    headerTitle: {
      color: '#1A3E72',
      fontSize: '20px',
      fontWeight: '700',
      margin: 0,
    },
    tableContainer: {
      padding: '20px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    tableHeader: {
      backgroundColor: '#1A3E72',
      color: '#FFFFFF',
    },
    th: {
      padding: '12px 16px',
      textAlign: 'left',
      fontWeight: '600',
      fontSize: '14px',
      borderBottom: '2px solid #FFFFFF',
    },
    tr: {
      borderBottom: '1px solid #e5e7eb',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
    },
    trHover: {
      backgroundColor: '#f8f9fa',
    },
    td: {
      padding: '12px 16px',
      fontSize: '14px',
      color: '#1A3E72',
    },
    statusBadge: {
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      color: '#FFFFFF',
      textAlign: 'center',
      minWidth: '80px',
      display: 'inline-block',
    },
    clickHint: {
      color: '#708090',
      fontSize: '12px',
      fontStyle: 'italic',
      textAlign: 'center',
      padding: '8px',
      borderTop: '1px solid #e5e7eb',
      margin: '16px 0 0 0',
    },
    detailContainer: {
      backgroundColor: '#FFFFFF',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'system-ui',
    },
    detailHeader: {
      backgroundColor: '#1A3E72',
      color: '#FFFFFF',
      padding: '20px',
      borderRadius: '12px',
      marginBottom: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    detailTitle: {
      fontSize: '24px',
      fontWeight: '700',
      margin: 0,
    },
    backButton: {
      backgroundColor: '#008080',
      color: '#FFFFFF',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'background-color 0.2s ease',
    },
    backButtonHover: {
      backgroundColor: '#006666',
    },
    detailGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px',
      marginBottom: '20px',
    },
    detailCard: {
      backgroundColor: '#f8f9fa',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '20px',
    },
    cardTitle: {
      color: '#1A3E72',
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '15px',
      borderBottom: '2px solid #1A3E72',
      paddingBottom: '5px',
    },
    detailRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '10px',
      padding: '5px 0',
    },
    detailLabel: {
      fontWeight: '600',
      color: '#1A3E72',
    },
    detailValue: {
      color: '#333333',
    },
    notesCard: {
      backgroundColor: '#f0f8ff',
      border: '1px solid #1A3E72',
      borderRadius: '8px',
      padding: '20px',
    },
  };

  const handleRowClick = (claim) => {
    setSelectedClaim(claim);
    if (onClaimSelect) {
      onClaimSelect(claim);
    }
  };

  const handleBackClick = () => {
    setSelectedClaim(null);
    if (onClaimSelect) {
      onClaimSelect(null);
    }
  };

  if (loading) {
    return <div style={{ padding: 20, fontFamily: 'system-ui', color: '#1A3E72' }}>Loading claims...</div>;
  }

  if (error) {
    return <div style={{ padding: 20, fontFamily: 'system-ui', color: '#dc2626' }}>Error loading claims: {error}</div>;
  }

  if (!patientId) {
    return <div style={{ padding: 20, fontFamily: 'system-ui', color: '#dc2626' }}>Patient ID is required.</div>;
  }

  if (claims.length === 0) {
    return <div style={{ padding: 20, fontFamily: 'system-ui', color: '#1A3E72' }}>No claims found.</div>;
  }

  // Detail View
  if (selectedClaim) {
    return (
      <div style={styles.detailContainer}>
        <div style={styles.detailHeader}>
          <h1 style={styles.detailTitle}>Claim Details - {selectedClaim.claimNo}</h1>
          <button
            style={{ ...styles.backButton, ...(hoveredBack ? styles.backButtonHover : {}) }}
            onMouseEnter={() => setHoveredBack(true)}
            onMouseLeave={() => setHoveredBack(false)}
            onClick={handleBackClick}
          >
            ← Back to Claims
          </button>
        </div>

        <div style={styles.detailGrid}>
          <div style={styles.detailCard}>
            <h3 style={styles.cardTitle}>Claim Information</h3>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Claim No:</span>
              <span style={styles.detailValue}>{selectedClaim.claimNo}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Claim Date:</span>
              <span style={styles.detailValue}>{new Date(selectedClaim.claimDate).toLocaleDateString()}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Status:</span>
              <span
                style={{
                  ...styles.statusBadge,
                  backgroundColor: getStatusColor(selectedClaim.status)
                }}
              >
                {selectedClaim.status}
              </span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Claim Type:</span>
              <span style={styles.detailValue}>{selectedClaim.claimType}</span>
            </div>
          </div>

          <div style={styles.detailCard}>
            <h3 style={styles.cardTitle}>Medical Details</h3>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Hospital Name:</span>
              <span style={styles.detailValue}>{selectedClaim.hospitalName}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Admission:</span>
              <span style={styles.detailValue}>{new Date(selectedClaim.admissionDate).toLocaleDateString()}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Discharge:</span>
              <span style={styles.detailValue}>{new Date(selectedClaim.dischargeDate).toLocaleDateString()}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Diagnosis:</span>
              <span style={styles.detailValue}>{selectedClaim.diagnosis}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Ailment:</span>
              <span style={styles.detailValue}>{selectedClaim.ailment}</span>
            </div>
          </div>

          <div style={styles.detailCard}>
            <h3 style={styles.cardTitle}>Financials</h3>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Total Claim Amount:</span>
              <span style={styles.detailValue}>₹{selectedClaim.totalClaimAmount}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Approved Amount:</span>
              <span style={styles.detailValue}>{selectedClaim.finalApprovedAmount ?? '—'}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Total Deductions:</span>
              <span style={styles.detailValue}>{selectedClaim.deductionsApplied?.totalDeductions ?? 0}</span>
            </div>
          </div>
        </div>

      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>Recent Claims</h2>
      </div>
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead style={styles.tableHeader}>
            <tr>
              <th style={styles.th}>Claim No</th>
              <th style={styles.th}>Hospital</th>
              <th style={styles.th}>Claim Date</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((claim) => (
              <tr
                key={claim._id}
                style={{ ...styles.tr, ...(hoveredRow === claim._id ? styles.trHover : {}) }}
                onMouseEnter={() => setHoveredRow(claim._id)}
                onMouseLeave={() => setHoveredRow(null)}
                onClick={() => handleRowClick(claim)}
              >
                <td style={styles.td}>{claim.claimNo}</td>
                <td style={styles.td}>{claim.hospitalName}</td>
                <td style={styles.td}>{new Date(claim.claimDate).toLocaleDateString()}</td>
                <td style={styles.td}>₹{claim.totalClaimAmount}</td>
                <td style={styles.td}>{claim.claimType}</td>
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.statusBadge,
                      backgroundColor: getStatusColor(claim.status),
                    }}
                  >
                    {claim.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={styles.clickHint}>(Click a row to view full details)</p>
      </div>
    </div>
  );
}
