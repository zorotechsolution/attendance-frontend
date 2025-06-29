import React, { useEffect, useState } from "react";
import.meta.env.VITE_API_URL
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { GoGoal } from "react-icons/go";
import { CiCalendar } from "react-icons/ci";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { SlBadge } from "react-icons/sl";
import "../../../src/App.css";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [username, setUsername] = useState({
     username: "",
  domain: "",
  designation: ""
  });
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [performence, setPerformence] = useState({
    current_streak: 0,
    monthly_attendance: 0,
    punctuality: 0,
    monthly_rank: 0,
    total_employees: 0,
  });

  const [stats, setStats] = useState({
    total_students: 0,
    internship_students: 0,
    course_students: 0,
    course_distribution: {},
  });

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/student/details`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const checkCompletionStatus = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/student/certificate/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (res.ok && data.is_completed && localStorage.getItem("is_staff") !== "true") {
          navigate("/certificate");
        }
      } catch (err) {
        console.error("Completion check failed:", err);
      }
    };
    checkCompletionStatus();
  }, []);

  useEffect(() => {
    const fetchPerformance = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/attendance/performence/metrics/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setPerformence(data);
        }
      } catch (error) {
        console.log("error fetching performance", error);
      }
    };
    fetchPerformance();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const getUsername = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/user/detail/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setUsername({
          username: data.username,
        domain: data.domain,
        designation: data.designation
        });
        }
        else alert(data.message || "User fetch failed");
      } catch (err) {
        alert(err.message);
      }
    };
    getUsername();
  }, []);

  const getStatus = async () => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/attendance/status/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setIsCheckedIn(data.checked_in && !data.checked_out);
      setCheckInTime(data.check_in_time);
    } catch (err) {
      console.error("Status error:", err);
    }
  };

  useEffect(() => {
    getStatus();
  }, []);

  const getAttendanceHistory = async () => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/attendance/history/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setAttendanceHistory(data);
    } catch (err) {
      console.error("History fetch error:", err);
    }
  };

  useEffect(() => {
    getAttendanceHistory();
  }, []);

  const handleCheckIn = async () => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/attendance/checkin/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setIsCheckedIn(true);
        setCheckInTime(data.check_in_time);
        await getAttendanceHistory();
        
      } else {
        alert(data.message || "Check-in failed.");
      }
    } catch (err) {
      alert("Check-in error: " + err.message);
    }
  };

  const handleCheckOut = async () => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/attendance/checkout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setIsCheckedIn(false);
        await getStatus();
        await getAttendanceHistory();
        
      } else {
        alert(data.message || "Check-out failed.");
      }
    } catch (err) {
      alert("Check-out error: " + err.message);
    }
  };

  const employeePerformance = [
    {
      label: "Current Streak",
      days: performence.current_streak,
      detail: "days in a row",
      icon: <GoGoal />,
      bgColor: "#2C2C2C",
      iconColor: "#FF8C00",
    },
    {
      label: "This Month",
      days: performence.monthly_attendance,
      detail: "days attended",
      icon: <CiCalendar />,
      bgColor: "#2C2C2C",
      iconColor: "#007BFF",
    },
    {
      label: "Punctuality",
      days: `${performence.punctuality} %`,
      detail: "on-time rate",
      icon: <IoMdCheckmarkCircleOutline />,
      bgColor: "#2C2C2C",
      iconColor: "#2ECC71",
    },
    {
      label: "Monthly Rank",
      days: performence.monthly_rank,
      detail: `out of ${performence.total_employees}`,
      icon: <SlBadge />,
      bgColor: "#2C2C2C",
      iconColor: "#D63384",
    },
  ];
  return (
    <Box sx={{ backgroundColor: "#000", minHeight: "100vh", color: "#fff", p: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: { xs: "grid", lg: "flex" },
          justifyContent: { xs: "center", lg: "space-between" },
          alignItems: "center",
          textAlign: { xs: "center" },
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight="bold" color="#FFA726">
            Welcome back, {username.username}!
          </Typography>
          <Typography fontSize={14} color="#aaa">
            {currentDateTime.toDateString()}
          </Typography>
        </Box>
        <Box>
          <Typography fontSize={20} fontWeight="bold">
            {currentDateTime.toLocaleTimeString()}
          </Typography>
          <Typography fontSize={14} color="#aaa" display="flex" alignItems="center" gap={0.5}>
            <LocationOnIcon fontSize="small" color="action" />
            Zoro-Tech, Ramanputhur
          </Typography>
        </Box>
      </Box>
<Box sx={{pb:2}}><Typography fontSize={14} color="#aaa">
    Domain: <b style={{ color: "#FFA726" }}>{username.domain}</b> | Designation: <b style={{ color: "#FFA726" }}>{username.designation}</b>
  </Typography></Box>
      {/* Check-In Card */}
      <Paper sx={{ backgroundColor: "#1c1c1c", color: "#fff", p: 4, textAlign: "center", mb: 4 }}>
        <AccessTimeIcon sx={{ fontSize: 45, color: "#FFA726", mb: 1 }} />
        {isCheckedIn ? (
          <>
            <Typography color="green">Checked In at {checkInTime?.slice(0, 5)}</Typography>
            <Button onClick={handleCheckOut} variant="contained" sx={{ mt: 2, backgroundColor: "#e53935" }}>
              Check Out
            </Button>
          </>
        ) : (
          <>
            <Typography>Ready to Check In</Typography>
            <Button onClick={handleCheckIn} variant="contained" sx={{ mt: 2, backgroundColor: "#FFA726" }}>
              Check In
            </Button>
          </>
        )}
      </Paper>

      {/* Performance Cards or Admin Stats */}
      {localStorage.getItem("is_staff") === "true" ? (
        <>
          <Typography variant="h5" fontWeight="bold" color="#FFA726" mb={3}>
            Admin Dashboard
          </Typography>
          <Box className="grid grid-cols-1 md:grid-cols-3 gap-4" sx={{ mb: 4 }}>
            <Paper sx={{ backgroundColor: "#1c1c1c", color: "#fff", p: 3 }}>
              <Typography>Total Students</Typography>
              <Typography fontSize={28}>{stats.total_students}</Typography>
            </Paper>
            <Paper sx={{ backgroundColor: "#1c1c1c", color: "#fff", p: 3 }}>
              <Typography>Internship</Typography>
              <Typography fontSize={28}>{stats.internship_students}</Typography>
            </Paper>
            <Paper sx={{ backgroundColor: "#1c1c1c", color: "#fff", p: 3 }}>
              <Typography>Courses</Typography>
              <Typography fontSize={28}>{stats.course_students}</Typography>
            </Paper>
          </Box>
        </>
      ) : (
        <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" sx={{ marginTop: 6 }}>
          {employeePerformance.map((data, id) => (
            <Paper key={id} sx={{ backgroundColor: "#1c1c1c", color: "#fff", p: 3 }}>
              <Box>
                <Typography>{data.label}</Typography>
                <Typography fontSize={24} color="#FFA726">
                  {data.days}
                </Typography>
                <Typography fontSize={13} color="#aaa">
                  {data.detail}
                </Typography>
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      {/* Attendance Table */}
      <Box mt={4}>
        <TableContainer
          component={Paper}
          sx={{ backgroundColor: "#1e1e1e", color: "#fff" }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "#fff" }}>Date</TableCell>
                <TableCell sx={{ color: "#fff" }}>Check In</TableCell>
                <TableCell sx={{ color: "#fff" }}>Check Out</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendanceHistory.map((record, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ color: "#fff" }}>{record.date}</TableCell>
                  <TableCell sx={{ color: "#fff" }}>{record.check_in_time?.slice(0, 5) || "—"}</TableCell>
                  <TableCell sx={{ color: "#fff" }}>{record.check_out_time?.slice(0, 5) || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default Dashboard;