import React, { useState, useEffect } from 'react';
import {
  X,
  FileText,
  User,
  Calendar,
  DollarSign,
  Shield,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

export default function PolicyDetails({ policyHolderId: userPolicyHolderId }) {
  const [policyCards, setPolicyCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const policyHolderId =
    userPolicyHolderId || localStorage.getItem('policyHolderId');

  useEffect(() => {
    if (!policyHolderId) {
      setError('No policy holder ID found.');
      setLoading(false);
      return;
    }

    const fetchPolicyData = async () => {
      try {
        const response = await fetch(
          API_ROUTES.CUSTOMER.GET_POLICIES(policyHolderId)
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        // Ensure filtering in case backend returns extra data
        const filtered = data.filter(
          (p) => p.policyHolderId === policyHolderId
        );
        setPolicyCards(filtered);
      } catch (error) {
        console.error('Error fetching policy data:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicyData();
  }, [policyHolderId]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return '#008080';
      case 'pending renewal':
        return '#FFA500';
      case 'expired':
        return '#708090';
      case 'cancelled':
        return '#dc2626';
      default:
        return '#708090';
    }
  };

  const handleViewDetails = (e, policy) => {
    e.stopPropagation();
    setSelectedPolicy(policy);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPolicy(null);
  };

  const handleCardClick = (policy) => {
    console.log('Policy clicked:', policy.policyNo);
  };

  const getDetailedPolicy = (policy) => ({
    ...policy,
    policyStartDate: policy.startDate || 'N/A',
    policyEndDate: policy.endDate || 'N/A',
    lastPremiumPaid: policy.premiums?.[0]?.paidDate || 'N/A',
    nextPremiumDue: policy.premiums?.[0]?.dueDate || 'N/A',
    sumInsured: policy.sumInsured || policy.sumAssured || 'N/A',
    deductible:
      `Voluntary: ${policy?.deductibles?.voluntary ?? '-'} / Out of Network: ${policy?.deductibles?.outOfNetworkHospital ?? '-'}`,
    coPayment: `${(policy.coPayPercentage ?? 0) * 100}%`,
    coverages: policy.covers || [],
    exclusions: policy.exclusions || [],
    claimHistory: policy.claims || [],
    agent: policy.agent || {
      name: 'Not Assigned',
      email: '-',
      phone: '-'
    }
  });

  if (loading) return <div style={styles.message}>Loading...</div>;
  if (error)
    return (
      <div style={styles.message}>
        Error loading policies: {error.message}
      </div>
    );
  if (policyCards.length === 0)
    return <div style={styles.message}>No policies found.</div>;

  return (
    <>
      <div style={styles.container}>
        {policyCards.map((policy, index) => (
          <div
            key={policy._id || index}
            style={{
              ...styles.card
            }}
            onClick={() => handleCardClick(policy)}
          >
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>{policy.policyNo}</h3>
            </div>

            <div style={styles.cardBody}>
              <div style={styles.detailRow}>
                <span style={styles.label}>Policy Number</span>
                <span style={styles.value}>{policy.policyNo}</span>
              </div>

              <div style={styles.detailRow}>
                <span style={styles.label}>Sum Insured</span>
                <span style={styles.value}>₹{policy.sumAssured}</span>
              </div>

              <div style={styles.detailRow}>
                <span style={styles.label}>Policy Start</span>
                <span style={styles.value}>
                  {new Date(policy.startDate).toLocaleDateString()}
                </span>
              </div>

              <div style={styles.detailRow}>
                <span style={styles.label}>Policy End</span>
                <span style={styles.value}>
                  {new Date(policy.endDate).toLocaleDateString()}
                </span>
              </div>

              <div style={styles.detailRow}>
                <span style={styles.label}>Status</span>
                <span
                  style={{
                    ...styles.statusBadge,
                    backgroundColor: getStatusColor(policy.status)
                  }}
                >
                  {policy.status}
                </span>
              </div>
            </div>

            <div style={styles.cardFooter}>
              <button
                style={styles.viewButton}
                onClick={(e) => handleViewDetails(e, policy)}
              >
                View Full Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal rendering full details */}
      {showModal && selectedPolicy && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                <FileText size={20} /> Policy Details
              </h2>
              <button style={styles.closeButton} onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            <div style={styles.modalContent}>
              {(() => {
                const p = getDetailedPolicy(selectedPolicy);
                return (
                  <>
                    <h3 style={styles.sectionTitle}>
                      <Shield size={18} /> Policy Info
                    </h3>
                    <div style={styles.detailGrid}>
                      <Detail label="Policy Number" value={p.policyNo} />
                      <Detail label="Product ID" value={p.productId} />
                      <Detail label="Coverage" value={p.coverages.join(', ')} />
                      <Detail label="Sum Assured" value={`₹${p.sumInsured}`} />
                      <Detail label="Deductible" value={p.deductible} />
                      <Detail label="Co-Pay" value={p.coPayment} />
                    </div>

                    <h3 style={styles.sectionTitle}>
                      <Calendar size={18} /> Dates
                    </h3>
                    <div style={styles.detailGrid}>
                      <Detail label="Start Date" value={new Date(p.policyStartDate).toLocaleDateString()} />
                      <Detail label="End Date" value={new Date(p.policyEndDate).toLocaleDateString()} />
                      <Detail label="Premium Paid On" value={new Date(p.lastPremiumPaid).toLocaleDateString()} />
                      <Detail label="Next Premium Due" value={new Date(p.nextPremiumDue).toLocaleDateString()} />
                    </div>

                    <h3 style={styles.sectionTitle}>
                      <User size={18} /> Agent Info
                    </h3>
                    <div style={styles.detailGrid}>
                      <Detail label="Name" value={p.agent.name} />
                      <Detail label="Email" value={p.agent.email} />
                      <Detail label="Phone" value={p.agent.contact} />
                    </div>

                    <h3 style={styles.sectionTitle}>
                      <FileText size={18} /> Exclusions
                    </h3>
                    <ul style={{ paddingLeft: '20px' }}>
                      {p.exclusions.map((e, i) => (
                        <li key={i}>{e}</li>
                      ))}
                    </ul>

    
                    
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Reusable detail component
const Detail = ({ label, value }) => (
  <div style={styles.detailItem}>
    <div style={styles.detailLabel}>{label}</div>
    <div style={styles.detailValue}>{value}</div>
  </div>
);

const styles = {
  container: {
    display: 'flex',
    gap: '20px',
    padding: '20px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    fontFamily: 'system-ui'
  },
  card: {
    backgroundColor: '#fff',
    border: '2px solid #1A3E72',
    borderRadius: '12px',
    width: '320px',
    height: 'auto',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column'
  },
  cardHeader: {
    backgroundColor: '#1A3E72',
    color: '#fff',
    padding: '16px 20px',
    borderRadius: '10px 10px 0 0',
    textAlign: 'center'
  },
  cardTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '700'
  },
  cardBody: {
    padding: '20px'
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
    fontSize: '14px'
  },
  label: {
    fontWeight: '600',
    color: '#708090'
  },
  value: {
    color: '#1A3E72'
  },
  statusBadge: {
    padding: '4px 10px',
    borderRadius: '16px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#fff'
  },
  cardFooter: {
    textAlign: 'center',
    padding: '12px 20px'
  },
  viewButton: {
    backgroundColor: '#FFA500',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 12px',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%'
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal: {
    backgroundColor: '#fff',
    width: '90%',
    maxWidth: '800px',
    borderRadius: '12px',
    boxShadow: '0 0 30px rgba(0,0,0,0.4)',
    position: 'relative',
    overflowY: 'auto',
    maxHeight: '90vh'
  },
  modalHeader: {
    backgroundColor: '#1A3E72',
    color: '#fff',
    padding: '20px',
    borderRadius: '12px 12px 0 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  modalTitle: {
    margin: 0,
    fontSize: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '18px',
    cursor: 'pointer'
  },
  modalContent: {
    padding: '24px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '20px 0 10px'
  },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px'
  },
  detailItem: {
    padding: '12px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #dde',
    borderRadius: '8px'
  },
  detailLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#708090'
  },
  detailValue: {
    fontSize: '16px',
    color: '#1A3E72'
  },
  beneficiaryCard: {
    backgroundColor: '#f4f4f4',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    marginBottom: '10px'
  },
  message: {
    fontFamily: 'system-ui',
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    color: '#555'
  }
};
