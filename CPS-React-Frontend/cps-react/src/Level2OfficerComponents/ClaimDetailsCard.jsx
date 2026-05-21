// src/components/ClaimDetailsCard.jsx

import React from 'react';
import { Card, CardContent, CardActionArea, Box, Grid, Typography } from '@mui/material'; // Removed CardMedia as we'll use background-image
import PropTypes from 'prop-types';

import '../index.css';
import './ClaimsDashboard.css'; // Ensure this CSS file is updated as well

// ... (your image imports - these are now used in the cardData directly) ...
import imageDefault from '../assets/raised.png';
import imageRaised from '../assets/raised.png';
import imageApproved from '../assets/approved.png';
import imagePending from '../assets/image3.png';
import imageSettled from '../assets/success.png';
import imageRejected from '../assets/rejected.png';
//import imageQueried from '../assets/queried.png'; // Make sure this image exists

// Helper component for individual cards
function ClaimsCard({ title, description, image, statusFilter, count, onSelectStatus, className }) {
    return (
        <Card
            className={`claims-card ${className}`}
            sx={{
                height: 250, // Keep consistent height as requested earlier
                borderRadius: '12px',
                overflow: 'hidden', // Ensures image and overlay respect border radius
                position: 'relative', // Needed for absolute positioning of overlay
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                },
                // *** IMPORTANT: Use the image prop directly as background ***
                backgroundImage: `url(${image})`, // Use the image prop here
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: 'transparent', // Ensure no base color
                boxShadow: 'none', // Remove default Material-UI shadow
            }}
        >
            <CardActionArea onClick={() => onSelectStatus(statusFilter)} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Overlay for better text readability on top of images */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Semi-transparent dark overlay
                        borderRadius: 'inherit', // Inherit border radius from parent Card
                        zIndex: 0, // Ensure overlay is behind text content
                    }}
                />
                <CardContent
                    className="claims-card-content"
                    sx={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px',
                        position: 'relative', // Ensures text content is above overlay
                        zIndex: 1, // Ensure content is above overlay
                        color: '#FFFFFF', // Set text color to white for contrast over dark overlay
                    }}
                >
                    {/* We no longer need CardMedia for the main background image */}
                    {/* If you still want a small icon on top, you'd add a separate <img> tag here
                        <Box className="claims-card-icon-box" sx={{ flexShrink: 0, mb: 1 }}>
                            <img src={image} alt={title} style={{ width: '60px', height: '60px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} /> // Example for a white icon
                        </Box>
                    */}
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        {title}
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1, mb: 1 }}>
                        {count}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        {description}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

ClaimsCard.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    statusFilter: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    onSelectStatus: PropTypes.func.isRequired,
    className: PropTypes.string,
};


// Main ClaimDetailsCard component (only Grid item change needed here)
function ClaimDetailsCard({ allClaims, aggregatedStats, onSelectStatus }) {

    const cardData = [
        {
            title: "Total Claims",
            description: "Overall claims in the system.",
            image: imageDefault,
            statusFilter: "all",
            count: aggregatedStats.totalClaims,
            className: "card-type-total"
        },
        {
            title: "Raised Claims",
            description: "Claims newly submitted and awaiting review.",
            image: imageRaised,
            statusFilter: "status_raised",
            count: aggregatedStats.raised,
            className: "card-type-raised"
        },
        {
            title: "Pending Review",
            description: "Claims awaiting internal approval or additional info.",
            image: imagePending,
            statusFilter: "status_pending",
            count: aggregatedStats.pending,
            className: "card-type-pending"
        },
        {
            title: "Approved Claims",
            description: "Claims that have passed all verification steps.",
            image: imageApproved,
            statusFilter: "status_approved",
            count: aggregatedStats.approved,
            className: "card-type-approved"
        },
        {
            title: "Settled Claims",
            description: "Claims that have been successfully paid out.",
            image: imageSettled,
            statusFilter: "status_settled",
            count: aggregatedStats.settled,
            className: "card-type-settled"
        },
        {
            title: "Rejected Claims",
            description: "Claims that did not meet the approval criteria.",
            image: imageRejected,
            statusFilter: "rejected",
            count: aggregatedStats.rejected,
            className: "card-type-rejected"
        },
        {
            title: "Under Query",
            description: "Claims requiring more information or clarification.",
            image: imageRejected,
            statusFilter: "status_queried",
            count: aggregatedStats.queried,
            className: "card-type-queried"
        },
    ];

    return (
        <Box sx={{ mt: 2 }}> {/* Added outer Box for consistent top margin */}
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
                Claims Overview
            </Typography>
            <Grid container spacing={3} justifyContent="center">
                {cardData.map((card, index) => (
                    <Grid
                        item
                        xs={12} // 1 card per row on extra small screens
                        sm={6}  // 2 cards per row on small screens
                        md={6}  // 2 cards per row on medium screens and up
                        lg={6}
                        xl={6}
                        key={index}
                    >
                        <ClaimsCard
                            title={card.title}
                            description={card.description}
                            image={card.image}
                            statusFilter={card.statusFilter}
                            count={card.count}
                            onSelectStatus={onSelectStatus}
                            className={card.className}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

ClaimDetailsCard.propTypes = {
    allClaims: PropTypes.array.isRequired,
    aggregatedStats: PropTypes.object.isRequired,
    onSelectStatus: PropTypes.func.isRequired,
};

export default ClaimDetailsCard;