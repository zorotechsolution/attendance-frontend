import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import.meta.env.VITE_API_URL

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  TextField,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function StudentList() {
  const [allStudents, setAllStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tabIndex, setTabIndex] = useState(0);
  const [editStudent, setEditStudent] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  useEffect(() => {
    const isAdmin = localStorage.getItem("is_staff") === "true";
    const fetchStudentDetails = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/all/student/details/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setAllStudents(data);
      } catch (err) {
        console.error("Error fetching students:", err);
      }
    };
    if (isAdmin) fetchStudentDetails();
  }, []);

  const handleEdit = (student) => {
    setEditStudent({ ...student });
    setOpenEditDialog(true);
  };

  const handleSaveEdit = async () => {
    const token = localStorage.getItem("access_token");
    const { id, username, studentid, domain, designation, mobile } = editStudent;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/student/update/delete/${id}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, studentid, domain, designation, mobile }),
        }
      );

      if (response.ok) {
        const updated = await response.json();
        setAllStudents((prev) =>
          prev.map((s) => (s.id === updated.data.id ? updated.data : s))
        );
        setOpenEditDialog(false);
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Student updated successfully.",
        });
      } else {
        const errData = await response.json();
        Swal.fire({
          icon: "error",
          title: "Update Failed!",
          text: errData?.detail || "Please check the values and try again.",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Server Error!",
        text: "Something went wrong while updating.",
      });
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("access_token");

    Swal.fire({
      title: "Are you sure?",
      text: "This student will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/student/update/delete/${id}/`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.status === 204) {
            setAllStudents((prev) => prev.filter((s) => s.id !== id));
            Swal.fire("Deleted!", "Student has been deleted.", "success");
          } else {
            Swal.fire("Failed!", "Could not delete the student.", "error");
          }
        } catch (err) {
          Swal.fire("Error!", "Something went wrong on server.", "error");
        }
      }
    });
  };

  const calculateRemainingDays = (student) => {
    const joinDate = new Date(student.start_date);
    let endDate;

    if (student.domain?.toLowerCase() === "internship") {
      endDate = new Date(joinDate);
      endDate.setDate(endDate.getDate() + 15);
    } else if (student.domain?.toLowerCase() === "course") {
      const designation = student.designation?.toLowerCase();
      const months = designation === "python" ? 6 : designation === "ui" ? 3 : designation === "ai" ? 5 : 3;
      endDate = new Date(joinDate);
      endDate.setMonth(endDate.getMonth() + months);
    } else {
      return "-";
    }

    const today = new Date();
    const diff = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
    return diff > 0 ? `${diff} days` : "Completed";
  };

  const formatDuration = (duration) => {
    if (!duration) return "-";
    try {
      const totalSeconds = duration.match(/\d+/g)?.reduce((acc, val) => acc + parseInt(val), 0);
      return totalSeconds ? `${totalSeconds} days` : "-";
    } catch {
      return "-";
    }
  };

  const filteredStudents = allStudents
    .filter((s) => {
      if (tabIndex === 1) return !s.is_completed;
      if (tabIndex === 2) return s.is_completed;
      return true;
    })
    .filter(
      (s) =>
        s.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.studentid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.designation?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <Box sx={{ pt: 2, px: 2, backgroundColor: "#121212", minHeight: "100vh" }}>
      <Typography variant="h6" fontWeight="bold" mb={2} color="#FFA500">
        Student List
      </Typography>

      <Tabs value={tabIndex} onChange={(e, newIndex) => setTabIndex(newIndex)} sx={{ mb: 2 }}>
        <Tab label="All Students" sx={{ color: "#FFA500" }} />
        <Tab label="Active Students" sx={{ color: "#28a745" }} />
        <Tab label="Completed Students" sx={{ color: "#00BFFF" }} />
      </Tabs>

      <TextField
        variant="outlined"
        fullWidth
        sx={{
          maxWidth: 400,
          mb: 3,
          input: { color: "#fff" },
          label: { color: "#FFA500" },
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#FFA500" },
            "&:hover fieldset": { borderColor: "#FF8C00" },
            "&.Mui-focused fieldset": { borderColor: "#FFA500" },
          },
        }}
        label="Search by name, ID, or designation"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <TableContainer component={Paper} elevation={6} sx={{ borderRadius: 3, backgroundColor: "#1E1E1E" }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#2C2C2C" }}>
            <TableRow>
              <TableCell sx={{ color: "#FFA500" }}><strong>Name</strong></TableCell>
              <TableCell sx={{ color: "#FFA500" }}><strong>Student ID</strong></TableCell>
              <TableCell sx={{ color: "#FFA500" }}><strong>Domain</strong></TableCell>
              <TableCell sx={{ color: "#FFA500" }}><strong>Designation</strong></TableCell>
              <TableCell sx={{ color: "#FFA500" }}><strong>Date of Join</strong></TableCell>
              <TableCell sx={{ color: "#FFA500" }}><strong>Duration</strong></TableCell>
              <TableCell sx={{ color: "#FFA500" }}><strong>Remaining Days</strong></TableCell>
              <TableCell sx={{ color: "#FFA500" }}><strong>Mobile</strong></TableCell>
              <TableCell sx={{ color: "#FFA500" }}><strong>Update</strong></TableCell>
              <TableCell sx={{ color: "#FFA500" }}><strong>Delete</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.map((s, index) => (
              <TableRow key={index} hover sx={{ '&:hover': { backgroundColor: '#2A2A2A' } }}>
                <TableCell sx={{ color: "#fff" }}>{s.username}</TableCell>
                <TableCell sx={{ color: "#fff" }}>{s.studentid}</TableCell>
                <TableCell sx={{ color: "#fff" }}>{s.domain}</TableCell>
                <TableCell sx={{ color: "#fff" }}>{s.designation}</TableCell>
                <TableCell sx={{ color: "#fff" }}>{s.start_date?.slice(0, 10)}</TableCell>
                <TableCell sx={{ color: "#fff" }}>{formatDuration(s.duration)}</TableCell>
                <TableCell sx={{ color: "#fff" }}>{calculateRemainingDays(s)}</TableCell>
                <TableCell sx={{ color: "#fff" }}>{s.mobile}</TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton sx={{ color: "#00BFFF" }} onClick={() => handleEdit(s)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip title="Delete">
                    <IconButton sx={{ color: "red" }} onClick={() => handleDelete(s.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Student</DialogTitle>
        <DialogContent>
          <TextField
            label="Student ID"
            fullWidth
            margin="dense"
            value={editStudent?.studentid || ""}
            onChange={(e) => setEditStudent({ ...editStudent, studentid: e.target.value })}
          />
          <TextField
            label="Username"
            fullWidth
            margin="dense"
            value={editStudent?.username || ""}
            onChange={(e) => setEditStudent({ ...editStudent, username: e.target.value })}
          />
          <TextField
            label="Domain"
            fullWidth
            margin="dense"
            value={editStudent?.domain || ""}
            onChange={(e) => setEditStudent({ ...editStudent, domain: e.target.value })}
          />
          <TextField
            label="Mobile"
            fullWidth
            margin="dense"
            value={editStudent?.mobile || ""}
            onChange={(e) => setEditStudent({ ...editStudent, mobile: e.target.value })}
          />
          <TextField
            label="Designation"
            fullWidth
            margin="dense"
            value={editStudent?.designation || ""}
            onChange={(e) => setEditStudent({ ...editStudent, designation: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="error">
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default StudentList;