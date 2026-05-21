import React from 'react';
import {
    Box,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    Tab,
    TextField,
    InputAdornment,
    IconButton,
    Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { getStatusLabel, formatDate, formatAmount } from '../utils/helpers';

function FieldDoctorClaimsTable({
    claims,
    selectedStatus,
    searchTerm,
    statusTabs,
    onTabChange,
    onSearchChange,
    onClearSearch,
    onViewDetails,
    // Optionally: loggedInUserData
}) {
    return (
        <Box sx={{ mt: 3 }}>
            <Tabs
                value={selectedStatus}
                onChange={onTabChange}
                aria-label="Claims status filter tabs"
                variant="scrollable"
                scrollButtons="auto"
                sx={{ mb: 2 }}
            >
                {statusTabs.map((tab) => (
                    <Tab key={tab.value} label={tab.label} value={tab.value} />
                ))}
            </Tabs>
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by Claim ID, Treatment, Policy ID, Hospital ID, or Field Doctor ID..."
                value={searchTerm}
                onChange={onSearchChange}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                    endAdornment: searchTerm && (
                        <InputAdornment position="end">
                            <IconButton onClick={onClearSearch} edge="end">
                                <ClearIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                sx={{ mb: 3 }}
            />
            {claims.length === 0 ? (
                <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', py: 5 }}>
                    No claims found matching the selected criteria.
                </Typography>
            ) : (
                <TableContainer component={Paper} elevation={3} sx={{ borderRadius: '8px', overflow: 'hidden' }}>
                    <Table stickyHeader aria-label="field doctor claims table">
                        <TableHead sx={{ backgroundColor: '#e3f2fd' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }}>Claim ID</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }}>Claim Date</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }}>Treatment</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }}>Amount Claimed</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }}>Hospital ID</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }}>Assigned Field Doctor</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', color: '#1976d2' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {claims.map((claim) => (
                                <TableRow
                                    key={claim.id}
                                    hover
                                    sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f5faff' }, '&:hover': { backgroundColor: '#e0f2f7' } }}
                                >
                                    <TableCell>{claim.id}</TableCell>
                                    <TableCell>{formatDate(claim.claim_date)}</TableCell>
                                    <TableCell>{claim.treatment || 'N/A'}</TableCell>
                                    <TableCell>{formatAmount(claim.total_amount_claimed)}</TableCell>
                                    <TableCell>
                                        <span className={`status-tag status-${claim.status?.replace('status_', '')}`}>
                                            {getStatusLabel(claim.status)}
                                        </span>
                                    </TableCell>
                                    <TableCell>{claim.hospital_id}</TableCell>
                                    <TableCell>{claim.field_doctor_id || 'Not Assigned'}</TableCell>
                                    <TableCell align="right">
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={() => onViewDetails(claim.id)}
                                        >
                                            View Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}

export default FieldDoctorClaimsTable;
