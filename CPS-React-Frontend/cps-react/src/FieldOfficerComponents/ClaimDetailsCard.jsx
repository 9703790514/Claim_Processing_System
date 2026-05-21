import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';

import '../index.css';

import imageDefault from '../assets/raised.png';
import imageRaised from '../assets/raised.png';
import imageApproved from '../assets/approved.png';
import imagePending from '../assets/image3.png';
import imageSettled from '../assets/success.png';
import imageRejected from '../assets/rejected.png';

function ClaimsCard({ title, description, image, statusFilter, onSelectStatus }) {
    return (
        <Card className="claims-card">
            <CardActionArea onClick={() => onSelectStatus(statusFilter)}>
                <CardMedia component="img" image={image} alt={title} className="claims-card-media" />
                <CardContent className="claims-card-content">
                    <Typography gutterBottom variant="h5" component="div">{title}</Typography>
                    <Typography variant="body2">{description}</Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

function ClaimDetailsCard({ allClaims, onSelectStatus }) {
    // Count claims by status
    const claimCounts = {
        status_raised: 0,
        status_pending: 0,
        status_approved: 0,
        status_settled: 0,
        status_rejected: 0,
        all: allClaims.length,
    };
    allClaims.forEach(claim => {
        if (claimCounts.hasOwnProperty(claim.status)) {
            claimCounts[claim.status]++;
        }
    });

    return (
        <div className="claims-card-container">
            <ClaimsCard
                title="Raised Claims"
                description={`You have ${claimCounts.status_raised} claims awaiting initial review.`}
                image={imageRaised}
                statusFilter="status_raised"
                onSelectStatus={onSelectStatus}
            />
            <ClaimsCard
                title="Pending Claims"
                description={`You have ${claimCounts.status_pending} claims under review or awaiting documentation.`}
                image={imagePending}
                statusFilter="status_pending"
                onSelectStatus={onSelectStatus}
            />
            <ClaimsCard
                title="Approved Claims"
                description={`You have ${claimCounts.status_approved} claims approved for settlement.`}
                image={imageApproved}
                statusFilter="status_approved"
                onSelectStatus={onSelectStatus}
            />
            <ClaimsCard
                title="Settled Claims"
                description={`You have ${claimCounts.status_settled} claims that have been settled.`}
                image={imageSettled}
                statusFilter="status_settled"
                onSelectStatus={onSelectStatus}
            />
            <ClaimsCard
                title="Rejected Claims"
                description={`You have ${claimCounts.status_rejected} claims that have been rejected.`}
                image={imageRejected}
                statusFilter="status_rejected"
                onSelectStatus={onSelectStatus}
            />
            <ClaimsCard
                title="All Claims"
                description={`You have a total of ${claimCounts.all} claims.`}
                image={imageDefault}
                statusFilter="all"
                onSelectStatus={onSelectStatus}
            />
        </div>
    );
}

export default ClaimDetailsCard;
