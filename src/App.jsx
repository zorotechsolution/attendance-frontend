import "./App.css";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Login from "./components/authentication/Login";
import Signup from "./components/authentication/Signup";
import DashboardLayout from "./components/Layout/DashboardLayout";
import Dashboard from "./components/Layout/Dashboard";
import LeaveRequest from "./components/Layout/LeaveRequest";
import LeaveNotification from "./components/Layout/LeaveNotification";
import StudentList from "./components/Layout/StudentList";
import Certificate from "./components/Layout/Certificate";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

function TokenWatcher() {
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const now = Date.now() / 1000;
          if (decoded.exp < now) {
            localStorage.clear();
            navigate("/");
          }
        } catch (err) {
          console.error("Token error:", err);
          localStorage.clear();
          navigate("/");
        }
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [navigate]);

  return null;
}

function App() {
  return (
    <Router>
      <TokenWatcher />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="leave-request" element={<LeaveRequest />} />
          <Route path="leave-notification" element={<LeaveNotification />} />
          <Route path="studentlist" element={<StudentList />} />
        </Route>
        <Route path="/certificate" element={<Certificate />} />
      </Routes>
    </Router>
  );
}

export default App;