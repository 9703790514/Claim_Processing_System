import React, { useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Chip,
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Snackbar,
    TableSortLabel,
} from '@mui/material';
// import './FieldDoctors.css'; // Ensure this CSS file is correctly imported and applied globally or specifically.

/**
 * Helper function to generate a random city/place name.
 */
const getRandomPlace = () => {
    const places = [
        "Bengaluru", "Chennai", "Mumbai", "Delhi", "Hyderabad",
        "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Surat",
        "Lucknow", "Kanpur", "Nagpur", "Visakhapatnam", "Bhopal",
        "Patna", "Ludhiana", "Agra", "Nashik", "Madurai"
    ];
    return places[Math.floor(Math.random() * places.length)];
};

/**
 * FieldDoctors component allows Level 1 Officers to view and assign field doctors to a specific claim.
 * It fetches a list of available field doctors and the current claim's assigned doctor.
 *
 * @param {object} props - The component props.
 * @param {string} props.claimId - The ID of the claim to which a field doctor will be assigned.
 * @param {function} props.onAssignmentSuccess - Callback function to be called after a successful assignment.
 * @param {function} props.onBack - Callback function to navigate back to the previous view.
 */
function FieldDoctors({ claimId, onAssignmentSuccess, onBack }) {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentClaimFieldDoctorId, setCurrentClaimFieldDoctorId] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // State for Dialog (for errors/confirmations)
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogContent, setDialogContent] = useState('');

    // State for Snackbar (for less intrusive messages like "already assigned")
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info'); // 'success', 'error', 'info', 'warning'

    // State for sorting
    const [sortColumn, setSortColumn] = useState('distanceKm'); // Default sort by distance
    const [sortDirection, setSortDirection] = useState('asc'); // Default ascending

    /**
     * Fetches the list of field doctors and the current claim's details
     * to determine if a doctor is already assigned.
     * Also generates random 'placed' and 'distanceKm' data.
     */
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            setSuccessMessage(null);
            setCurrentClaimFieldDoctorId(null);

            if (!claimId) {
                setError("Claim ID is missing. Cannot assign a field doctor without a specific claim.");
                setLoading(false);
                return;
            }

            try {
                // Fetch list of field doctors
                const doctorsResponse = await axios.get('http://localhost:9090/fieldDoctors');
                const doctorsData = doctorsResponse.data || [];

                // Add random 'placed' and 'distanceKm' data to each doctor
                const doctorsWithRandomData = doctorsData.map(doctor => ({
                    ...doctor,
                    placed: getRandomPlace(),
                    // Generate random distance between 1.0 and 100.0 km
                    distanceKm: parseFloat((Math.random() * 99 + 1).toFixed(1))
                }));
                setDoctors(doctorsWithRandomData);

                // Fetch claim to get current assigned field doctor (if any)
                const claimResponse = await axios.get(`http://localhost:9090/claims/${claimId}`);
                if (claimResponse.data && claimResponse.data.field_doctor_id) {
                    setCurrentClaimFieldDoctorId(claimResponse.data.field_doctor_id);
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                if (err.response && err.response.status === 404) {
                    setError(`Claim with ID "${claimId}" not found. Please check the Claim ID.`);
                } else {
                    setError('Failed to load field doctors or claim details. Please ensure the JSON server is running.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [claimId]); // Re-fetch data if claimId changes

    /**
     * Handles sorting the table when a column header is clicked.
     * @param {string} columnId - The ID of the column to sort by.
     */
    const handleSort = useCallback((columnId) => {
        if (sortColumn === columnId) {
            setSortDirection(prevDir => (prevDir === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortColumn(columnId);
            setSortDirection('asc'); // Default to ascending when changing column
        }
    }, [sortColumn]);

    /**
     * Memoized sorted list of doctors. Re-calculates only when doctors data,
     * sortColumn, or sortDirection changes.
     */
    const sortedDoctors = useMemo(() => {
        if (doctors.length === 0 || !sortColumn) {
            return doctors;
        }

        return [...doctors].sort((a, b) => {
            const valueA = a[sortColumn];
            const valueB = b[sortColumn];

            let comparison = 0;
            if (typeof valueA === 'number' && typeof valueB === 'number') {
                comparison = valueA - valueB;
            } else if (typeof valueA === 'string' && typeof valueB === 'string') {
                comparison = valueA.localeCompare(valueB);
            }
            // Add more specific comparisons if other data types are used for sorting

            return sortDirection === 'asc' ? comparison : -comparison;
        });
    }, [doctors, sortColumn, sortDirection]);


    /**
     * Handles the assignment of a field doctor to the current claim.
     * Prevents re-assignment if a doctor is already linked.
     * @param {string} doctorId - The ID of the field doctor to assign.
     */
    const handleAssign = async (doctorId) => {
        if (!claimId) {
            setDialogTitle("Assignment Error");
            setDialogContent("No Claim ID available to assign a doctor.");
            setOpenDialog(true);
            return;
        }

        if (currentClaimFieldDoctorId !== null) {
            setSnackbarMessage(`A field doctor (ID: ${currentClaimFieldDoctorId}) is already assigned to Claim ${claimId}. Cannot assign another.`);
            setSnackbarSeverity('warning');
            setSnackbarOpen(true);
            setSuccessMessage(null); // Clear any previous success message
            return;
        }

        try {
            await axios.patch(`http://localhost:9090/claims/${claimId}`, {
                field_doctor_id: doctorId,
            });
            setCurrentClaimFieldDoctorId(doctorId);
            setSuccessMessage(`Field Doctor ${doctorId} successfully assigned to Claim ${claimId}!`);
            setError(null);
            // Call the callback to notify the parent component (ClaimFullDetailsPage) to refresh
            if (onAssignmentSuccess) {
                onAssignmentSuccess();
            }
        } catch (err) {
            console.error("Error assigning field doctor:", err);
            setDialogTitle("Assignment Failed");
            setDialogContent('Failed to assign field doctor. Please try again.');
            setOpenDialog(true);
            setSuccessMessage(null); // Clear any previous success message
        }
    };

    /**
     * Closes the Material-UI Dialog.
     */
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    /**
     * Closes the Material-UI Snackbar.
     * @param {object} event - The event object.
     * @param {string} reason - The reason the snackbar was closed.
     */
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    // Render loading state
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>
                    Loading field doctors and claim info...
                </Typography>
            </Box>
        );
    }

    // Render error state
    if (error) {
        return (
            <Box sx={{ textAlign: 'center', mt: 5, p: 3 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
                <Button variant="contained" onClick={onBack} sx={{ mt: 2 }}>
                    Go Back
                </Button>
            </Box>
        );
    }

    // Render no doctors found state
    if (doctors.length === 0) {
        return (
            <Typography variant="h6" sx={{ mt: 5, textAlign: 'center' }}>
                No field doctors found in the database.
            </Typography>
        );
    }

    const isFieldDoctorAlreadyAssigned = currentClaimFieldDoctorId !== null;

    return (
        // --- CHANGE HERE: Increase maxWidth or use a percentage ---
        <Box sx={{ maxWidth: '95%', margin: 'auto', mt: 5, p: 2 }}>
        {/* Or, for a fixed wider size: maxWidth: 1600, margin: 'auto', mt: 5, p: 2 */}
            <Typography
                variant="h4"
                gutterBottom
                sx={{ textAlign: 'center', mb: 3, color: '#1976d2', fontWeight: 'bold' }}
            >
                Assign Field Doctor to Claim: {claimId}
            </Typography>

            {successMessage && (
                <Alert severity="success" sx={{ mb: 3 }}>
                    {successMessage}
                </Alert>
            )}

            {isFieldDoctorAlreadyAssigned && (
                <Alert severity="info" sx={{ mb: 3 }}>
                    A field doctor (ID: <strong>{currentClaimFieldDoctorId}</strong>) is already assigned to this claim. You cannot assign another.
                </Alert>
            )}

            <TableContainer className="MuiTableContainer-root" component={Paper} elevation={3} sx={{ borderRadius: '8px', overflow: 'hidden' }}>
                <Table aria-label="field doctors table">
                    <TableHead className="MuiTableHead-root" sx={{ backgroundColor: '#e3f2fd' }}>
                        <TableRow>
                            <TableCell className="MuiTableCell-root" sx={{ fontWeight: 'bold', color: '#1976d2' }}>ID</TableCell>
                            <TableCell className="MuiTableCell-root" sx={{ fontWeight: 'bold', color: '#1976d2' }}>Name</TableCell>
                            <TableCell className="MuiTableCell-root" sx={{ fontWeight: 'bold', color: '#1976d2' }}>Contact</TableCell>
                            <TableCell className="MuiTableCell-root" sx={{ fontWeight: 'bold', color: '#1976d2' }}>Email</TableCell>
                            {/* NEW COLUMNS */}
                            <TableCell className="MuiTableCell-root" sx={{ fontWeight: 'bold', color: '#1976d2' }}>Placed</TableCell>
                            <TableCell
                                className="MuiTableCell-root"
                                sx={{ fontWeight: 'bold', color: '#1976d2' }}
                                sortDirection={sortColumn === 'distanceKm' ? sortDirection : false}
                            >
                                <TableSortLabel
                                    active={sortColumn === 'distanceKm'}
                                    direction={sortColumn === 'distanceKm' ? sortDirection : 'asc'}
                                    onClick={() => handleSort('distanceKm')}
                                >
                                    Distance in Km
                                </TableSortLabel>
                            </TableCell>
                            {/* END NEW COLUMNS */}
                            <TableCell className="MuiTableCell-root" sx={{ fontWeight: 'bold', color: '#1976d2' }}>Status</TableCell>
                            <TableCell className="MuiTableCell-root" align="right" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                                Action
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* Use sortedDoctors instead of doctors */}
                        {sortedDoctors.map((doctor) => (
                            <TableRow
                                key={doctor.id}
                                sx={{
                                    '&:nth-of-type(odd)': { backgroundColor: '#f5faff' },
                                    '&:hover': { backgroundColor: '#e0f2f7' },
                                }}
                            >
                                <TableCell className="MuiTableCell-root">{doctor.id}</TableCell>
                                <TableCell className="MuiTableCell-root">{doctor.name}</TableCell>
                                <TableCell className="MuiTableCell-root">{doctor.contact_number || 'N/A'}</TableCell>
                                <TableCell className="MuiTableCell-root">{doctor.email || 'N/A'}</TableCell>
                                {/* NEW DATA CELLS */}
                                <TableCell className="MuiTableCell-root">{doctor.placed}</TableCell>
                                <TableCell className="MuiTableCell-root">{doctor.distanceKm !== undefined ? `${doctor.distanceKm} km` : 'N/A'}</TableCell>
                                {/* END NEW DATA CELLS */}
                                <TableCell className="MuiTableCell-root">
                                    {doctor.id === currentClaimFieldDoctorId ? (
                                        <Chip label="Assigned to This Claim" color="info" size="small" variant="outlined" sx={{ fontWeight: 'bold' }} />
                                    ) : (
                                        <Chip label="Available for Assignment" color="success" size="small" variant="filled" />
                                    )}
                                </TableCell>
                                <TableCell className="MuiTableCell-root" align="right">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        onClick={() => handleAssign(doctor.id)}
                                        disabled={isFieldDoctorAlreadyAssigned}
                                        sx={{
                                            minWidth: '100px',
                                            backgroundColor: isFieldDoctorAlreadyAssigned ? '#90caf9' : '#1976d2',
                                            '&:hover': {
                                                backgroundColor: isFieldDoctorAlreadyAssigned ? '#90caf9' : '#1565c0',
                                            },
                                        }}
                                    >
                                        {doctor.id === currentClaimFieldDoctorId ? 'Assigned' : 'Assign'}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Button variant="contained" onClick={onBack}>
                    Back to Claim Details
                </Button>
            </Box>

            {/* General Purpose Dialog for Errors/Confirmations */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="dialog-title"
                aria-describedby="dialog-description"
            >
                <DialogTitle id="dialog-title">{dialogTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="dialog-description">
                        {dialogContent}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} autoFocus>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for less intrusive messages */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default FieldDoctors;