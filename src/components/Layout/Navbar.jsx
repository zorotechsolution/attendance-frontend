import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";

function Navbar({ showSidebar, setShowSidebar }) {
  let navigate=useNavigate()
  const [username, setUsername] = useState(null);
  let logout=()=>{
    localStorage.removeItem("access_token")
    navigate('/')
  }

  useEffect(() => {
    const get_username = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const response = await fetch("http://127.0.0.1:8000/user/detail/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const data = await response.json();
          setUsername(data.username);
        } else if (response.status === 404) {
          alert("Profile not found");
        } else if (response.status === 401) {
          alert("Unauthorized - token invalid or expired");
        } else {
          alert("Something went wrong");
        }
      } catch (err) {
        alert(err.message);
      }
    };
    get_username();
  }, []);

  return (
    <Box
      sx={{
        height: "70px",
        width: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        boxShadow: "0 2px 10px rgba(255, 165, 0, 0.3)",
        zIndex: 50,
        borderBottom: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      {/* Hamburger icon */}
      <Box sx={{ display: { xs: "block", lg: "none" } }}>
        <IconButton onClick={() => setShowSidebar((prev) => !prev)}>
          <MenuIcon sx={{ fontSize: 28, color: "#FFA726" }} />
        </IconButton>
      </Box>

      {/* Logo center */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: 800,
          fontFamily: "monospace",
          color: "#FFA726",
          textAlign: "center",
          flex: 1,
          ml: { xs: "-28px", lg: 0 },
        }}
      >
        Zoro-Tech
      </Typography>

      {/* Right Side Icons */}
      <Box
        sx={{
          display: { xs: "none", lg: "flex" },
          alignItems: "center",
          gap: 3,
        }}
      >
        {/* Notifications */}
        <NotificationsNoneIcon sx={{ color: "#FFA726" }} />

        {/* Username and Avatar */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar sx={{ width: 30, height: 30, bgcolor: "#FFA726", color: "#000", fontWeight: "bold" }}>
            {username ? username.charAt(0).toUpperCase() : "U"}
          </Avatar>
          <Typography sx={{ color: "#fff", fontWeight: 500 }}>{username}</Typography>
        </Box>

        {/* Logout */}
        <LogoutIcon sx={{ color: "#FFA726", cursor: "pointer" }} onClick={logout} />
      </Box>
    </Box>
  );
}

export default Navbar;