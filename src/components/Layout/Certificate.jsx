import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Box, Paper, Divider } from "@mui/material";

function Certificate() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const res = await fetch("http://127.0.0.1:8000/student/certificate/", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (res.ok && data.is_completed) {
          setUser(data);
        } else {
          navigate("/dashboard");
        }
      } catch (err) {
        console.error("Error fetching certificate:", err);
        navigate("/dashboard");
      }
    };

    fetchUser();
  }, [navigate]);

  if (!user) return null;

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const [year, month, day] = isoDate.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
<Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f3e8ff",
        px: 2,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: "100%",
          maxWidth: 800,
          p: { xs: 4, sm: 6 },
          borderRadius: 4,
          textAlign: "center",
          position: "relative",
        }}
      >
        {/* Header */}
        <Typography
          variant="h4"
          fontWeight="bold"
          color="primary"
          sx={{ mb: 1 }}
        >
          🎓 Certificate of Completion
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 4 }}>
          This is proudly presented to
        </Typography>

        {/* Student Name */}
        <Typography variant="h5" fontWeight="bold" color="text.primary">
          {user.username}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          ({user.studentid})
        </Typography>

        {/* Program */}
        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
          for successfully completing the
        </Typography>
        <Typography
          variant="h6"
          color="success.main"
          fontWeight="bold"
          sx={{ mb: 3 }}
        >
          {user.domain} - {user.designation}
        </Typography>

        {/* Duration */}
        <Typography variant="body2" color="text.secondary">
          Duration:{" "}
          <Box component="span" fontWeight="bold">
            {formatDate(user.start_date)}
          </Box>{" "}
          to{" "}
          <Box component="span" fontWeight="bold">
            {formatDate(user.end_date)}
          </Box>
        </Typography>

        <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
          at{" "}
          <Box component="span" fontWeight="bold" color="primary.main">
            Zoro-Tech
          </Box>
        </Typography>

        {/* Footer */}
        <Divider sx={{ mt: 5, mb: 2 }} />
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            fontSize: "0.85rem",
            color: "text.secondary",
          }}
        >
          <Box>Certificate ID: {user.studentid}</Box>
          <Box>Issued on: {new Date().toLocaleDateString("en-GB")}</Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default Certificate;