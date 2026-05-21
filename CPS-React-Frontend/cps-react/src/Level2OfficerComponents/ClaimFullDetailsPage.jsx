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
    TextField,
} from '@mui/material';
import { getStatusLabel, formatAmount, formatDate } from '../utils/helpers';
import FieldDoctors from './FieldDoctors';
import QueryChatbotPage from './QueryChatbotPage';
import './ClaimFullDetailsPage.css';

const CLAIM_AMOUNT_THRESHOLD = 500000;

function ClaimFullDetailsPage({ claimId, onBack, isLevel2Officer = true, loggedInUserData }) {
    const [claim, setClaim] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [actionToConfirm, setActionToConfirm] = useState(null);
    const [showAssignDoctorComponent, setShowAssignDoctorComponent] = useState(false);
    const [showQueryChatbot, setShowQueryChatbot] = useState(false);

    // Officer ID is always from props
    const currentOfficerId = loggedInUserData?.id || (isLevel2Officer ? 'L2_Officer' : 'L1_Officer');

    const fetchClaimDetails = useCallback(async () => {
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
            setError('Failed to load claim details. Please ensure the JSON server is running and accessible.');
            setLoading(false);
        }
    }, [claimId]);

    useEffect(() => {
        fetchClaimDetails();
    }, [fetchClaimDetails]);

    const STATUS_STEPS = useMemo(() => {
        const baseSteps = [
            { key: 'status_raised', label: 'Raised' },
            { key: 'status_pending', label: 'Pending (Field Doc Review)' },
            { key: 'status_approved_by_field_doctor', label: 'Field Doctor Approved' },
        ];
        if (claim && (claim.total_amount_claimed || 0) > CLAIM_AMOUNT_THRESHOLD) {
            return [
                ...baseSteps,
                { key: 'status_approved_by_level1_officer', label: 'Approved (L1 Officer) - Pending L2' },
                { key: 'status_approved_by_level2_officer', label: 'Approved (L2 Officer)' },
                { key: 'status_settled', label: 'Settled' },
            ];
        } else {
            return [
                ...baseSteps,
                { key: 'status_approved_by_level1_officer', label: 'Approved (L1 Officer)' },
                { key: 'status_settled', label: 'Settled' },
            ];
        }
    }, [claim]);

    const getStatusStepIndex = useCallback(
        (status) => {
            if (status.startsWith('status_rejected') || status === 'status_queried') return -1;
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
            let updatedStatusHistory = claim.status_history && Array.isArray(claim.status_history)
                ? [...claim.status_history]
                : [];
            updatedStatusHistory.push(newStatusHistoryEntry);
            const patchPayload = {
                status: newStatus,
                status_history: updatedStatusHistory,
            };
            const response = await axios.patch(`http://localhost:9090/claims/${claimId}`, patchPayload);
            setClaim(response.data);
            setSuccessMessage(`Claim ${claimId} successfully updated to "${getStatusLabel(newStatus)}".`);
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
        if (!claim) return;
        const isHighValueClaim = (claim.total_amount_claimed || 0) > CLAIM_AMOUNT_THRESHOLD;
        switch (actionToConfirm) {
            case 'reject':
                let rejectStatus;
                if (claim.status === 'status_pending' && claim.field_doctor_id !== null) {
                    rejectStatus = 'status_rejected_by_field_doctor';
                } else if (isLevel2Officer && (claim.status === 'status_approved_by_level1_officer' || (claim.status === 'status_approved_by_field_doctor' && isHighValueClaim))) {
                    rejectStatus = 'status_rejected_by_level2_officer';
                } else if (claim.status === 'status_approved_by_field_doctor' || (claim.status === 'status_approved_by_level1_officer' && !isHighValueClaim)) {
                    rejectStatus = 'status_rejected_by_l1_officer';
                } else {
                    rejectStatus = 'status_rejected';
                }
                handleUpdateClaimStatus(rejectStatus);
                break;
            case 'approveL1':
                handleUpdateClaimStatus('status_approved_by_level1_officer');
                break;
            case 'approveL2':
                handleUpdateClaimStatus('status_approved_by_level2_officer');
                break;
            case 'settle':
                handleUpdateClaimStatus('status_settled');
                break;
            case 'query':
                handleUpdateClaimStatus('status_queried');
                break;
            default:
                break;
        }
    };

    const handleAssignDoctorClick = () => {
        setShowAssignDoctorComponent(true);
    };

    const handleBackFromAssignDoctor = () => {
        setShowAssignDoctorComponent(false);
        fetchClaimDetails();
    };

    // --- UPDATED: Always open chatbot, only update status if not already queried ---
    const handleQueryClaimClick = useCallback(() => {
        if (claim.status !== 'status_queried') {
            handleUpdateClaimStatus('status_queried');
        }
        setShowQueryChatbot(true);
    }, [claim, handleUpdateClaimStatus]);

    const handleBackFromQueryChatbot = useCallback(() => {
        setShowQueryChatbot(false);
        fetchClaimDetails();
    }, [fetchClaimDetails]);

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
                onQuerySubmit={handleBackFromQueryChatbot}
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

    const visualStatusForStatusBar = claim.status;
    const currentStepIndex = getStatusStepIndex(visualStatusForStatusBar);
    const isRejected = claim.status.startsWith('status_rejected');
    const isQueried = claim.status === 'status_queried';
    const isSettled = claim.status === 'status_settled';
    const isHighValueClaim = (claim.total_amount_claimed || 0) > CLAIM_AMOUNT_THRESHOLD;
    const hideAllL2ButtonsAtFieldDoctorApproved = isLevel2Officer && claim.status === 'status_approved_by_field_doctor';

    const showAssignFieldDoctorButton = claim.status === 'status_raised' && claim.field_doctor_id === null;
    const showL2OfficerActions =
        isLevel2Officer &&
        isHighValueClaim &&
        claim.status === 'status_approved_by_level1_officer' &&
        !hideAllL2ButtonsAtFieldDoctorApproved;
    const showL1OfficerActions =
        !isLevel2Officer &&
        claim.status === 'status_approved_by_field_doctor';
    const canSettle =
        !isRejected && !isQueried && !isSettled && (
            (!isLevel2Officer && claim.status === 'status_approved_by_level1_officer' && !isHighValueClaim) ||
            (isLevel2Officer && claim.status === 'status_approved_by_level2_officer')
        ) && !hideAllL2ButtonsAtFieldDoctorApproved;
    const canReject =
        !isRejected && !isSettled && !isQueried && (
            (claim.status === 'status_pending' && claim.field_doctor_id !== null) ||
            (!isLevel2Officer && claim.status === 'status_approved_by_field_doctor') ||
            (isLevel2Officer && claim.status === 'status_approved_by_level1_officer' && isHighValueClaim) ||
            (isLevel2Officer && claim.status === 'status_approved_by_field_doctor' && isHighValueClaim)
        ) && !hideAllL2ButtonsAtFieldDoctorApproved;

    // SHOW QUERY BUTTON for all except rejected, settled, or raised (including status_queried)
    const canInitiateQuery =
        !isRejected && !isSettled && claim.status !== 'status_raised' && !hideAllL2ButtonsAtFieldDoctorApproved;

    return (
        <div className="claim-details-card">
            <Typography variant="h5" className="claim-details-title" gutterBottom>
                Claim Full Details ({isLevel2Officer ? 'L2 Officer' : 'L1 Officer'} View)
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
            <Divider sx={{ mb: 2 }} />

            {/* Status Bar or Status Info */}
            {!isRejected && !isQueried && !isSettled ? (
                <div className="claim-status-bar">
                    {STATUS_STEPS.map((step, idx) => {
                        const isCompleted = currentStepIndex !== -1 && idx < currentStepIndex;
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
                    <Typography
                        variant="h6"
                        color={isRejected ? 'error' : (isQueried ? 'warning' : 'success')}
                        sx={{ fontWeight: 'bold' }}
                    >
                        Status: {getStatusLabel(claim.status)}
                    </Typography>
                    {claim.status_history && (() => {
                        const lastEntry = claim.status_history.slice().reverse().find(entry => entry.status === claim.status);
                        return lastEntry ? (
                            <Typography variant="body2" color="text.secondary">
                                Changed by {lastEntry.changedBy} on {formatDate(lastEntry.changedAt)}
                            </Typography>
                        ) : null;
                    })()}
                    {isRejected && (
                        <Typography variant="body2" color="text.secondary" mt={1}>
                            This claim was rejected and is no longer in the approval flow.
                        </Typography>
                    )}
                    {isQueried && (
                        <Typography variant="body2" color="text.secondary" mt={1}>
                            This claim is currently under query.
                        </Typography>
                    )}
                    {isSettled && (
                        <Typography variant="body2" color="text.secondary" mt={1}>
                            This claim has been settled.
                        </Typography>
                    )}
                </Box>
            )}

            {/* Claim Details */}
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
                <span className="claim-details-value">{formatAmount(claim.total_amount_claimed)} {isHighValueClaim && '(High Value Claim)'}</span>
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
                {showAssignFieldDoctorButton && (
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleAssignDoctorClick}
                        disabled={loading}
                    >
                        Assign Field Doctor
                    </Button>
                )}
                {showL1OfficerActions && (
                    <>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleOpenConfirmDialog('approveL1')}
                            disabled={loading}
                        >
                            Approve by L1 Officer
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleOpenConfirmDialog('reject')}
                            disabled={loading}
                        >
                            Reject by L1 Officer
                        </Button>
                    </>
                )}
                {showL2OfficerActions && (
                    <>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleOpenConfirmDialog('approveL2')}
                            disabled={loading}
                        >
                            Approve by L2 Officer
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleOpenConfirmDialog('reject')}
                            disabled={loading}
                        >
                            Reject by L2 Officer
                        </Button>
                    </>
                )}
                {canSettle && (
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleOpenConfirmDialog('settle')}
                        disabled={loading}
                    >
                        Settle Claim
                    </Button>
                )}
                {canInitiateQuery && (
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={handleQueryClaimClick}
                        disabled={loading}
                    >
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
                    {actionToConfirm === 'approveL1'
                        ? 'Confirm Approval by L1 Officer'
                        : actionToConfirm === 'reject'
                            ? 'Confirm Rejection'
                            : actionToConfirm === 'approveL2'
                                ? 'Confirm Approval by L2 Officer'
                                : actionToConfirm === 'settle'
                                    ? 'Confirm Settlement'
                                    : 'Confirm Query'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="confirm-dialog-description">
                        Are you sure you want to{' '}
                        {actionToConfirm === 'approveL1'
                            ? 'approve by L1 Officer'
                            : actionToConfirm === 'reject'
                                ? 'reject'
                                : actionToConfirm === 'approveL2'
                                    ? 'approve by L2 Officer'
                                    : actionToConfirm === 'settle'
                                        ? 'settle'
                                        : 'query'}{' '}
                        this claim (Claim ID: {claim.id})? This action will update its status.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDialog} color="primary" disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmAction}
                        color={actionToConfirm === 'reject' || actionToConfirm === 'query' ? 'error' : 'success'}
                        autoFocus
                        disabled={loading}
                    >
                        {actionToConfirm === 'approveL1'
                            ? 'Confirm Approve'
                            : actionToConfirm === 'reject'
                                ? 'Confirm Reject'
                                : actionToConfirm === 'approveL2'
                                    ? 'Confirm Approve'
                                    : actionToConfirm === 'settle'
                                        ? 'Confirm Settle'
                                        : 'Confirm Query'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ClaimFullDetailsPage;
