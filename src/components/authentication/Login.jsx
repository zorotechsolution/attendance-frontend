/** @jsxImportSource @emotion/react */
import React from "react";
import.meta.env.VITE_API_URL
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { keyframes, css } from "@emotion/react";

// 🔁 Rainbow scroll animation
const scroll = keyframes`
  0% { transform: translateX(50%); }
  100% { transform: translateX(-100%); }
`;

function Login() {
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width:768px)");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handledata = async (data) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        localStorage.setItem("access_token", result.access);
        localStorage.setItem("refresh_token", result.refresh);
        navigate("/dashboard");
      } else {
        alert(result.message || "Login failed.");
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        backgroundColor: "#000",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      
      <Typography
  css={css`
    animation: ${scroll} 18s linear infinite;
    animation-delay: 0s;

  `}
   sx={{
    position: "absolute",
    top: "25%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "20rem", 
    fontWeight: 800,
    color: "#ffffff20", // very transparent white/grey
    zIndex: 0,
    whiteSpace: "nowrap",
    userSelect: "none",
    letterSpacing: "10px",
    willChange: "transform",
  }}
>
  Zoro-Tech 
</Typography>

      {/* 🔲 Login Box */}
      <Box
        component="form"
        onSubmit={handleSubmit(handledata)}
        sx={{ zIndex: 2, p: 3, width: "90%", maxWidth: 400 }}
      >
        <Paper
          elevation={10}
          sx={{
            p: 4,
            backgroundColor: "rgba(0,0,0,0.75)",
            color: "#fff",
            borderRadius: "16px",
            backdropFilter: "blur(8px)",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "#FFA726",
              fontWeight: "bold",
              mb: 3,
              textAlign: "center",
            }}
          >
            Login
          </Typography>

          <TextField
            label="Student Id"
            {...register("studentid", { required: "Student Id is required" })}
            error={!!errors.studentid}
            helperText={errors.studentid?.message}
            fullWidth
            sx={{
              mb: 2,
              input: { color: "#fff" },
              label: { color: "#ccc" },
              "& .MuiOutlinedInput-root": {
                fieldset: { borderColor: "#FFB74D" },
                "&:hover fieldset": { borderColor: "#FFA726" },
                "&.Mui-focused fieldset": { borderColor: "#FFA726" },
              },
            }}
            InputLabelProps={{
              sx: { "&.Mui-focused": { color: "#FFA726" } },
            }}
          />

          <TextField
            label="Password"
            type="password"
            {...register("password", { required: "Password is required" })}
            error={!!errors.password}
            helperText={errors.password?.message}
            fullWidth
            sx={{
              mb: 3,
              input: { color: "#fff" },
              label: { color: "#ccc" },
              "& .MuiOutlinedInput-root": {
                fieldset: { borderColor: "#FFB74D" },
                "&:hover fieldset": { borderColor: "#FFA726" },
                "&.Mui-focused fieldset": { borderColor: "#FFA726" },
              },
            }}
            InputLabelProps={{
              sx: { "&.Mui-focused": { color: "#FFA726" } },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: "#FFA726",
              fontWeight: "bold",
              color: "#000",
              "&:hover": {
                backgroundColor: "#FB8C00",
              },
            }}
          >
            Login
          </Button>
 {/* ➖ Divider */}
            <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
              <Box flex={1} height="1px" bgcolor="#888" />
              <Typography mx={1} fontWeight="medium" color="#aaa">
                or
              </Typography>
              <Box flex={1} height="1px" bgcolor="#888" />
            </Box>
          <Button
            onClick={() => navigate("/signup")}
            variant="outlined"
            fullWidth
           sx={{
                textTransform: "none",
                borderColor: "#FFA726",
                color: "#FFA726",
                fontWeight: "bold",
                ":hover": {
                  backgroundColor: "rgba(255, 152, 0, 0.1)",
                  borderColor: "#fff",
                  color: "#fff",
                  boxShadow: "0 0 10px #FFA726, 0 0 20px #FFA726",
                },
              }}
          >
            Register
          </Button>
        </Paper>
      </Box>
    </Box>
  );
}

export default Login;