import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  Paper,
  Divider,
  Chip,
} from "@mui/material";
import { useForm } from "react-hook-form";

function LeaveRequest() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [leaveRequests, setLeaveRequests] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const handleData = (data) => {
    const LeaveRequestAPI = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const response = await fetch("http://127.0.0.1:8000/leave/request/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();
        if (response.ok) {
          alert(result.message || "Leave Request Submitted");
          reset();
          fetchRequests();
        } else {
          alert("Error: " + JSON.stringify(result));
        }
      } catch (error) {
        alert("Network Error: " + error.message);
      }
    };

    LeaveRequestAPI();
  };

  const fetchRequests = async () => {
    const token = localStorage.getItem("access_token");
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

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <Box
      sx={{
        px: { xs: 2, md: 4 },
        py: 4,
        backgroundColor: "#000",
        minHeight: "100vh",
        color: "#fff",
      }}
    >
      {/* Form Section */}
      <Paper
        elevation={3}
        sx={{
          maxWidth: 700,
          mx: "auto",
          p: 4,
          borderRadius: 3,
          backgroundColor: "#1c1c1c",
        }}
      >
        <Typography
          variant="h5"
          sx={{ textAlign: "center", mb: 4, fontWeight: 600, color: "#FFA726" }}
        >
          New Leave Request
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(handleData)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <TextField
            select
            label="Leave Type"
            fullWidth
            variant="outlined"
            {...register("leave_type", { required: "Leave Type required" })}
            helperText={errors.leave_type?.message}
            error={!!errors.leave_type}
            sx={{
              backgroundColor: "#2b2b2b",
              input: { color: "#fff" },
              label: { color: "#aaa" },
              "& .MuiSelect-select": { color: "white" },
             "& .MuiOutlinedInput-root": {
                  fieldset: { borderColor: "#FFB74D" },
                  "&:hover fieldset": { borderColor: "#FFA726" },
                  "&.Mui-focused fieldset": { borderColor: "#FFA726" },
                },
            }}
          >
            <MenuItem value="Vacation">Vacation</MenuItem>
            <MenuItem value="Sick">Sick</MenuItem>
            <MenuItem value="Casual">Casual</MenuItem>
          </TextField>

          <TextField
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            {...register("start_date", { required: "Start date required" })}
            error={!!errors.start_date}
            helperText={errors.start_date?.message}
            fullWidth
            sx={{
              backgroundColor: "#2b2b2b",
              input: { color: "#fff" },
              label: { color: "#aaa" },
              "& .MuiOutlinedInput-root": {
                  fieldset: { borderColor: "#FFB74D" },
                  "&:hover fieldset": { borderColor: "#FFA726" },
                  "&.Mui-focused fieldset": { borderColor: "#FFA726" },
                },
            }}
          />

          <TextField
            label="End Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            {...register("end_date", { required: "End date required" })}
            error={!!errors.end_date}
            helperText={errors.end_date?.message}
            fullWidth
            className="md:col-span-2"
            sx={{
              backgroundColor: "#2b2b2b",
              input: { color: "#fff" },
              label: { color: "#aaa" },
              "& .MuiOutlinedInput-root": {
                  fieldset: { borderColor: "#FFB74D" },
                  "&:hover fieldset": { borderColor: "#FFA726" },
                  "&.Mui-focused fieldset": { borderColor: "#FFA726" },
                },
            }}
          />

          <TextField
            label="Reason"
            placeholder="Reason for leave"
            multiline
            rows={3}
            {...register("reason", { required: "Reason required" })}
            error={!!errors.reason}
            helperText={errors.reason?.message}
            fullWidth
            className="md:col-span-2"
            sx={{
              backgroundColor: "#2b2b2b",
              input: { color: "#fff" },
              label: { color: "#aaa" },
              textarea: { color: "white" },
              "& .MuiOutlinedInput-root": {
                  fieldset: { borderColor: "#FFB74D" },
                  "&:hover fieldset": { borderColor: "#FFA726" },
                  "&.Mui-focused fieldset": { borderColor: "#FFA726" },
                },
            }}
          />

          <Box className="flex justify-end gap-4 md:col-span-2">
            <Button
              variant="outlined"
              onClick={() => reset()}
              sx={{
                mt: 2,
                textTransform: "none",
                borderColor: "#FFA726",
                color: "#FFA726",
                fontWeight: "bold",
                ":hover": {
                  backgroundColor: "#2e2e2e",
                  borderColor: "#ff9800",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                mt: 2,
                backgroundColor: "#FFA726",
                textTransform: "none",
                fontWeight: "bold",
                ":hover": { backgroundColor: "#ff9800" },
              }}
            >
              Submit Request
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Divider */}
      <Divider sx={{ my: 6, backgroundColor: "#333" }} />

      {/* Leave Requests Section */}
      <Typography
        variant="h6"
        sx={{ mb: 3, fontWeight: 600, color: "#FFA726" }}
      >
        Submitted Leave Requests
      </Typography>

      {leaveRequests.length === 0 ? (
        <Typography>No leave requests found.</Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {(showAll ? leaveRequests : leaveRequests.slice(0, 5)).map((req) => {
            const statusColor =
              req.status?.toLowerCase() === "approved"
                ? "success"
                : req.status?.toLowerCase() === "rejected"
                ? "error"
                : "warning";

            return (
              <Paper
                key={req.id}
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: "#1c1c1c",
                  color: "#fff",
                }}
              >
                <Typography>
                  <b style={{ color: "#FFA726" }}>{req.username}</b> requested{" "}
                  <b>{req.leave_type}</b> leave
                </Typography>
                <Typography sx={{ mt: 0.5 }}>
                  {req.start_date} to {req.end_date}
                </Typography>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
                >
                  <Typography>Status:</Typography>
                  <Chip label={req.status} color={statusColor} size="small" />
                </Box>
              </Paper>
            );
          })}

          {/* Show More / Less Button */}
          {leaveRequests.length > 5 && (
            <Box textAlign="center" mt={2}>
              <Button
                onClick={() => setShowAll((prev) => !prev)}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  color: "#FFA726",
                  ":hover": { backgroundColor: "#2e2e2e" },
                }}
              >
                {showAll ? "Show Less" : "Show All"}
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}

export default LeaveRequest;
