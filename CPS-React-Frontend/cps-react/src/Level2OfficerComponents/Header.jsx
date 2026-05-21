import React, { useState, useEffect } from 'react';
import {
    AppBar, Box, Toolbar, IconButton, Typography,
    Button, Tooltip, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, TextField, useTheme,
    Switch, FormControlLabel
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import desktopLogo from '../assets/logo.png';

export default function Header({ user, onLogout, onUserUpdate }) {
    const [editProfileOpen, setEditProfileOpen] = useState(false);
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editContactNumber, setEditContactNumber] = useState('');
    const [editIsAvailable, setEditIsAvailable] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');
    const theme = useTheme();
    const navigate = useNavigate();

    // Sync edit fields with user prop when dialog opens
    useEffect(() => {
        if (editProfileOpen && user) {
            setEditName(user.name || '');
            setEditEmail(user.email || '');
            setEditContactNumber(user.contact_number || '');
            setEditIsAvailable(user.isAvailable ?? false);
        }
    }, [editProfileOpen, user]);

    // Tooltip: show Edit Profile and Logout
    const profileTooltip = (
        <Box
            sx={{
                p: 2,
                minWidth: 240,
                background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                borderRadius: 2,
                boxShadow: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Avatar
                alt={user.name || user.email}
                src={
                    user.image ||
                    ('https://ui-avatars.com/api/?name=' +
                        encodeURIComponent(user.name || user.email) +
                        '&background=1976d2&color=fff')
                }
                sx={{ width: 64, height: 64, mb: 1.5, boxShadow: 2 }}
            />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2', mb: 0.5 }}>
                {user.name || "No Name"}
            </Typography>
            <Typography variant="body2" sx={{ color: '#333', mb: 0.5 }}>
                <strong>Email:</strong> {user.email}
            </Typography>
            <Typography variant="body2" sx={{ color: '#333', mb: 0.5 }}>
                <strong>Contact:</strong> {user.contact_number || "N/A"}
            </Typography>
            <Typography variant="body2" sx={{ color: '#333', mb: 0.5 }}>
                <strong>ID:</strong> {user.id}
            </Typography>
            <Typography
                variant="body2"
                sx={{
                    color: user.isAvailable ? 'green' : 'red',
                    fontWeight: 600,
                    mb: 1,
                }}
            >
                <strong>Available:</strong> {user.isAvailable ? "Yes" : "No"}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => setEditProfileOpen(true)}
                    sx={{ fontWeight: 600, borderRadius: 2, px: 2 }}
                >
                    Edit Profile
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={onLogout}
                    sx={{ fontWeight: 600, borderRadius: 2, px: 2 }}
                >
                    Logout
                </Button>
            </Box>
        </Box>
    );

    // Profile edit dialog logic
    const handleProfileSave = async () => {
        setSaving(true);
        setSaveError('');
        try {
            const response = await axios.patch(
                `http://localhost:9090/level1Officers/${user.id}`,
                {
                    name: editName,
                    email: editEmail,
                    contact_number: editContactNumber,
                    isAvailable: editIsAvailable,
                },
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            setEditProfileOpen(false);
            if (onUserUpdate) {
                // Merge PATCH response with current user for immediate UI update
                onUserUpdate({ ...user, ...response.data });
            }
        } catch (err) {
            setSaveError('Failed to update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <AppBar position="fixed" elevation={4}>
                <Toolbar disableGutters>
                    {/* Logo */}
                    <Box
                        sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', position: 'absolute', left: 0, zIndex: 2, height: '100%' }}
                        onClick={() => navigate('/')}
                    >
                        <img src={desktopLogo} alt="Health Insurance Management System Logo" style={{ height: 40, marginLeft: 16 }} />
                    </Box>

                    {/* App Title */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexGrow: 1,
                            position: 'absolute',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 'auto',
                            height: '100%',
                            zIndex: 1,
                        }}
                    >
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="/"
                            sx={{ letterSpacing: '.15rem', display: { xs: 'none', md: 'flex' }, color: "#fff", textDecoration: "none" }}
                        >
                            HEALTH INSURANCE MANAGEMENT SYSTEM
                        </Typography>
                    </Box>

                    {/* User Avatar and Tooltip */}
                    <Box
                        sx={{
                            flexGrow: 0,
                            position: 'absolute',
                            right: '50px',
                            zIndex: 3,
                            display: 'flex',
                            alignItems: 'center',
                            height: '100%',
                        }}
                    >
                        <Tooltip
                            title={user ? profileTooltip : "No user"}
                            placement="bottom-end"
                            arrow
                        >
                            <IconButton sx={{ p: 0 }}>
                                <Avatar
                                    alt={user?.name || user?.email || "User"}
                                    src={
                                        user?.image ||
                                        ('https://ui-avatars.com/api/?name=' +
                                            encodeURIComponent(user?.name || user?.email || "User") +
                                            '&background=1976d2&color=fff')
                                    }
                                />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Profile Edit Dialog */}
            <Dialog open={editProfileOpen} onClose={() => setEditProfileOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Edit Profile</Typography>
                </DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Name"
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            fullWidth
                            disabled={saving}
                        />
                        <TextField
                            label="Email"
                            value={editEmail}
                            onChange={e => setEditEmail(e.target.value)}
                            fullWidth
                            disabled={saving}
                        />
                        <TextField
                            label="Contact Number"
                            value={editContactNumber}
                            onChange={e => setEditContactNumber(e.target.value)}
                            fullWidth
                            disabled={saving}
                        />
                        <TextField
                            label="User ID"
                            value={user?.id}
                            disabled
                            fullWidth
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={editIsAvailable}
                                    onChange={e => setEditIsAvailable(e.target.checked)}
                                    disabled={saving}
                                    sx={{
                                        '& .MuiSwitch-switchBase.Mui-checked': {
                                            color: 'green',
                                        },
                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                            backgroundColor: 'green',
                                        },
                                        '& .MuiSwitch-switchBase': {
                                            color: 'red',
                                        },
                                        '& .MuiSwitch-switchBase + .MuiSwitch-track': {
                                            backgroundColor: '#ccc',
                                        },
                                    }}
                                />
                            }
                            label={
                                <span style={{ color: editIsAvailable ? 'green' : 'red', fontWeight: 600 }}>
                                    {editIsAvailable ? 'Available (Yes)' : 'Available (No)'}
                                </span>
                            }
                        />
                        {saveError && (
                            <Typography color="error" variant="body2">{saveError}</Typography>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditProfileOpen(false)} variant="outlined" disabled={saving}>
                        Cancel
                    </Button>
                    <Button onClick={handleProfileSave} variant="contained" color="primary" disabled={saving}>
                        {saving ? "Saving..." : "Save"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
