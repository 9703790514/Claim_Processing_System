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
    Divider,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import { getStatusLabel, formatDate, formatAmount } from '../utils/helpers';
import './ClaimsTable.css';

function ClaimsTable({
    filteredClaims,
    selectedStatus,
    searchTerm,
    statusTabs,
    onTabChange,
    onSearchChange,
    onClearSearch,
    onViewDetails,
}) {
    const showFieldDoctorColumn = selectedStatus === 'status_raised';

    return (
        <Box>
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
                placeholder="Search by Claim ID, Description, Status, Policy ID, or Hospital ID..."
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
            <Divider sx={{ my: 2 }} />
            {filteredClaims.length === 0 ? (
                <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', py: 5 }}>
                    No claims found with the selected status or search term.
                </Typography>
            ) : (
                <TableContainer className="MuiTableContainer-root">
                    <Table stickyHeader aria-label="claims table">
                        <TableHead className="MuiTableHead-root">
                            <TableRow>
                                <TableCell>Claim ID</TableCell>
                                <TableCell>Claim Date</TableCell>
                                <TableCell>Amount Claimed</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Policy ID</TableCell>
                                <TableCell>Hospital ID</TableCell>
                                {showFieldDoctorColumn && <TableCell>Field Doctor Assigned</TableCell>}
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredClaims.map((claim) => (
                                <TableRow key={claim.id} hover className="MuiTableRow-root">
                                    <TableCell>{claim.id}</TableCell>
                                    <TableCell>{formatDate(claim.claim_date)}</TableCell>
                                    <TableCell>{formatAmount(claim.total_amount_claimed)}</TableCell>
                                    <TableCell>
                                        <span className={`status-tag status-${claim.status?.replace('status_', '')}`}>
                                            {getStatusLabel(claim.status)}
                                        </span>
                                    </TableCell>
                                    <TableCell>{claim.policy_id}</TableCell>
                                    <TableCell>{claim.hospital_id}</TableCell>
                                    {showFieldDoctorColumn && (
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            {claim.field_doctor_id ? (
                                                <CheckCircleOutlineIcon color="success" />
                                            ) : (
                                                <HighlightOffIcon color="error" />
                                            )}
                                        </TableCell>
                                    )}
                                    <TableCell align="right">
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={() => onViewDetails(claim.id)}
                                        >
                                            View Full Details
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

export default ClaimsTable;
