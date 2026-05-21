import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    CircularProgress,
    Button,
    Paper,
    Snackbar,
    Alert,
    Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getStatusLabel, formatDate, formatAmount } from '../utils/helpers';
import '../index.css';
import './ClaimDetailsPage.css';

// Now this component acts as the "summary" details page.
function ClaimDetailsPage({ claimId, onBack, onViewFullDetails }) { // Added onViewFullDetails prop
    const finalClaimId = claimId;

    const [claim, setClaim] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const fetchClaimDetails = useCallback(async () => {
        if (!finalClaimId) {
            setError("No Claim ID provided.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:9090/claims/${finalClaimId}`);
            setClaim(response.data);
        } catch (err) {
            console.error("Error fetching claim details:", err);
            setError("Failed to fetch claim details. Please try again.");
            setClaim(null);
        } finally {
            setLoading(false);
        }
    }, [finalClaimId]);

    useEffect(() => {
        fetchClaimDetails();
    }, [fetchClaimDetails]);

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };

    const handleGoBack = () => {
        if (onBack) {
            onBack(); // Calls the onBack prop (to dashboard or previous summary)
        } else {
            console.warn("onBack prop not provided to ClaimDetailsPage. Cannot navigate back.");
            setSnackbar({ open: true, message: "Navigation error: Cannot go back.", severity: "error" });
        }
    };

    const handleViewFullDetailsClick = () => {
        if (onViewFullDetails && claim?.id) {
            onViewFullDetails(claim.id); // Call the new prop to switch to full details view
        } else {
            console.warn("onViewFullDetails prop or claim ID not provided.");
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4, height: '300px' }}>
                <CircularProgress size={60} />
                <Typography variant="h6" sx={{ ml: 2, color: 'text.secondary' }}>Loading claim details...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ mt: 4, textAlign: 'center', p: 3, border: '1px solid #ff9800', borderRadius: '8px', backgroundColor: '#fff3e0' }}>
                <Typography variant="h6" color="error">
                    Error: {error}
                </Typography>
                <Button variant="contained" onClick={handleGoBack} sx={{ mt: 3, mr: 1 }}>
                    Go Back
                </Button>
                <Button variant="contained" onClick={fetchClaimDetails} sx={{ mt: 3 }}>
                    Try Again
                </Button>
            </Box>
        );
    }

    if (!claim || !claim.id) {
        return (
            <Box sx={{ mt: 4, textAlign: 'center', p: 3, border: '1px solid #ff9800', borderRadius: '8px', backgroundColor: '#fff3e0' }}>
                <Typography variant="h6" color="warning.main">
                    Claim not found.
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    The claim with ID "{finalClaimId}" could not be retrieved.
                </Typography>
                <Button variant="contained" onClick={handleGoBack} sx={{ mt: 3 }}>
                    Go Back to Claims Dashboard
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, margin: 'auto' }}>
            <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={handleGoBack}
                sx={{ mb: 3 }}
            >
                Back to Claims Dashboard
            </Button>
            <Paper elevation={3} sx={{ p: 4, borderRadius: '12px' }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 2, color: '#1A3E72', fontWeight: 'bold' }}>
                    Claim Details: {claim.id}
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Claim ID:</Typography>
                    <Typography variant="body1">{claim.id}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Description:</Typography>
                    <Typography variant="body1">{claim.description || 'N/A'}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Claim Date:</Typography>
                    <Typography variant="body1">{formatDate(claim.claim_date)}</Typography>
                </Box>
                {claim.service_date && (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Service Date:</Typography>
                        <Typography variant="body1">{formatDate(claim.service_date)}</Typography>
                    </Box>
                )}
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Amount Claimed:</Typography>
                    <Typography variant="body1">{formatAmount(claim.total_amount_claimed)}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Status:</Typography>
                    <Typography variant="body1">
                        <span className={`status-tag status-${claim.status?.replace('status_', '')}`}>
                            {getStatusLabel(claim.status)}
                        </span>
                    </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Policy ID:</Typography>
                    <Typography variant="body1">{claim.policy_id}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Hospital ID:</Typography>
                    <Typography variant="body1">{claim.hospital_id}</Typography>
                </Box>
                {/* Re-added the "View Full Details" button, now using the prop callback */}
                <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={handleViewFullDetailsClick} // Call the new handler
                >
                    View Full Details
                </Button>
            </Paper>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default ClaimDetailsPage;