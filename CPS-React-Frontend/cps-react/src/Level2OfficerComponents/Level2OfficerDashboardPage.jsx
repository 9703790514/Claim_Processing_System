import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Box, Typography, CircularProgress, Button, Paper } from '@mui/material';

import ClaimDetailsCard from './ClaimDetailsCard';
import ClaimsTable from './ClaimsTable';
import ClaimFullDetailsPage from './ClaimFullDetailsPage';
import { getStatusLabel } from '../utils/helpers';
import Header from './Header';
import './ClaimsDashboard.css';

const CLAIM_AMOUNT_THRESHOLD = 500000; // 5 lakhs

// Define all rejected statuses here
const REJECTED_STATUSES = [
  'status_rejected_by_level1_officer',
  'status_rejected_by_level2_officer',
  // Add more rejected statuses if applicable
];

function Level2OfficerDashboardPage({ loggedInUserData, onLogout }) {
  const [allClaims, setAllClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedClaimId, setSelectedClaimId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAllClaims = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:9090/claims');
      setAllClaims(response.data || []);
    } catch (err) {
      setError("Failed to fetch claims list. Please ensure the JSON server is running.");
      setAllClaims([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeView === 'dashboard') {
      fetchAllClaims();
    }
  }, [fetchAllClaims, activeView]);

  // Calculate aggregated stats according to your criteria
  const aggregatedStats = useMemo(() => {
    const stats = {
      pendingL2Review: 0,  // approved by L1 & amount > 5L
      l2Approved: 0,       // approved by L2
      l2Rejected: 0,       // all rejected claims
      queried: 0,          // queried claims
      totalClaims: allClaims.length,
    };

    allClaims.forEach(claim => {
      const amount = claim.total_amount_claimed || 0;

      if (claim.status === 'status_approved_by_level1_officer' && amount > CLAIM_AMOUNT_THRESHOLD) {
        stats.pendingL2Review++;
      } else if (claim.status === 'status_approved_by_level2_officer') {
        stats.l2Approved++;
      } else if (REJECTED_STATUSES.includes(claim.status)) {
        stats.l2Rejected++;
      } else if (claim.status === 'status_queried') {
        stats.queried++;
      }
    });

    return stats;
  }, [allClaims]);

  // Status tabs for filtering
  const statusTabs = useMemo(() => [
    { label: 'Pending (L1 Approved & >5L)', value: 'pending' },
    { label: 'Approved by L2', value: 'status_approved_by_level2_officer' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'Queried', value: 'status_queried' },
    { label: 'All Claims', value: 'all' },
  ], []);

  // Filter claims based on selected status and search term
  const filteredClaims = useMemo(() => {
    let currentClaims = allClaims;

    if (selectedStatus === 'pending') {
      currentClaims = currentClaims.filter(
        claim =>
          claim.status === 'status_approved_by_level1_officer' &&
          (claim.total_amount_claimed || 0) > CLAIM_AMOUNT_THRESHOLD
      );
    } else if (selectedStatus === 'rejected') {
      currentClaims = currentClaims.filter(claim => REJECTED_STATUSES.includes(claim.status));
    } else if (selectedStatus !== 'all') {
      currentClaims = currentClaims.filter(claim => claim.status === selectedStatus);
    }

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentClaims = currentClaims.filter(
        claim =>
          (claim.id && claim.id.toLowerCase().includes(lowerCaseSearchTerm)) ||
          (claim.treatment && claim.treatment.toLowerCase().includes(lowerCaseSearchTerm)) ||
          (claim.policy_id && claim.policy_id.toLowerCase().includes(lowerCaseSearchTerm)) ||
          (claim.hospital_id && claim.hospital_id.toLowerCase().includes(lowerCaseSearchTerm)) ||
          (getStatusLabel(claim.status) && getStatusLabel(claim.status).toLowerCase().includes(lowerCaseSearchTerm))
      );
    }

    return currentClaims;
  }, [allClaims, selectedStatus, searchTerm]);

  // Handlers
  const handleViewFullDetails = useCallback((claimId) => {
    setSelectedClaimId(claimId);
    setActiveView('fullDetails');
  }, []);

  const handleBackToDashboard = useCallback(() => {
    setSelectedClaimId(null);
    setActiveView('dashboard');
    setSearchTerm('');
    setSelectedStatus('all');
    fetchAllClaims();
  }, [fetchAllClaims]);

  const handleDashboardCardClick = useCallback((status) => {
    setSelectedStatus(status);
    setShowTable(true);
    setSearchTerm('');
  }, []);

  // Loading state
  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4, height: '300px' }}>
      <CircularProgress size={60} />
      <Typography variant="h6" sx={{ ml: 2, color: 'text.secondary' }}>Loading claims...</Typography>
    </Box>
  );

  // Error state
  if (error) return (
    <Box sx={{ mt: 4, textAlign: 'center', p: 3 }}>
      <Typography variant="h6" color="error">{error}</Typography>
      <Button variant="contained" onClick={fetchAllClaims} sx={{ mt: 3 }}>
        Try Again
      </Button>
    </Box>
  );

  return (
    <>
      <br /><br />
      <Header user={loggedInUserData} onLogout={onLogout} />
      {activeView === 'dashboard' && (
        !showTable ? (
          <Paper sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
            <ClaimDetailsCard
              allClaims={allClaims}
              aggregatedStats={{
                pending: aggregatedStats.pendingL2Review,
                approved: aggregatedStats.l2Approved,
                rejected: aggregatedStats.l2Rejected,
                queried: aggregatedStats.queried,
                totalClaims: aggregatedStats.totalClaims,
              }}
              onSelectStatus={handleDashboardCardClick}
              role="level2"
            />
          </Paper>
        ) : (
          <Paper sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
            <Button onClick={() => {
              setShowTable(false);
              setSelectedStatus('all');
              setSearchTerm('');
            }} sx={{ mb: 2 }}>
              Back to Cards
            </Button>
            <ClaimsTable
              filteredClaims={filteredClaims}
              selectedStatus={selectedStatus}
              searchTerm={searchTerm}
              statusTabs={statusTabs}
              onTabChange={(e, v) => {
                setSelectedStatus(v);
                setSearchTerm('');
              }}
              onSearchChange={e => setSearchTerm(e.target.value)}
              onClearSearch={() => setSearchTerm('')}
              onViewDetails={handleViewFullDetails}
            />
          </Paper>
        )
      )}

      {activeView === 'fullDetails' && selectedClaimId && (
        <ClaimFullDetailsPage
          claimId={selectedClaimId}
          onBack={handleBackToDashboard}
          isLevel2Officer={true}
          loggedInUserData={loggedInUserData}
        />
      )}
    </>
  );
}

export default Level2OfficerDashboardPage;
