import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    CircularProgress,
    Alert,
    IconButton,
    InputAdornment,
    List,
    ListItem,
    ListItemText,
    Avatar,
    Divider,
    Snackbar,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';
import { getStatusLabel } from '../utils/helpers';
import './QueryChatbotPage.css';

function QueryChatbotPage({ claimId, onBack }) {
    const [claim, setClaim] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [currentQuerySession, setCurrentQuerySession] = useState(null);
    const [isSubmittingMessage, setIsSubmittingMessage] = useState(false);
    const [isAcceptingQuery, setIsAcceptingQuery] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const isClaimApproved = useMemo(() => {
        return claim?.status === 'status_approved_by_field_doctor';
    }, [claim]);

    useEffect(() => {
        const fetchClaimAndQueryDetails = async () => {
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
                const fetchedClaim = response.data;
                setClaim(fetchedClaim);

                let queryToUse = null;

                // Find an existing open/pending query session, or the most recent one if all are closed
                if (fetchedClaim.queries && fetchedClaim.queries.length > 0) {
                    queryToUse = fetchedClaim.queries.find(q =>
                        ['open', 'pending', 'pending_customer_response'].includes(q.status)
                    ) || fetchedClaim.queries[fetchedClaim.queries.length - 1]; // Get the most recent if no active
                }

                // If no active query session found AND the claim isn't in a final "approved" state that would close a query
                if (!queryToUse && !['status_approved_by_field_doctor', 'status_settled', 'status_rejected'].includes(fetchedClaim.status)) {
                    const newQueryId = `Q${Date.now()}_${claimId}`;
                    const initialMessage = {
                        messageId: `M${Date.now()}`,
                        sender: 'System',
                        text: `Query initiated for Claim ID: ${claimId}. Please specify your question for the customer.`,
                        timestamp: new Date().toISOString()
                    };
                    queryToUse = {
                        queryId: newQueryId,
                        initiatedBy: 'Officer_ID_Placeholder', // Replace with actual officer ID logic
                        initiatedAt: new Date().toISOString(),
                        status: 'open',
                        messages: [initialMessage]
                    };

                    const updatedQueries = fetchedClaim.queries ? [...fetchedClaim.queries, queryToUse] : [queryToUse];
                    const updatedClaim = { ...fetchedClaim, status: 'status_queried', queries: updatedQueries };
                    await axios.patch(`http://localhost:9090/claims/${claimId}`, updatedClaim);
                    setClaim(updatedClaim); // Update the state with the new claim
                } else if (queryToUse && !['status_approved_by_field_doctor', 'status_settled', 'status_rejected', 'status_queried'].includes(fetchedClaim.status)) {
                     // If an active query session was found but claim status isn't 'queried', set it to 'queried'
                    await axios.patch(`http://localhost:9090/claims/${claimId}`, { status: 'status_queried' });
                    setClaim(prev => ({ ...prev, status: 'status_queried' }));
                }


                setCurrentQuerySession(queryToUse);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching claim or query details:", err);
                if (axios.isAxiosError(err) && err.response && err.response.status === 404) {
                    setError(`Claim with ID "${claimId}" not found.`);
                } else {
                    setError('Failed to load query interface. Please ensure the JSON server is running and data is correct.');
                }
                setLoading(false);
            }
        };

        fetchClaimAndQueryDetails();
    }, [claimId]);

    useEffect(() => {
        scrollToBottom();
    }, [currentQuerySession?.messages]);

    const handleSendMessage = async () => {
        if (messageInput.trim() === '' || !currentQuerySession) return;

        setIsSubmittingMessage(true);
        setError(null); // Clear any previous errors on new send

        const newMessage = {
            messageId: `M${Date.now()}`,
            sender: 'Officer_ID_Placeholder', // Replace with actual officer ID
            text: messageInput.trim(),
            timestamp: new Date().toISOString(),
        };

        try {
            const updatedMessages = [...currentQuerySession.messages, newMessage];
            const updatedQuerySession = { ...currentQuerySession, messages: updatedMessages, status: 'pending_customer_response' }; // Assume new message means awaiting response
            setCurrentQuerySession(updatedQuerySession);
            setMessageInput(''); // Clear input immediately for better UX

            // Find the index of the current query session in the claim's queries array
            const querySessionIndex = claim.queries.findIndex(q => q.queryId === currentQuerySession.queryId);
            let updatedClaimQueries;

            if (querySessionIndex !== -1) {
                updatedClaimQueries = [...claim.queries];
                updatedClaimQueries[querySessionIndex] = updatedQuerySession;
            } else {
                // This case handles if no query session existed, but now one is implicitly created by sending a message
                updatedClaimQueries = [...(claim.queries || []), updatedQuerySession];
            }

            // Important: If a new message is sent, the claim status should probably revert to 'queried'
            // to indicate an ongoing conversation, unless it's already rejected or settled.
            let newClaimStatus = claim.status;
            if (!['status_rejected', 'status_settled'].includes(claim.status)) {
                 newClaimStatus = 'status_queried';
            }

            const response = await axios.patch(`http://localhost:9090/claims/${claimId}`, {
                status: newClaimStatus,
                queries: updatedClaimQueries
            });

            setClaim(response.data); // Update main claim state
            setIsSubmittingMessage(false);

        } catch (err) {
            console.error("Error sending message or updating claim:", err);
            setError('Failed to send message or update claim status. Please try again.');
            setIsSubmittingMessage(false);
        }
    };

    const handleQueryAccepted = async () => {
        // This button should still only be actionable if the claim is not yet approved
        // and the query session is not already closed as accepted.
        if (!currentQuerySession || currentQuerySession.status === 'closed_accepted' || isClaimApproved) {
            return;
        }

        setIsAcceptingQuery(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const updatedQuerySession = { ...currentQuerySession, status: 'closed_accepted' };

            const querySessionIndex = claim.queries.findIndex(q => q.queryId === currentQuerySession.queryId);
            let updatedClaimQueries;

            if (querySessionIndex !== -1) {
                updatedClaimQueries = [...claim.queries];
                updatedClaimQueries[querySessionIndex] = updatedQuerySession;
            } else {
                updatedClaimQueries = [...(claim.queries || []), updatedQuerySession];
            }

            const updatedClaim = {
                ...claim,
                status: 'status_approved_by_field_doctor',
                queries: updatedClaimQueries
            };

            const response = await axios.patch(`http://localhost:9090/claims/${claimId}`, updatedClaim);

            setClaim(response.data); // Update the claim state immediately
            setCurrentQuerySession(updatedQuerySession); // Update the query session state
            setIsAcceptingQuery(false);
            setSuccessMessage(`Claim ${claimId} status successfully changed to Approved by Field Doctor.`);
            // No direct onBack() here, officer can stay and see the chat.
        } catch (err) {
            console.error("Error accepting query:", err);
            setError('Failed to accept query. Please try again.');
            setIsAcceptingQuery(false);
        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSuccessMessage(null);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center', minHeight: '300px' }}>
                <CircularProgress size={30} />
                <Typography>Loading query details...</Typography>
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
                <Typography color="text.secondary">No claim data available to initiate or display a query.</Typography>
                <Button variant="contained" onClick={onBack} sx={{ mt: 2 }}>
                    Back
                </Button>
            </Box>
        );
    }

    const messagesToDisplay = currentQuerySession?.messages || [];
    const isQuerySessionClosed = currentQuerySession?.status === 'closed_accepted' || currentQuerySession?.status === 'closed_rejected';

    // The "Query Accepted" button is disabled if accepting, submitting, already closed, or claim already approved/settled/rejected.
    const isQueryAcceptedButtonDisabled = isAcceptingQuery || isSubmittingMessage || isQuerySessionClosed || isClaimApproved || claim.status === 'status_settled' || claim.status === 'status_rejected';

    // The message input field is now only disabled during submission of a message or acceptance of a query
    // This allows messages to be sent even if the query session is logically 'closed' or the claim status is final.
    const isMessageInputDisabled = isSubmittingMessage || isAcceptingQuery;


    return (
        <Box className="query-chatbot-container">
            <Paper elevation={3} className="query-chatbot-paper">
                <Box className="query-chatbot-header">
                    <IconButton onClick={onBack} sx={{ mr: 1 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Query for Claim ID: {claimId}
                    </Typography>
                    {claim && (
                        <Typography variant="body2" color="text.secondary">
                            Claim Status: <strong>{getStatusLabel(claim.status)}</strong>
                        </Typography>
                    )}
                </Box>
                <Divider />
                <Box className="query-chatbot-messages">
                    <List>
                        {messagesToDisplay.length === 0 && (
                            <ListItem>
                                <ListItemText secondary="No messages yet. Start a conversation!" />
                            </ListItem>
                        )}
                        {messagesToDisplay.map((msg) => (
                            <ListItem
                                key={msg.messageId}
                                className={`message-item ${msg.sender.toLowerCase().includes('officer') || msg.sender.toLowerCase().includes('system') ? 'officer' : 'customer'}`}
                            >
                                <Avatar sx={{ bgcolor: (msg.sender.toLowerCase().includes('officer') || msg.sender.toLowerCase().includes('system')) ? 'primary.main' : 'secondary.main', width: 28, height: 28, mr: 1, fontSize: '0.9rem' }}>
                                    {msg.sender.toLowerCase().includes('officer') ? 'O' : (msg.sender.toLowerCase().includes('system') ? 'S' : 'C')}
                                </Avatar>
                                <ListItemText
                                    primary={msg.text}
                                    secondary={`${new Date(msg.timestamp).toLocaleTimeString()} - ${msg.sender}`}
                                    sx={{
                                        '& .MuiListItemText-primary': {
                                            fontWeight: (msg.sender.toLowerCase().includes('officer') || msg.sender.toLowerCase().includes('system')) ? 'bold' : 'normal',
                                            color: (msg.sender.toLowerCase().includes('officer') || msg.sender.toLowerCase().includes('system')) ? 'primary.dark' : 'text.primary',
                                        },
                                        '& .MuiListItemText-secondary': {
                                            fontSize: '0.7rem',
                                            color: 'text.secondary',
                                        },
                                    }}
                                />
                            </ListItem>
                        ))}
                        <div ref={messagesEndRef} />
                    </List>
                    {isSubmittingMessage && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
                            <CircularProgress size={20} />
                        </Box>
                    )}
                </Box>
                <Divider />
                <Box className="query-chatbot-input">
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder={isMessageInputDisabled ? "Please wait..." : "Type your message here..."}
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && messageInput.trim() !== '' && !isMessageInputDisabled) {
                                handleSendMessage();
                            }
                        }}
                        disabled={isMessageInputDisabled}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleSendMessage}
                                        color="primary"
                                        disabled={messageInput.trim() === '' || isMessageInputDisabled}
                                    >
                                        <SendIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, width: '100%' }}>
                        {currentQuerySession && (
                            <Typography variant="caption" color="text.secondary">
                                Query Session Status: <strong>{getStatusLabel(currentQuerySession.status)}</strong>
                            </Typography>
                        )}
                        {/* The "Query Accepted" button is now more strictly controlled */}
                        {currentQuerySession && !isQueryAcceptedButtonDisabled && (
                            <Button
                                variant="contained"
                                color="success"
                                startIcon={<CheckCircleIcon />}
                                onClick={handleQueryAccepted}
                                disabled={isQueryAcceptedButtonDisabled}
                                sx={{ ml: 2 }}
                            >
                                {isAcceptingQuery ? <CircularProgress size={20} color="inherit" /> : 'Query Accepted'}
                            </Button>
                        )}
                        {isQueryAcceptedButtonDisabled && !isAcceptingQuery && !isSubmittingMessage && (
                            <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                                Query already closed or claim resolved.
                            </Typography>
                        )}
                    </Box>
                </Box>
            </Paper>

            {/* Success Snackbar */}
            <Snackbar
                open={!!successMessage}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    {successMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default QueryChatbotPage;