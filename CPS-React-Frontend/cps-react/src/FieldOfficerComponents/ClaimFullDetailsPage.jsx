import React, { useEffect, useState, useCallback } from 'react';
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Divider,
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Tooltip,
    TextField,
} from '@mui/material';
import { getStatusLabel, formatAmount, formatDate } from '../utils/helpers';
import axios from 'axios';
import './ClaimFullDetailsPage.css';

const FIELD_DOCTOR_STATUS_STEPS = [
    { key: 'status_raised', label: 'Raised' },
    { key: 'status_pending', label: 'Pending Field Doctor Review' },
    { key: 'status_approved_by_field_doctor', label: 'Approved by Field Doctor' },
];

function getFieldDoctorStatusStepIndex(status) {
    const visualStatus = status === 'status_raised' ? 'status_pending' : status;
    return FIELD_DOCTOR_STATUS_STEPS.findIndex(step => step.key === visualStatus);
}

function ClaimFullDetailsPage({ claimId, onBack, initialClaimData, loggedInUserData }) {
    const [claim, setClaim] = useState(initialClaimData || null);
    const [loading, setLoading] = useState(!initialClaimData);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [actionToConfirm, setActionToConfirm] = useState(null);

    const currentFieldDoctorId = loggedInUserData?.id || '';

    const fetchClaimDetails = useCallback(async () => {
        if (initialClaimData && claim && claim.id === claimId) {
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        setSuccessMessage(null);
        if (!claimId) {
            setError("No Claim ID provided to the component.");
            setLoading(false);
            return;
        }
        try {
            const response = await axios.get(`http://localhost:9090/claims/${claimId}`);
            setClaim(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load claim details. Please ensure the JSON server is running.');
            setLoading(false);
        }
    }, [claimId, initialClaimData, claim]);

    useEffect(() => {
        fetchClaimDetails();
    }, [fetchClaimDetails]);

    const handleUpdateClaimStatus = async (newStatus) => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);
        setOpenConfirmDialog(false);
        try {
            const newStatusHistoryEntry = {
                status: newStatus,
                changedBy: currentFieldDoctorId,
                changedAt: new Date().toISOString(),
            };
            let updatedStatusHistory = [];
            if (claim.status_history && Array.isArray(claim.status_history)) {
                updatedStatusHistory = [...claim.status_history];
            } else {
                updatedStatusHistory.push({
                    status: 'status_raised',
                    changedBy: 'System/Patient',
                    changedAt: claim.claim_date || new Date().toISOString(),
                });
            }
            updatedStatusHistory.push(newStatusHistoryEntry);

            const patchPayload = {
                status: newStatus,
                status_history: updatedStatusHistory,
            };

            const response = await axios.patch(`http://localhost:9090/claims/${claimId}`, patchPayload);
            setClaim(response.data);

            let message = `Claim ${claimId} successfully `;
            if (newStatus === 'status_approved_by_field_doctor') {
                message += 'approved by Field Doctor.';
            } else if (newStatus === 'status_rejected_by_field_doctor') {
                message += 'rejected by Field Doctor.';
            } else if (newStatus === 'status_pending') {
                message += 'moved to pending.';
            }
            setSuccessMessage(message);
        } catch (err) {
            setError(`Failed to update claim status.`);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenConfirmDialog = (action) => {
        setActionToConfirm(action);
        setOpenConfirmDialog(true);
    };

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
        setActionToConfirm(null);
    };

    const handleConfirmAction = () => {
        if (actionToConfirm === 'approveFD') {
            handleUpdateClaimStatus('status_approved_by_field_doctor');
        } else if (actionToConfirm === 'rejectFD') {
            handleUpdateClaimStatus('status_rejected_by_field_doctor');
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center', minHeight: '300px' }}>
                <CircularProgress size={30} />
                <Typography>Loading claim details...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ textAlign: 'center', mt: 5 }}>
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
                <Button variant="contained" onClick={onBack} sx={{ mt: 2 }}>
                    Back
                </Button>
            </Box>
        );
    }

    if (!claim) {
        return (
            <Box sx={{ textAlign: 'center', mt: 5 }}>
                <Typography color="text.secondary">No claim data available for display.</Typography>
                <Button variant="contained" onClick={onBack} sx={{ mt: 2 }}>
                    Back
                </Button>
            </Box>
        );
    }

    const isRejected = claim.status === 'status_rejected' || claim.status === 'status_rejected_by_field_doctor';
    const isApprovedByFD = claim.status === 'status_approved_by_field_doctor';
    const showFieldDoctorActions = (claim.status === 'status_raised' || claim.status === 'status_pending') && claim.field_doctor_id !== null;

    return (
        <div className="claim-details-card">
            <Typography variant="h5" className="claim-details-title" gutterBottom>
                Claim Full Details (Field Doctor View)
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {successMessage && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {successMessage}
                </Alert>
            )}

            <Box sx={{ mb: 2, p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                    Currently Acting As:
                </Typography>
                <TextField
                    label="Field Doctor ID"
                    value={currentFieldDoctorId}
                    size="small"
                    variant="outlined"
                    sx={{ mt: 1, width: '100%' }}
                    disabled
                />
            </Box>
            <Divider sx={{ mb: 2 }} />

            {/* Claim Fields */}
            <div className="claim-details-field">
                <span className="claim-details-label">Claim ID:</span>
                <span className="claim-details-value">{claim.id}</span>
            </div>
            <div className="claim-details-field">
                <span className="claim-details-label">Current Status:</span>
                <span className="claim-details-status">{getStatusLabel(claim.status)}</span>
            </div>
            <div className="claim-details-field">
                <span className="claim-details-label">Description:</span>
                <span className="claim-details-value">{claim.description || 'N/A'}</span>
            </div>
            <div className="claim-details-field">
                <span className="claim-details-label">Treatment:</span>
                <span className="claim-details-value">{claim.treatment || 'N/A'}</span>
            </div>
            <div className="claim-details-field">
                <span className="claim-details-label">Amount Claimed:</span>
                <span className="claim-details-value">{formatAmount(claim.total_amount_claimed)}</span>
            </div>
            <div className="claim-details-field">
                <span className="claim-details-label">Claim Date:</span>
                <span className="claim-details-value">{formatDate(claim.claim_date)}</span>
            </div>
            <div className="claim-details-field">
                <span className="claim-details-label">Admission Date:</span>
                <span className="claim-details-value">{formatDate(claim.admission_date)}</span>
            </div>
            <div className="claim-details-field">
                <span className="claim-details-label">Discharge Date:</span>
                <span className="claim-details-value">{formatDate(claim.discharge_date)}</span>
            </div>
            <div className="claim-details-field">
                <span className="claim-details-label">Policy ID:</span>
                <span className="claim-details-value">{claim.policy_id}</span>
            </div>
            <div className="claim-details-field">
                <span className="claim-details-label">Hospital ID:</span>
                <span className="claim-details-value">{claim.hospital_id}</span>
            </div>
            <div className="claim-details-field">
                <span className="claim-details-label">Pre-Approval Received:</span>
                <span className="claim-details-value">{claim.pre_approval_received ? 'Yes' : 'No'}</span>
            </div>
            <div className="claim-details-field">
                <span className="claim-details-label">Documents:</span>
                <span className="claim-details-docs">
                    {(claim.documents && claim.documents.length > 0) ? claim.documents.join(', ') : 'None'}
                </span>
            </div>
            <div className="claim-details-field">
                <span className="claim-details-label">Assigned Field Doctor ID:</span>
                <span className="claim-details-value">
                    {claim.field_doctor_id || 'N/A'}
                </span>
            </div>
            {claim.assigned_doctor_id && (
                <div className="claim-details-field">
                    <span className="claim-details-label">Assigned Internal Doctor ID:</span>
                    <span className="claim-details-value">{claim.assigned_doctor_id}</span>
                </div>
            )}

            {/* Status History */}
            {claim.status_history && claim.status_history.length > 0 && (
                <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom>
                        Status History
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                        {claim.status_history.map((entry, index) => (
                            <Typography key={index} variant="body2" color="text.secondary">
                                <strong>{getStatusLabel(entry.status)}:</strong> Changed by {entry.changedBy} on {formatDate(entry.changedAt)}
                            </Typography>
                        ))}
                    </Box>
                </>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mt: 3, mb: 2 }}>
                {claim.status === 'status_raised' && claim.field_doctor_id === null && (
                    <Button
                        variant="outlined"
                        color="secondary"
                        className="claim-details-assign-btn"
                        sx={{ display: 'block', margin: '24px auto 0 auto', fontWeight: 600 }}
                        onClick={() => alert('Assign Doctor functionality is handled outside this view.')}
                    >
                        Assign Field Doctor
                    </Button>
                )}
                {showFieldDoctorActions && (
                    <>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={() => handleOpenConfirmDialog('approveFD')}
                        >
                            Approve by Field Doctor
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleOpenConfirmDialog('rejectFD')}
                        >
                            Reject Claim
                        </Button>
                    </>
                )}
                {isApprovedByFD && (
                    <Typography variant="body1" color="success" sx={{ mt: 2, fontWeight: 'bold' }}>
                        This claim has been approved by a Field Doctor.
                    </Typography>
                )}
                {isRejected && (
                    <Typography variant="body1" color="error" sx={{ mt: 2, fontWeight: 'bold' }}>
                        This claim has been rejected by a Field Doctor.
                    </Typography>
                )}
            </Box>

            <Button
                variant="contained"
                className="claim-details-back-btn"
                onClick={onBack}
            >
                &larr; Back
            </Button>

            {/* Confirmation Dialog */}
            <Dialog
                open={openConfirmDialog}
                onClose={handleCloseConfirmDialog}
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-description"
            >
                <DialogTitle id="confirm-dialog-title">
                    {actionToConfirm === 'approveFD' ? "Confirm Field Doctor Approval" : "Confirm Field Doctor Rejection"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="confirm-dialog-description">
                        Are you sure you want to {actionToConfirm === 'approveFD' ? "approve" : "reject"} this claim (Claim ID: {claim.id})? This action will update its status.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDialog} color="primary" disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmAction}
                        color={actionToConfirm === 'approveFD' ? "success" : "error"}
                        autoFocus
                        disabled={loading}
                    >
                        {actionToConfirm === 'approveFD' ? "Confirm Approve" : "Confirm Reject"}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ClaimFullDetailsPage;
