import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Divider,
} from "@mui/material";

function LeaveNotification() {
  const [leaveRequests, setLeaveRequests] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    const fetchRequests = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/leave/request/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setLeaveRequests(data);
        }
      } catch (error) {
        console.error("Error fetching leave requests:", error);
      }
    };

    fetchRequests();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(`http://127.0.0.1:8000/leave/request/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setLeaveRequests((prev) =>
          prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

 const pendingRequests = leaveRequests.filter(req => req.status?.toLowerCase() === "pending");

if (pendingRequests.length === 0) {
  return (
    <Box sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h6" color="text.secondary">
        No pending leave requests.
      </Typography>
    </Box>
  );
}

  return (
<Box
  sx={{
    display: "flex",
    flexDirection: "column",
    gap: 3,
    p: 2,
    backgroundColor: "#121212", // 🔥 Dark background for whole section
    minHeight: "100vh", // Full page height (optional)
  }}
>
  {leaveRequests
    .filter((req) => req.status?.toLowerCase() === "pending")
    .map((req) => (
      <Paper
        key={req.id}
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 2,
          backgroundColor: "#1e1e1e", // Card background
          color: "#ffffff", // White text
        }}
      >
        {/* Username and leave type */}
        <Typography variant="body1" sx={{ mb: 1 }}>
          <b style={{ color: "#FFA500" }}>{req.username}</b> requested{" "}
          <b style={{ color: "#FFA500" }}>{req.leave_type}</b> leave
        </Typography>

        {/* Dates */}
        <Typography variant="body2" sx={{ mb: 1, color: "#CCCCCC" }}>
          {req.start_date} to {req.end_date}
        </Typography>

        {/* Status Chip */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Typography>Status:</Typography>
          <Chip label={req.status} color="warning" size="small" />
        </Box>

        {/* Buttons */}
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            onClick={() => handleStatusUpdate(req.id, "Approved")}
            sx={{
              backgroundColor: "#28a745", // Green
              color: "#fff",
              textTransform: "none",
              fontWeight: 600,
              ":hover": {
                backgroundColor: "#1e7e34",
              },
            }}
          >
            Approve
          </Button>
          <Button
            variant="contained"
            onClick={() => handleStatusUpdate(req.id, "Rejected")}
            sx={{
              backgroundColor: "#dc3545", // Red
              color: "#fff",
              textTransform: "none",
              fontWeight: 600,
              ":hover": {
                backgroundColor: "#b52a37",
              },
            }}
          >
            Reject
          </Button>
        </Box>
      </Paper>
    ))}
</Box>
  );
}

export default LeaveNotification;