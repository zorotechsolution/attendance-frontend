/** @jsxImportSource @emotion/react */
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { MenuItem } from "@mui/material";
import { keyframes, css } from "@emotion/react";

function Signup() {
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width:768px)");

  const scroll = keyframes`
    0% { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
  `;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const password = watch("password", "");

  const handledata = (data) => {
    const signupFunction = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/signup/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await response.json();
        if (response.ok && response.status === 201) {
          Swal.fire({
            icon: "success",
            title: "Signup Successful",
            text: "You can now log in!",
            confirmButtonColor: "#FFA726",
          }).then(() => {
            navigate("/");
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Signup Failed",
            text:
              result.message ||
              Object.values(result)[0][0] ||
              "Something went wrong",
            confirmButtonColor: "#d33",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Network Error",
          text: error.message,
          confirmButtonColor: "#d33",
        });
      }
    };

    signupFunction();
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
        overflow: "hidden", // 
      }}
    >
      {/*  Moving Background Text */}
      <Typography
        css={css`
          animation: ${scroll} 20s linear infinite;
          will-change: transform;
        `}
        sx={{
          position: "absolute",
          top: "25%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: isSmallScreen ? "6rem" : "20rem",
          fontWeight:1000 ,
          color: "#ffffff90", // very mild white
          zIndex: 0,
          whiteSpace: "nowrap",
          userSelect: "none",
          letterSpacing: "10px",
        }}
      >
        Zoro-Tech 
      </Typography>

      {/* 🔲 Overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(6px)",
          zIndex: 1,
        }}
      />

      {/* ✅ Signup Form */}
      <Box
        component="form"
        onSubmit={handleSubmit(handledata)}
        sx={{ zIndex: 2, p: 3, width: "90%", maxWidth: 450 }}
      >
        <Paper
          elevation={24}
          sx={{
            p: 5,
            borderRadius: "16px",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            color: "#fff",
            backdropFilter: "blur(8px)",
          }}
        >
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography
              variant="h5"
              sx={{
                color: "#FFA726",
                fontWeight: "bold",
                textAlign: "center",
                mb: 3,
              }}
            >
              Register New Student
            </Typography>

            {/* 🔤 Input Fields */}
            {[
              { label: "Full Name", name: "username" },
              { label: "Email", name: "email" },
              { label: "Student Id", name: "studentid" },
              { label: "Designation", name: "designation" },
              { label: "Mobile Number", name: "mobile" },
              { label: "Password", name: "password", type: "password" },
              {
                label: "Confirm Password",
                name: "confirmpassword",
                type: "password",
              },
            ].map(({ label, name, type = "text" }) => (
              <TextField
                key={name}
                label={label}
                variant="outlined"
                type={type}
                {...register(name, {
                  required: `${label} is required`,
                  validate:
                    name === "confirmpassword"
                      ? (value) =>
                          value === password || "Passwords do not match"
                      : name === "mobile"
                      ? (value) => {
                          if (!/^[6-9]\d{9}$/.test(value))
                            return "Enter valid 10-digit Indian mobile number";
                          if (/^(\d)\1+$/.test(value))
                            return "Invalid mobile number pattern";
                          return true;
                        }
                      : undefined,
                })}
                helperText={errors[name]?.message}
                error={!!errors[name]}
                fullWidth
                sx={{
                  mb: 2,
                  input: {
                    color: "#fff",
                    backgroundColor: "rgba(255,255,255,0.05)",
                  },
                  label: { color: "#ccc" },
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "rgba(255,255,255,0.05)",
                    fieldset: { borderColor: "#FFB74D" },
                    "&:hover fieldset": { borderColor: "#FFA726" },
                    "&.Mui-focused fieldset": { borderColor: "#FFA726" },
                  },
                }}
                InputLabelProps={{
                  sx: {
                    "&.Mui-focused": {
                      color: "#FFA726",
                    },
                  },
                }}
              />
            ))}

            {/* 🌐 Domain Field */}
            <TextField
              select
              label="Domain"
              variant="outlined"
              {...register("domain", { required: "Domain is required" })}
              helperText={errors.domain?.message}
              error={!!errors.domain}
              fullWidth
              sx={{
                mb: 2,
                input: {
                  color: "#fff",
                  backgroundColor: "rgba(255,255,255,0.05)",
                },
                "& .MuiSelect-select": {
                  color: "#fff",
                  backgroundColor: "rgba(255,255,255,0.05)",
                },
                label: { color: "#ccc" },
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgba(255,255,255,0.05)",
                  fieldset: { borderColor: "#FFB74D" },
                  "&:hover fieldset": { borderColor: "#FFA726" },
                  "&.Mui-focused fieldset": { borderColor: "#FFA726" },
                },
              }}
              InputLabelProps={{
                sx: {
                  "&.Mui-focused": {
                    color: "#FFA726",
                  },
                },
              }}
            >
              <MenuItem value="Internship">Internship</MenuItem>
              <MenuItem value="Course">Course</MenuItem>
            </TextField>

            {/* ✅ Register Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                backgroundColor: "#FF9800",
                color: "#000",
                fontWeight: "bold",
                boxShadow: "0 0 10px #FF9800, 0 0 20px #FF9800",
                "&:hover": {
                  backgroundColor: "#FB8C00",
                  boxShadow: "0 0 15px #FB8C00, 0 0 25px #FB8C00",
                },
              }}
            >
              Register
            </Button>

            {/* ➖ Divider */}
           {/* ➖ Divider */}
            <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
              <Box flex={1} height="1px" bgcolor="#888" />
              <Typography mx={1} fontWeight="medium" color="#aaa">
                or
              </Typography>
              <Box flex={1} height="1px" bgcolor="#888" />
            </Box>

            {/* 🔁 Login Redirect */}
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate("/")}
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
              Login
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default Signup;