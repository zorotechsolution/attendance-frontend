import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import GroupIcon from "@mui/icons-material/Group";
import { useNavigate } from "react-router-dom";
import.meta.env.VITE_API_URL

function Sidebar({ setShowSidebar }) {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    const fetchUserInfo = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/user/detail/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          localStorage.setItem("is_staff", data.is_staff);
          setIsAdmin(data.is_staff);
        }
      } catch (err) {
        console.error("User info fetch failed", err);
      }
    };

    fetchUserInfo();
  }, []);

  const sidebarItems = [
    { label: "Dashboard", icon: <DashboardIcon />, path: "" },
    { label: "Leave Requests", icon: <CalendarMonthIcon />, path: "leave-request" },
    ...(isAdmin ? [{ label: "Leave Notification", icon: <CalendarMonthIcon />, path: "leave-notification" }] : []),
    ...(isAdmin ? [{ label: "Student List", icon: <GroupIcon />, path: "studentlist" }] : []),
  ];

  return (
    <Box
      sx={{
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(8px)",
        padding: "20px",
        minHeight: "100%",
        width: "250px",
        position: { xs: "fixed", lg: "relative" },
        top: 0,
        left: 0,
        zIndex: 60,
        color: "#fff",
      }}
    >
      {/* Close button for mobile */}
      <Box sx={{ display: { xs: "flex", lg: "none" }, justifyContent: "flex-end", mb: 2 }}>
        <CloseIcon sx={{ color: "#FFA726", cursor: "pointer" }} onClick={() => setShowSidebar(false)} />
      </Box>

      {/* Sidebar Items */}
      {sidebarItems.map((item, index) => (
        <Box
          key={index}
          onClick={() => navigate(`/dashboard${item.path ? `/${item.path}` : ""}`)}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            padding: "12px 16px",
            borderRadius: "10px",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            color: "#FFA726",
            fontWeight: 500,
            cursor: "pointer",
            mt: 2,
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              backgroundColor: "#FFA726",
              color: "#000",
              boxShadow: "0 0 12px #FFA726",
              borderRight: "3px solid #000",
            },
          }}
        >
          {item.icon}
          <Typography>{item.label}</Typography>
        </Box>
      ))}
    </Box>
  );
}

export default Sidebar;