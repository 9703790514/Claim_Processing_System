import React, { useEffect, useState, useMemo } from "react";
import {
  Typography,
  Box,
  Paper,
  Grid,
  Container,
  Divider,
  Button,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ClaimStatsPage.css"; // Your CSS file

function ClaimStatsPage() {
  const navigate = useNavigate();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClaims = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("http://localhost:9090/claims/");
        setClaims(response.data);
      } catch (err) {
        console.error("Error fetching claims data:", err);
        setError(
          "Failed to load claims data. Please ensure the JSON server is running and accessible at http://localhost:9090/claims/."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  const calculatedStats = useMemo(() => {
    if (!claims || claims.length === 0) {
      return {
        raised: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        settled: 0,
        total: 0,
      };
    }

    const stats = {
      raised: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      settled: 0,
      total: claims.length,
    };

    claims.forEach((claim) => {
      switch (claim.status) {
        case "status_raised":
          stats.raised++;
          break;
        case "status_pending":
          stats.pending++;
          break;
        case "status_approved":
          stats.approved++;
          break;
        case "status_rejected":
          stats.rejected++;
          break;
        case "status_settled":
          stats.settled++;
          break;
        default:
          console.warn(
            `Encountered unknown claim status: ${claim.status} for claim ID: ${claim.id}`
          );
          break;
      }
    });

    return stats;
  }, [claims]);

  if (loading) {
    return (
      <Container
        maxWidth="md"
        className="claim-stats-container"
        sx={{ textAlign: "center" }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "300px",
          }}
        >
          <CircularProgress size={40} sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Loading claim data...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" className="claim-stats-container">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/")}
          className="back-button"
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  if (!claims || claims.length === 0) {
    return (
      <Container maxWidth="md" className="claim-stats-container">
        <Typography variant="h6" color="text.secondary">
          No claims data found to calculate statistics.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/")}
          className="back-button"
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" className="claim-stats-container">
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        className="claim-stats-title"
      >
        Your Claim Statistics
      </Typography>
      <Divider className="claim-stats-divider" />

      <Grid container spacing={3} className="stat-cards-grid-container">
        {/* Total Claims */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} className="stat-card-paper stat-card-total">
            <Typography variant="body1" className="stat-card-label">
              Total Claims:
            </Typography>
            <Typography variant="h5" className="stat-card-value primary-color">
              {calculatedStats.total}
            </Typography>
          </Paper>
        </Grid>
        {/* Raised Claims */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} className="stat-card-paper stat-card-raised">
            <Typography variant="body1" className="stat-card-label">
              Raised:
            </Typography>
            <Typography
              variant="h5"
              className="stat-card-value secondary-text-color"
            >
              {calculatedStats.raised}
            </Typography>
          </Paper>
        </Grid>
        {/* Pending Claims */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} className="stat-card-paper stat-card-pending">
            <Typography variant="body1" className="stat-card-label">
              Pending:
            </Typography>
            <Typography variant="h5" className="stat-card-value warning-color">
              {calculatedStats.pending}
            </Typography>
          </Paper>
        </Grid>
        {/* Approved Claims */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} className="stat-card-paper stat-card-approved">
            <Typography variant="body1" className="stat-card-label">
              Approved:
            </Typography>
            <Typography variant="h5" className="stat-card-value success-color">
              {calculatedStats.approved}
            </Typography>
          </Paper>
        </Grid>
        {/* Rejected Claims */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} className="stat-card-paper stat-card-rejected">
            <Typography variant="body1" className="stat-card-label">
              Rejected:
            </Typography>
            <Typography variant="h5" className="stat-card-value error-color">
              {calculatedStats.rejected}
            </Typography>
          </Paper>
        </Grid>
        {/* Settled Claims */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} className="stat-card-paper stat-card-settled">
            <Typography variant="body1" className="stat-card-label">
              Settled:
            </Typography>
            <Typography variant="h5" className="stat-card-value info-color">
              {calculatedStats.settled}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="body2" className="data-updated-text">
        *Data updated as of{" "}
        {new Date().toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
        .
      </Typography>

      <Box className="back-button-box">
        <Button
          variant="contained"
          onClick={() => navigate("/")}
          className="back-button"
        >
          Back to Dashboard
        </Button>
      </Box>
    </Container>
  );
}

export default ClaimStatsPage;
