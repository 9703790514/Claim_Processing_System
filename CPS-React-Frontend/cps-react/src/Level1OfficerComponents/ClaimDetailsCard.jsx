import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Box, Typography, CircularProgress, Button, Paper, Container, Divider } from '@mui/material';

import ClaimDetailsCard from './ClaimDetailsCard';
import ClaimsTable from './ClaimsTable';
import ClaimFullDetailsPage from './ClaimFullDetailsPage';
import { getStatusLabel } from '../utils/helpers';
import Header from './Header';

const CLAIM_AMOUNT_THRESHOLD = 500000; // Rs. 5,00,000

function Level1OfficerDashboardPage({ loggedInUserData, onLogout }) {
    const [allClaims, setAllClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showTable, setShowTable] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeView, setActiveView] = useState('dashboard');
    const [selectedClaimId, setSelectedClaimId] = useState(null);

    // Fetch all claims relevant to Level 1 Officer
    const fetchAllClaims = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://localhost:9090/claims');
            const relevantClaims = response.data.filter(claim =>
                [
                    'status_raised',
                    'status_pending',
                    'status_approved_by_field_doctor',
                    'status_approved_by_level1_officer',
                    'status_rejected_by_l1_officer',
                    'status_under_query',
                    'status_forwarded_to_level2_officer'
                ].includes(claim.status) &&
                claim.status !== 'status_settled' &&
                claim.status !== 'status_rejected_by_field_doctor' &&
                claim.status !== 'status_rejected'
            );
            setAllClaims(relevantClaims || []);
        } catch (err) {
            setError("Failed to fetch claims list for Level 1 Officer. Ensure the JSON server is running.");
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

    // Prepare stats for the card dashboard
    const aggregatedStats = useMemo(() => {
        let stats = {
            raised: 0,
            pending: 0,
            approved_by_l1: 0,
            settled: 0,
            rejected: 0,
            queried: 0,
            totalClaims: allClaims.length,
        };
        allClaims.forEach(claim => {
            switch (claim.status) {
                case 'status_raised':
                    stats.raised++;
                    break;
                case 'status_pending':
                case 'status_approved_by_field_doctor':
                    stats.pending++;
                    break;
                case 'status_approved_by_level1_officer':
                    stats.approved_by_l1++;
                    break;
                case 'status_settled':
                    stats.settled++;
                    break;
                case 'status_rejected':
                case 'status_rejected_by_field_doctor':
                case 'status_rejected_by_l1_officer':
                    stats.rejected++;
                    break;
                case 'status_under_query':
                    stats.queried++;
                    break;
                default:
                    break;
            }
        });
        return stats;
    }, [allClaims]);

    // Filter claims for the table view
    const filteredClaims = useMemo(() => {
        return allClaims.filter(claim => {
            let matchesStatus = false;
            if (selectedStatus === 'all') {
                matchesStatus = true;
            } else if (selectedStatus === 'status_pending') {
                matchesStatus = (
                    claim.status === 'status_pending' ||
                    claim.status === 'status_approved_by_field_doctor'
                );
            } else if (selectedStatus === 'status_rejected_all') {
                matchesStatus = (
                    claim.status === 'status_rejected' ||
                    claim.status === 'status_rejected_by_field_doctor' ||
                    claim.status === 'status_rejected_by_l1_officer'
                );
            } else {
                matchesStatus = claim.status === selectedStatus;
            }
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            const matchesSearchTerm =
                (claim.id && claim.id.toLowerCase().includes(lowerCaseSearchTerm)) ||
                (claim.treatment && claim.treatment.toLowerCase().includes(lowerCaseSearchTerm)) ||
                (claim.policy_id && claim.policy_id.toLowerCase().includes(lowerCaseSearchTerm)) ||
                (claim.hospital_id && claim.hospital_id.toLowerCase().includes(lowerCaseSearchTerm)) ||
                (getStatusLabel(claim.status).toLowerCase().includes(lowerCaseSearchTerm));
            return matchesStatus && matchesSearchTerm;
        });
    }, [allClaims, selectedStatus, searchTerm]);

    // Handle card click to show table for that status
    const handleDashboardCardClick = (status) => {
        setSelectedStatus(status);
        setShowTable(true);
        setSearchTerm('');
    };

    // Handle table row click to show full details
    const handleViewFullDetails = useCallback((claimId) => {
        setSelectedClaimId(claimId);
        setActiveView('fullDetails');
    }, []);

    // Back from details view
    const handleBackToDashboard = useCallback(() => {
        setSelectedClaimId(null);
        setActiveView('dashboard');
        setShowTable(false);
        setSearchTerm('');
        setSelectedStatus('all');
        fetchAllClaims();
    }, [fetchAllClaims]);

    // Loading and error states
    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4, height: 'calc(100vh - 100px)' }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ ml: 2, color: 'text.secondary' }}>Loading Level 1 Officer Dashboard...</Typography>
        </Box>
    );
    if (error) return (
        <Box sx={{ mt: 4, textAlign: 'center', p: 3 }}>
            <Typography variant="h6" color="error">{error}</Typography>
            <Button variant="contained" onClick={fetchAllClaims} sx={{ mt: 3 }}>
                Try Again
            </Button>
        </Box>
    );

    // Full details view
    if (activeView === 'fullDetails' && selectedClaimId) {
        return (
            <ClaimFullDetailsPage
                claimId={selectedClaimId}
                onBack={handleBackToDashboard}
                isLevel2Officer={false}
                loggedInUserData={loggedInUserData}
            />
        );
    }

    // Main dashboard view
    return (
        <>
            <Header user={loggedInUserData} onLogout={onLogout} />
            <Box sx={{ mt: 10, mb: 4 }}>
                <Container maxWidth="xl">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                            Level 1 Officer Dashboard ({loggedInUserData?.name || loggedInUserData?.id})
                        </Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />

                    {!showTable ? (
                        <Paper sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
                            <ClaimDetailsCard
                                aggregatedStats={aggregatedStats}
                                onSelectStatus={handleDashboardCardClick}
                            />
                        </Paper>
                    ) : (
                        <Paper sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    setShowTable(false);
                                    setSearchTerm('');
                                    setSelectedStatus('all');
                                }}
                                sx={{ mb: 2 }}
                            >
                                Back to Overview Cards
                            </Button>
                            <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
                                Claims for Level 1 Officer: {loggedInUserData?.name || loggedInUserData?.id}
                            </Typography>
                            {filteredClaims.length === 0 && !loading && !error && (
                                <Typography variant="body1" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                                    No claims found matching the selected status or search criteria.
                                </Typography>
                            )}
                            <ClaimsTable
                                filteredClaims={filteredClaims}
                                selectedStatus={selectedStatus}
                                searchTerm={searchTerm}
                                statusTabs={[
                                    { label: 'All', value: 'all' },
                                    { label: 'Raised', value: 'status_raised' },
                                    { label: 'Pending', value: 'status_pending' },
                                    { label: 'L1 Approved', value: 'status_approved_by_level1_officer' },
                                    { label: 'Rejected', value: 'status_rejected_all' },
                                    { label: 'Queried', value: 'status_under_query' },
                                ]}
                                onTabChange={(e, v) => setSelectedStatus(v)}
                                onSearchChange={e => setSearchTerm(e.target.value)}
                                onClearSearch={() => setSearchTerm('')}
                                onViewDetails={handleViewFullDetails}
                            />
                        </Paper>
                    )}
                </Container>
            </Box>
        </>
    );
}

export default Level1OfficerDashboardPage;
