import React, { useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import {
  Box, Typography, CircularProgress, Grid, Paper, Container, Divider, Button, Fade,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ListAltIcon from '@mui/icons-material/ListAlt';
import FieldDoctorClaimsTable from './FieldDoctorClaimsTable';
import ClaimFullDetailsPage from './ClaimFullDetailsPage';
import { getStatusLabel } from '../utils/helpers';
import Header from './Header';

const CARD_STYLES = [
  {
    key: 'pendingReview',
    label: 'Pending Review',
    color: '#1976d2',
    bg: 'linear-gradient(135deg, #e3f2fd 0%, #90caf9 100%)',
    icon: <AssignmentIcon sx={{ fontSize: 60, color: '#1976d2' }} />, // Increased icon size
    statKey: 'pendingReview',
  },
  {
    key: 'approvedByFieldDoctor',
    label: 'Approved by FD',
    color: '#43a047',
    bg: 'linear-gradient(135deg, #e8f5e9 0%, #a5d6a7 100%)',
    icon: <DoneAllIcon sx={{ fontSize: 60, color: '#43a047' }} />,
    statKey: 'approvedByFieldDoctor',
  },
  {
    key: 'rejectedByFieldDoctor',
    label: 'Rejected by FD',
    color: '#d32f2f',
    bg: 'linear-gradient(135deg, #ffebee 0%, #ef9a9a 100%)',
    icon: <HighlightOffIcon sx={{ fontSize: 60, color: '#d32f2f' }} />,
    statKey: 'rejectedByFieldDoctor',
  },
  {
    key: 'totalAssigned',
    label: 'Total Assigned',
    color: '#757575',
    bg: 'linear-gradient(135deg, #f5f5f5 0%, #bdbdbd 100%)',
    icon: <ListAltIcon sx={{ fontSize: 60, color: '#757575' }} />,
    statKey: 'totalAssigned',
  },
];

function FieldDoctorDashboardPage({ currentFieldDoctorId, loggedInUserData, onLogout }) {
  const [allClaims, setAllClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [selectedClaimForDetails, setSelectedClaimForDetails] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('status_pending');
  const [searchTerm, setSearchTerm] = useState('');

  const fieldDoctorId = loggedInUserData?.id || currentFieldDoctorId;

  const fetchAllClaims = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:9090/claims');
      const assignedAndRelevantClaims = response.data.filter(claim =>
        (fieldDoctorId
          ? claim.field_doctor_id === fieldDoctorId
          : claim.field_doctor_id !== null && claim.field_doctor_id !== undefined) &&
        claim.status !== 'status_settled' &&
        claim.status !== 'status_under_query' &&
        claim.status !== 'status_rejected'
      );
      setAllClaims(assignedAndRelevantClaims || []);
    } catch (err) {
      setError("Failed to fetch claims data for the dashboard. Ensure the JSON server is running.");
      setAllClaims([]);
    } finally {
      setLoading(false);
    }
  }, [fieldDoctorId]);

  useEffect(() => {
    if (fieldDoctorId) {
      fetchAllClaims();
    } else {
      setLoading(false);
      setAllClaims([]);
    }
  }, [fetchAllClaims, fieldDoctorId]);

  const calculatedStats = useMemo(() => {
    if (!allClaims || allClaims.length === 0) {
      return { pendingReview: 0, approvedByFieldDoctor: 0, rejectedByFieldDoctor: 0, totalAssigned: 0 };
    }
    const stats = {
      pendingReview: 0,
      approvedByFieldDoctor: 0,
      rejectedByFieldDoctor: 0,
      totalAssigned: 0,
    };
    allClaims.forEach(claim => {
      stats.totalAssigned++;
      switch (claim.status) {
        case 'status_raised':
        case 'status_pending':
          stats.pendingReview++;
          break;
        case 'status_approved_by_field_doctor':
          stats.approvedByFieldDoctor++;
          break;
        case 'status_rejected_by_field_doctor':
          stats.rejectedByFieldDoctor++;
          break;
        default:
          break;
      }
    });
    return stats;
  }, [allClaims]);

  const claimsForTable = useMemo(() => {
    return allClaims.filter(claim => {
      let matchesStatus = false;
      if (selectedStatus === 'all') {
        matchesStatus = [
          'status_raised',
          'status_approved_by_field_doctor',
          'status_rejected_by_field_doctor',
          'status_pending'
        ].includes(claim.status);
      } else if (selectedStatus === 'status_pending') {
        matchesStatus = (claim.status === 'status_raised' || claim.status === 'status_pending');
      } else {
        matchesStatus = claim.status === selectedStatus;
      }

      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const matchesSearchTerm =
        (claim.id && claim.id.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (claim.treatment && claim.treatment.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (claim.policy_id && claim.policy_id.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (claim.hospital_id && claim.hospital_id.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (getStatusLabel(claim.status).toLowerCase().includes(lowerCaseSearchTerm)) ||
        (claim.field_doctor_id && claim.field_doctor_id.toLowerCase().includes(lowerCaseSearchTerm));

      return matchesStatus && matchesSearchTerm;
    });
  }, [allClaims, selectedStatus, searchTerm]);

  const statusTabs = useMemo(() => ([
    { label: 'All Assigned', value: 'all' },
    { label: 'Pending Review', value: 'status_pending' },
    { label: 'Approved by FD', value: 'status_approved_by_field_doctor' },
    { label: 'Rejected by FD', value: 'status_rejected_by_field_doctor' },
  ]), []);

  const handleViewClaimDetails = useCallback((claimId) => {
    const claim = allClaims.find(c => c.id === claimId);
    if (claim) {
      setSelectedClaimForDetails(claim);
    } else {
      setError(`Claim with ID ${claimId} not found.`);
    }
  }, [allClaims]);

  const handleBackFromDetails = useCallback(() => {
    setSelectedClaimForDetails(null);
    fetchAllClaims();
  }, [fetchAllClaims]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10 }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading Field Doctor Dashboard...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10 }}>
        <Typography variant="h6" color="error">{error}</Typography>
        <Button variant="contained" onClick={fetchAllClaims} sx={{ mt: 3 }}>
          Try Again
        </Button>
      </Box>
    );
  }

  if (selectedClaimForDetails) {
    return (
      <ClaimFullDetailsPage
        claimId={selectedClaimForDetails.id}
        initialClaimData={selectedClaimForDetails}
        onBack={handleBackFromDetails}
        isLevel2Officer={false}
        loggedInUserData={loggedInUserData}
      />
    );
  }

  return (
    <>
      <Header user={loggedInUserData} onLogout={onLogout} />
      <Box sx={{ mt: 10, mb: 4 }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', letterSpacing: '.04em' }}>
              Welcome To Field Doctor Dashboard
              <Typography component="span" sx={{ color: '#1976d2', fontWeight: 700, ml: 1 }}>
                {loggedInUserData?.name ? ` ${loggedInUserData.name}` : `ID: ${fieldDoctorId}`}
              </Typography>
            </Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />

          {!showTable ? (
            <Fade in>
              <Grid container spacing={3} alignItems="stretch">
                {CARD_STYLES.map(card => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    key={card.key}
                    sx={{ display: "flex" }}
                  >
                    <Paper
                      elevation={6}
                      sx={{
                        width: "100%",
                        minHeight: 280,             // increased height
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        p: 5,                      // increased padding
                        textAlign: "center",
                        cursor: "pointer",
                        background: card.bg,
                        borderLeft: `7px solid ${card.color}`,
                        borderRadius: 3,
                        boxShadow: '0 4px 24px 0 #00000014',
                        transition: 'box-shadow 0.3s, background 0.3s, transform 0.3s',
                        '&:hover': {
                          boxShadow: '0 8px 32px 0 #00000024',
                          transform: 'translateY(-6px) scale(1.05)',
                          background: card.bg,
                        },
                      }}
                      onClick={() => {
                        if (card.key === 'pendingReview') setSelectedStatus('status_pending');
                        else if (card.key === 'approvedByFieldDoctor') setSelectedStatus('status_approved_by_field_doctor');
                        else if (card.key === 'rejectedByFieldDoctor') setSelectedStatus('status_rejected_by_field_doctor');
                        else setSelectedStatus('all');
                        setShowTable(true);
                      }}
                    >
                      <Box sx={{ mb: 2 }}>{card.icon}</Box>
                      <Typography variant="h5" sx={{ color: card.color, fontWeight: 'bold', mb: 1 }}>
                        {card.label}
                      </Typography>
                      <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#222', mb: 1 }}>
                        {calculatedStats[card.statKey]}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Fade>
          ) : (
            <Paper sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
              <Button
                variant="outlined"
                onClick={() => {
                  setShowTable(false);
                  setSearchTerm('');
                  setSelectedStatus('status_pending');
                }}
                sx={{ mb: 2 }}
              >
                Back to Overview Cards
              </Button>

              <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
                Claims Assigned to Field Doctor: {loggedInUserData?.name || fieldDoctorId}
              </Typography>
              {claimsForTable.length === 0 && !loading && !error && (
                <Typography variant="body1" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                  No claims found assigned to you matching the selected status or search criteria.
                </Typography>
              )}
              <FieldDoctorClaimsTable
                claims={claimsForTable}
                selectedStatus={selectedStatus}
                searchTerm={searchTerm}
                statusTabs={statusTabs}
                onTabChange={(e, value) => setSelectedStatus(value)}
                onSearchChange={e => setSearchTerm(e.target.value)}
                onClearSearch={() => setSearchTerm('')}
                onViewDetails={handleViewClaimDetails}
                loggedInUserData={loggedInUserData}
              />
            </Paper>
          )}
        </Container>
      </Box>
    </>
  );
}

export default FieldDoctorDashboardPage;
