import React, { useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
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
} from '@mui/material';
import { getStatusLabel, formatAmount, formatDate } from '../utils/helpers';
import FieldDoctors from './FieldDoctors';
import QueryChatbotPage from './QueryChatbotPage';
import './ClaimFullDetailsPage.css';

const CLAIM_AMOUNT_THRESHOLD = 500000;

function ClaimFullDetailsPage({ claimId, onBack, loggedInUserData }) {
    const [claim, setClaim] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [actionToConfirm, setActionToConfirm] = useState(null);
    const [showAssignDoctorComponent, setShowAssignDoctorComponent] = useState(false);
    const [showQueryChatbot, setShowQueryChatbot] = useState(false);

    // Officer/Doctor ID is always from loggedInUserData
    const currentOfficerId = loggedInUserData?.id || '';

    const fetchClaimDetails = async () => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        if (!claimId) {
            setError("No Claim ID provided.");
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
    };

    useEffect(() => {
        fetchClaimDetails();
    }, [claimId]);

    const STATUS_STEPS = useMemo(() => {
        const baseSteps = [
            { key: 'status_raised', label: 'Raised' },
            { key: 'status_pending', label: 'Pending' },
            { key: 'status_approved_by_field_doctor', label: 'Field Doctor Approved' },
            { key: 'status_approved_by_level1_officer', label: 'Approved (L1 Officer)' },
        ];
        if (claim && (claim.total_amount_claimed || 0) > CLAIM_AMOUNT_THRESHOLD) {
            return [
                ...baseSteps,
                { key: 'status_approved_by_level2_officer', label: 'Approved (L2 Officer)' },
                { key: 'status_settled', label: 'Settled' },
            ];
        } else {
            return [...baseSteps, { key: 'status_settled', label: 'Settled' }];
        }
    }, [claim]);

    const getStatusStepIndex = useCallback(
        (status) => {
            if (status === 'status_rejected' || status === 'status_queried' || status === 'status_rejected_by_field_doctor' || status === 'status_rejected_by_l1_officer' || status === 'status_rejected_by_level2_officer') return -1;
            return STATUS_STEPS.findIndex((step) => step.key === status);
        },
        [STATUS_STEPS]
    );

    const handleUpdateClaimStatus = async (newStatus) => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);
        setOpenConfirmDialog(false);

        try {
            const newStatusHistoryEntry = {
                status: newStatus,
                changedBy: currentOfficerId,
                changedAt: new Date().toISOString(),
            };

            const updatedStatusHistory = claim.status_history
                ? [...claim.status_history, newStatusHistoryEntry]
                : [
                    {
                        status: 'status_raised',
                        changedBy: 'System/Initial Creator',
                        changedAt: claim.claim_date,
                    },
                    newStatusHistoryEntry,
                ];

            const response = await axios.patch(`http://localhost:9090/claims/${claimId}`, {
                status: newStatus,
                status_history: updatedStatusHistory,
            });
            setClaim(response.data);
            const statusLabel = getStatusLabel(newStatus);
            setSuccessMessage(`Claim ${claimId} successfully updated to "${statusLabel}".`);
        } catch (err) {
            setError(`Failed to update claim status to "${getStatusLabel(newStatus)}".`);
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
        if (actionToConfirm === 'approve') {
            handleUpdateClaimStatus('status_approved_by_field_doctor');
        } else if (actionToConfirm === 'reject') {
            handleUpdateClaimStatus('status_rejected_by_field_doctor');
        } else if (actionToConfirm === 'reject_pending') {
            handleUpdateClaimStatus('status_rejected');
        } else if (actionToConfirm === 'reject_after_field_doctor_approval') {
            handleUpdateClaimStatus('status_rejected_by_l1_officer');
        } else if (actionToConfirm === 'settle') {
            handleUpdateClaimStatus('status_settled');
        } else if (actionToConfirm === 'approve_l1') {
            handleUpdateClaimStatus('status_approved_by_level1_officer');
        }
    };

    const handleAssignDoctorClick = () => {
        setShowAssignDoctorComponent(true);
    };

    const handleBackFromAssignDoctor = () => {
        setShowAssignDoctorComponent(false);
        fetchClaimDetails();
    };

    const handleQueryClaimClick = useCallback(() => {
        setShowQueryChatbot(true);
    }, []);

    const handleBackFromQueryChatbot = useCallback(() => {
        setShowQueryChatbot(false);
    }, []);

    if (showAssignDoctorComponent) {
        return (
            <FieldDoctors
                claimId={claim.id}
                onBack={handleBackFromAssignDoctor}
                onDoctorAssigned={handleBackFromAssignDoctor}
            />
        );
    }

    if (showQueryChatbot && claim) {
        return (
            <QueryChatbotPage
                claimId={claim.id}
                onBack={handleBackFromQueryChatbot}
            />
        );
    }

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
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
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

    const visualStatusForStatusBar = claim.status === 'status_raised' ? 'status_pending' : claim.status;
    const currentStepIndex = getStatusStepIndex(visualStatusForStatusBar);
    const isRejected = ['status_rejected', 'status_rejected_by_field_doctor', 'status_rejected_by_l1_officer', 'status_rejected_by_level2_officer'].includes(claim.status);
    const isQueried = claim.status === 'status_queried';

    const isHighValue = (claim.total_amount_claimed || 0) > CLAIM_AMOUNT_THRESHOLD;
    const showAssignFieldDoctorButton = claim.status === 'status_raised' && claim.field_doctor_id === null;
    const showFieldDoctorApproveRejectActions = claim.status === 'status_pending' && claim.field_doctor_id !== null;
    const showRejectPendingClaimButton = claim.status === 'status_pending' && claim.field_doctor_id === null;
    const showL1OfficerApproveAction = claim.status === 'status_approved_by_field_doctor';
    const showRejectAfterFieldDoctorApprovalButton = claim.status === 'status_approved_by_field_doctor';
    const showL2OfficerApproveRejectActions = false;
    const showSettleButton = claim.status === 'status_approved_by_level2_officer' ||
                             (claim.status === 'status_approved_by_level1_officer' && !isHighValue);
    const canInitiateQuery = !isRejected && !claim.status.includes('status_settled') && claim.status !== 'status_raised';

    return (
        <div className="claim-details-card">
            <Typography variant="h5" className="claim-details-title" gutterBottom>
                Claim Full Details
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {successMessage && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {successMessage}
                </Alert>
            )}

            <Box sx={{ mb: 2, p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                    Currently Acting As: <strong>{currentOfficerId}</strong>
                </Typography>
            </Box>

            {!isRejected && !isQueried ? (
                <div className="claim-status-bar">
                    {STATUS_STEPS.map((step, idx) => {
                        const isCompleted = idx < currentStepIndex;
                        const isActive = idx === currentStepIndex;
                        const historyEntry = claim.status_history?.find(
                            (entry) => entry.status === step.key
                        );
                        const tooltipTitle = historyEntry
                            ? `${getStatusLabel(historyEntry.status)} by ${historyEntry.changedBy} on ${formatDate(historyEntry.changedAt)}`
                            : `Status: ${step.label}`;
                        return (
                            <React.Fragment key={step.key}>
                                <Tooltip title={tooltipTitle} arrow>
                                    <div
                                        className={
                                            'claim-status-step' +
                                            (isCompleted ? ' completed' : '') +
                                            (isActive ? ' active' : '')
                                        }
                                    >
                                        <div className="claim-status-dot" />
                                        {step.label}
                                    </div>
                                </Tooltip>
                                {idx < STATUS_STEPS.length - 1 && <div className="claim-status-bar-line" />}
                            </React.Fragment>
                        );
                    })}
                </div>
            ) : (
                <Box sx={{ textAlign: 'center', my: 3 }}>
                    <Typography variant="h6" color={isRejected ? 'error' : 'warning'} sx={{ fontWeight: 'bold' }}>
                        Status: {getStatusLabel(claim.status)}
                    </Typography>
                    {isRejected && claim.status_history && (
                        <Typography variant="body2" color="text.secondary">
                            {(() => {
                                const lastRejectedEntry = claim.status_history
                                    .slice()
                                    .reverse()
                                    .find(
                                        (entry) =>
                                            entry.status === 'status_rejected' ||
                                            entry.status === 'status_rejected_by_field_doctor' ||
                                            entry.status === 'status_rejected_by_l1_officer' ||
                                            entry.status === 'status_rejected_by_level2_officer'
                                    );
                                return lastRejectedEntry
                                    ? `Rejected by ${lastRejectedEntry.changedBy} on ${formatDate(lastRejectedEntry.changedAt)}`
                                    : 'This claim was rejected.';
                            })()}
                        </Typography>
                    )}
                    {isQueried && (
                        <Typography variant="body2" color="text.secondary">
                            This claim is currently under query. Use the 'Query Claim' button for details/response if available from the dashboard.
                        </Typography>
                    )}
                </Box>
            )}

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
                    {claim.documents && claim.documents.length > 0 ? claim.documents.join(', ') : 'None'}
                </span>
            </div>
            <div className="claim-details-field">
                <span className="claim-details-label">Field Doctor Assigned:</span>
                <span className="claim-details-value">
                    {claim.field_doctor_id ? `Yes (${claim.field_doctor_id})` : 'No / Not Assigned'}
                </span>
            </div>
            {claim.assigned_doctor_id && (
                <div className="claim-details-field">
                    <span className="claim-details-label">Assigned Internal Doctor ID:</span>
                    <span className="claim-details-value">{claim.assigned_doctor_id}</span>
                </div>
            )}

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

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mt: 3, mb: 2 }}>
                {showAssignFieldDoctorButton && (
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleAssignDoctorClick}
                    >
                        Assign Field Doctor
                    </Button>
                )}
                {showFieldDoctorApproveRejectActions && (
                    <>
                        <Button variant="contained" color="success" onClick={() => handleOpenConfirmDialog('approve')}>
                            Approve by Field Doctor
                        </Button>
                        <Button variant="outlined" color="error" onClick={() => handleOpenConfirmDialog('reject')}>
                            Reject Claim (Field Doctor)
                        </Button>
                    </>
                )}
                {showRejectPendingClaimButton && (
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleOpenConfirmDialog('reject_pending')}
                    >
                        Reject Claim (L1 Officer - Pending)
                    </Button>
                )}
                {showL1OfficerApproveAction && (
                    <Button variant="contained" color="primary" onClick={() => handleOpenConfirmDialog('approve_l1')}>
                        Approve by L1 Officer
                    </Button>
                )}
                {showRejectAfterFieldDoctorApprovalButton && (
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleOpenConfirmDialog('reject_after_field_doctor_approval')}
                    >
                        Reject Claim (L1 Officer - After FD Approval)
                    </Button>
                )}
                {showL2OfficerApproveRejectActions && (
                    <>
                        <Button variant="contained" color="primary" onClick={() => handleUpdateClaimStatus('status_approved_by_level2_officer')}>
                            Approve by L2 Officer
                        </Button>
                        <Button variant="outlined" color="error" onClick={() => handleUpdateClaimStatus('status_rejected_by_level2_officer')}>
                            Reject Claim (L2 Officer)
                        </Button>
                    </>
                )}
                {showSettleButton && (
                    <Button variant="contained" color="success" onClick={() => handleOpenConfirmDialog('settle')}>
                        Settle Claim
                    </Button>
                )}
                {canInitiateQuery && (
                    <Button variant="contained" color="warning" onClick={handleQueryClaimClick}>
                        Query Claim
                    </Button>
                )}
            </Box>

            <Button variant="contained" className="claim-details-back-btn" onClick={onBack}>
                &larr; Back
            </Button>

            <Dialog
                open={openConfirmDialog}
                onClose={handleCloseConfirmDialog}
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-description"
            >
                <DialogTitle id="confirm-dialog-title">
                    {actionToConfirm === 'approve' || actionToConfirm === 'approve_l1'
                        ? 'Confirm Approval'
                        : (actionToConfirm === 'reject' || actionToConfirm === 'reject_pending' || actionToConfirm === 'reject_after_field_doctor_approval')
                        ? 'Confirm Rejection'
                        : 'Confirm Settlement'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="confirm-dialog-description">
                        Are you sure you want to{' '}
                        {actionToConfirm === 'approve' || actionToConfirm === 'approve_l1'
                            ? 'approve'
                            : (actionToConfirm === 'reject' || actionToConfirm === 'reject_pending' || actionToConfirm === 'reject_after_field_doctor_approval')
                            ? 'reject'
                            : 'settle'}{' '}
                        this claim (Claim ID: {claim.id})? This action will update its status.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDialog} color="primary" disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmAction}
                        color={(actionToConfirm === 'reject' || actionToConfirm === 'reject_pending' || actionToConfirm === 'reject_after_field_doctor_approval') ? 'error' : 'success'}
                        autoFocus
                        disabled={loading}
                    >
                        {actionToConfirm === 'approve' || actionToConfirm === 'approve_l1'
                            ? 'Confirm Approve'
                            : (actionToConfirm === 'reject' || actionToConfirm === 'reject_pending' || actionToConfirm === 'reject_after_field_doctor_approval')
                            ? 'Confirm Reject'
                            : 'Confirm Settle'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ClaimFullDetailsPage;
