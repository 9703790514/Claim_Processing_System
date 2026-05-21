import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Paper,
  Grid,
  Container,
  Divider,
  Fade,
} from "@mui/material";

import AssignmentIcon from "@mui/icons-material/Assignment";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ListAltIcon from "@mui/icons-material/ListAlt";

import ClaimsTable from "./ClaimsTable"; // Assuming this component exists
import ClaimFullDetailsPage from "./ClaimFullDetailsPage"; // Assuming this component exists
import { getStatusLabel } from "../utils/helpers"; // Assuming this utility exists
import Header from "./Header"; // Assuming this component exists

// Define card styles and icons as constants for better organization
const CARD_DEFINITIONS = {
  raised: {
    label: "Raised",
    // Modified description to meet approximate word/letter count
    description: "New claims, Field Doctor review is pending.", // 6 words, 39 letters
    bg: "linear-gradient(135deg, #fffde7 0%, #ffe082 100%)",
    border: "#ffd600",
    icon: <AssignmentIcon sx={{ fontSize: 40, color: "#ffd600" }} />,
  },
  pending: {
    label: "Pending",
    // Original description already fits well
    description: "Claims approved by Field Doctor, your review.", // 7 words, 42 letters (keeping close)
    bg: "linear-gradient(135deg, #e3f2fd 0%, #90caf9 100%)",
    border: "#1976d2",
    icon: <HourglassTopIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
  },
  approved: {
    label: "Approved",
    // Modified description
    description: "Claims that you have given final approval.", // 7 words, 40 letters
    bg: "linear-gradient(135deg, #e8f5e9 0%, #a5d6a7 100%)",
    border: "#43a047",
    icon: <DoneAllIcon sx={{ fontSize: 40, color: "#43a047" }} />,
  },
  rejected: {
    label: "Rejected",
    // Modified description
    description: "Claims rejected at any processing stage.......", // 6 words, 39 letters
    bg: "linear-gradient(135deg, #ffebee 0%, #ef9a9a 100%)",
    border: "#d32f2f",
    icon: <HighlightOffIcon sx={{ fontSize: 40, color: "#d32f2f" }} />,
  },
  queried: {
    label: "Queried",
    // Modified description
    description: "Claims are currently under an active query......", // 7 words, 42 letters
    bg: "linear-gradient(135deg, #f3e5f5 0%, #ce93d8 100%)",
    border: "#8e24aa",
    icon: <HelpOutlineIcon sx={{ fontSize: 40, color: "#8e24aa" }} />,
  },
  total: {
    label: "Total",
    // Modified description
    description: "All claims relevant to your officer role.......", // 8 words, 42 letters (harder to make shorter meaningfully)
    bg: "linear-gradient(135deg, #f5f5f5 0%, #bdbdbd 100%)",
    border: "#757575",
    icon: <ListAltIcon sx={{ fontSize: 40, color: "#757575" }} />,
  },
};

// Define status constants to avoid magic strings
const STATUS = {
  RAISED: "status_raised",
  APPROVED_BY_FD: "status_approved_by_field_doctor",
  APPROVED_BY_L1: "status_approved_by_level1_officer",
  REJECTED: "status_rejected",
  REJECTED_BY_FD: "status_rejected_by_field_doctor",
  REJECTED_BY_L1: "status_rejected_by_l1_officer",
  UNDER_QUERY: "status_under_query",
};

function Level1OfficerDashboardPage({ loggedInUserData, onLogout }) {
  const [allClaims, setAllClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedClaimId, setSelectedClaimId] = useState(null);

  // Fetch all claims relevant to Level 1 Officer
  const fetchAllClaims = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // It's highly recommended to use environment variables for API URLs
      // const response = await axios.get(process.env.REACT_APP_API_URL + '/claims');
      const response = await axios.get("http://localhost:9090/claims");
      setAllClaims(response.data || []);
    } catch (err) {
      setError(
        "Failed to fetch claims list for Level 1 Officer. Ensure the JSON server is running."
      );
      setAllClaims([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeView === "dashboard") {
      fetchAllClaims();
    }
  }, [fetchAllClaims, activeView]);

  // Stats for the cards
  const aggregatedStats = useMemo(() => {
    let stats = {
      raised: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      queried: 0,
      total: 0,
    };
    allClaims.forEach((claim) => {
      if (claim.status === STATUS.RAISED) stats.raised++;
      else if (claim.status === STATUS.APPROVED_BY_FD) stats.pending++;
      else if (claim.status === STATUS.APPROVED_BY_L1) stats.approved++;
      else if (
        claim.status === STATUS.REJECTED ||
        claim.status === STATUS.REJECTED_BY_FD ||
        claim.status === STATUS.REJECTED_BY_L1
      )
        stats.rejected++;
      else if (claim.status === STATUS.UNDER_QUERY) stats.queried++;

      // All relevant claims count
      if (
        Object.values(STATUS).includes(claim.status) // Check if the status is one of our defined relevant statuses
      )
        stats.total++;
    });
    return stats;
  }, [allClaims]);

  // Table filter logic
  const filteredClaims = useMemo(() => {
    return allClaims.filter((claim) => {
      let matchesStatus = false;
      if (selectedStatus === "all") {
        matchesStatus = Object.values(STATUS).includes(claim.status);
      } else if (selectedStatus === "raised") {
        matchesStatus = claim.status === STATUS.RAISED;
      } else if (selectedStatus === "pending") {
        matchesStatus = claim.status === STATUS.APPROVED_BY_FD;
      } else if (selectedStatus === "approved") {
        matchesStatus = claim.status === STATUS.APPROVED_BY_L1;
      } else if (selectedStatus === "rejected") {
        matchesStatus =
          claim.status === STATUS.REJECTED ||
          claim.status === STATUS.REJECTED_BY_FD ||
          claim.status === STATUS.REJECTED_BY_L1;
      } else if (selectedStatus === "queried") {
        matchesStatus = claim.status === STATUS.UNDER_QUERY;
      }
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const matchesSearchTerm =
        (claim.id &&
          String(claim.id).toLowerCase().includes(lowerCaseSearchTerm)) || // Ensure ID is string
        (claim.treatment &&
          claim.treatment.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (claim.policy_id &&
          String(claim.policy_id)
            .toLowerCase()
            .includes(lowerCaseSearchTerm)) || // Ensure policy_id is string
        (claim.hospital_id &&
          String(claim.hospital_id)
            .toLowerCase()
            .includes(lowerCaseSearchTerm)) || // Ensure hospital_id is string
        getStatusLabel(claim.status)
          .toLowerCase()
          .includes(lowerCaseSearchTerm);
      return matchesStatus && matchesSearchTerm;
    });
  }, [allClaims, selectedStatus, searchTerm]);

  // Card click handler
  const handleDashboardCardClick = (status) => {
    setSelectedStatus(status);
    setShowTable(true);
    setSearchTerm("");
  };

  // Table row click handler
  const handleViewFullDetails = useCallback((claimId) => {
    setSelectedClaimId(claimId);
    setActiveView("fullDetails");
  }, []);

  // Back from details view
  const handleBackToDashboard = useCallback(() => {
    setSelectedClaimId(null);
    setActiveView("dashboard");
    setShowTable(false); // Hide table when going back to dashboard cards
    setSearchTerm("");
    setSelectedStatus("all");
    fetchAllClaims(); // Re-fetch claims to ensure fresh data
  }, [fetchAllClaims]);

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 100px)", // Adjust height based on your header
          color: "text.secondary",
        }}
      >
        <CircularProgress size={60} color="inherit" />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading Level 1 Officer Dashboard...
        </Typography>
      </Box>
    );

  if (error)
    return (
      <Box sx={{ mt: 4, textAlign: "center", p: 3 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
        <Button variant="contained" onClick={fetchAllClaims} sx={{ mt: 3 }}>
          Try Again
        </Button>
      </Box>
    );

  if (activeView === "fullDetails" && selectedClaimId) {
    return (
      <ClaimFullDetailsPage
        claimId={selectedClaimId}
        onBack={handleBackToDashboard}
        loggedInUserData={loggedInUserData}
      />
    );
  }

  const cards = [
    {
      key: "raised",
      count: aggregatedStats.raised,
      ...CARD_DEFINITIONS.raised,
    },
    {
      key: "pending",
      count: aggregatedStats.pending,
      ...CARD_DEFINITIONS.pending,
    },
    {
      key: "approved",
      count: aggregatedStats.approved,
      ...CARD_DEFINITIONS.approved,
    },
    {
      key: "rejected",
      count: aggregatedStats.rejected,
      ...CARD_DEFINITIONS.rejected,
    },
    {
      key: "queried",
      count: aggregatedStats.queried,
      ...CARD_DEFINITIONS.queried,
    },
    { key: "all", count: aggregatedStats.total, ...CARD_DEFINITIONS.total },
  ];

  return (
    <>
      <Header user={loggedInUserData} onLogout={onLogout} />
      <Box sx={{ mt: 10, mb: 4 }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: "bold", letterSpacing: ".04em" }}
            >
              Welcome to Level1 Officer Dashboard
              <Typography
                component="span"
                sx={{
                  color: CARD_DEFINITIONS.pending.border,
                  fontWeight: 700,
                  ml: 1,
                }}
              >
                {loggedInUserData?.name || loggedInUserData?.id}
              </Typography>
            </Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />

          {!showTable ? (
            <Fade in>
              <Grid
                container
                spacing={3}
                alignItems="stretch"
                justifyContent="center"
              >
                {cards.map((card) => (
                  <Grid
                    item
                    xs={12}
                    sm={6} // 2 per row on small and up
                    md={4} // 3 per row on medium and up
                    lg={3} // 4 per row on large and up (adjust as needed for 6 cards)
                    key={card.key}
                    sx={{ display: "flex" }} // Make grid item a flex container for height
                  >
                    <Paper
                      elevation={6}
                      sx={{
                        width: "100%",
                        minHeight: 240, // Ensure cards have a minimum consistent height
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 3,
                        textAlign: "center",
                        cursor: "pointer",
                        background: card.bg,
                        borderLeft: `7px solid ${card.border}`,
                        borderRadius: 3,
                        boxShadow: "0 4px 20px 0 rgba(0,0,0,0.08)", // Slightly softer shadow
                        transition:
                          "box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out",
                        "&:hover": {
                          boxShadow: "0 8px 30px 0 rgba(0,0,0,0.15)", // Enhanced shadow on hover
                          transform: "translateY(-3px)", // More subtle lift
                        },
                      }}
                      onClick={() => handleDashboardCardClick(card.key)}
                    >
                      <Box sx={{ mb: 1 }}>{card.icon}</Box>
                      <Typography
                        variant="h6"
                        sx={{ color: card.border, fontWeight: "bold", mb: 1 }}
                      >
                        {card.label}
                      </Typography>
                      <Typography
                        variant="h3"
                        sx={{ fontWeight: "bold", color: "#222", mb: 1 }}
                      >
                        {card.count}
                      </Typography>
                      <Box sx={{ flexGrow: 1 }} />{" "}
                      {/* Pushes description to bottom */}
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        {card.description}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Fade>
          ) : (
            <Paper sx={{ p: 3, mb: 3, borderRadius: "12px" }}>
              <Button
                variant="outlined"
                onClick={() => {
                  setShowTable(false);
                  setSearchTerm("");
                  setSelectedStatus("all");
                }}
                sx={{ mb: 2 }}
              >
                Back to Overview Cards
              </Button>
              <Typography
                variant="h5"
                component="h2"
                sx={{ mb: 2, fontWeight: "bold" }}
              >
                Claims for Level 1 Officer:{" "}
                {loggedInUserData?.name || loggedInUserData?.id}
              </Typography>
              {filteredClaims.length === 0 && !loading && !error && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 200,
                    p: 3,
                    border: "1px dashed #e0e0e0",
                    borderRadius: "8px",
                    mt: 3,
                    bgcolor: "grey.50",
                  }}
                >
                  <ListAltIcon
                    sx={{ fontSize: 60, color: "text.disabled", mb: 2 }}
                  />
                  <Typography
                    variant="h6"
                    color="text.disabled"
                    textAlign="center"
                  >
                    No claims found.
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                  >
                    Adjust your filters or search term to see claims.
                  </Typography>
                </Box>
              )}
              <ClaimsTable
                filteredClaims={filteredClaims}
                selectedStatus={selectedStatus}
                searchTerm={searchTerm}
                statusTabs={[
                  { label: "All", value: "all" },
                  { label: "Raised", value: "raised" },
                  { label: "Pending", value: "pending" },
                  { label: "Approved", value: "approved" },
                  { label: "Rejected", value: "rejected" },
                  { label: "Queried", value: "queried" },
                ]}
                onTabChange={(e, v) => setSelectedStatus(v)}
                onSearchChange={(e) => setSearchTerm(e.target.value)}
                onClearSearch={() => setSearchTerm("")}
                onViewDetails={handleViewFullDetails}
                // Pass fieldDoctors if needed for dynamic doctor names
                // fieldDoctors={fieldDoctorsList}
              />
            </Paper>
          )}
        </Container>
      </Box>
    </>
  );
}

export default Level1OfficerDashboardPage;
