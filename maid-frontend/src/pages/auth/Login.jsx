import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  InputAdornment,
  Link,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { login } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    mobile: "",
    password: "",
  });

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login(loginData));
      navigate("/auth/otp");
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4, marginTop : "150px" }}>
      <Paper
        elevation={2}
        sx={{
          p: 0,
          borderRadius: 3,
          background: "linear-gradient(to bottom, #f8f9fa, #ffffff)",
          boxShadow: "0 8px 32px rgba(31, 38, 135, 0.1)",
          display: "flex",
          overflow: "hidden",
        }}
      >
        {/* Left Side - Image */}
        <Box
          sx={{
            width: "50%",
            background: "linear-gradient(135deg, #FFD54F 0%, #FBC02D 100%)",
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            p: 4,
            color: "white",
          }}
        >
          <img
            src="https://media-hosting.imagekit.io/01d51a6530cc472f/download.jpeg?Expires=1839836883&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=mrSDtKCqi5lzR-hM0PpVqnfH0LrVrnIhm2biYJapfFxYj71B7Nva8skz0POjh1zrTm6PqMToGmyVla3GuItbU8d4InCTIdtr7qv8tihwSjriWOYDAQ8Qb1IrMLUR~2vBYxhVOUCCD29Wfzq9RhLfWBH7U3eyDbc0dkfbclGqtaik2qI8lqVjkcRpGsB3YB95xGVdKXDY7-70tLq19F0GT1hLA5dZteGF87Jt9j2jB~ODyiIOb5NYuktsm~2pAtBjAztJGkLqlBJK5c1MvlVNF7DffbhJsj38SSWP7BIacNKErABZEHRY-yrxOO9ZVf2HRpjlARNxrnHoZFyVgJCGTQ__"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: 8,
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
          />
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              fontWeight: "bold",
              mt: 3,
              textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              color: "#5D4037",
            }}
          >
            Welcome to MaidPro!
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              opacity: 0.9,
              fontSize: "1rem",
              color: "#5D4037",
              textAlign: "center",
            }}
          >
            Professional cleaning services for your sparkling clean home
          </Typography>
        </Box>

        <Box sx={{ width: { xs: "100%", md: "50%" }, p: 4 }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              fontWeight: "bold",
              mb: 2,
              color: "#FFA000",
              textAlign: "center",
            }}
          >
            Login to Your Account
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 4,
              color: "text.secondary",
              textAlign: "center",
            }}
          >
            Please enter your mobile number and password to access your account.
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2.5}>
              <Grid container item spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Mobile Number"
                    variant="outlined"
                    fullWidth
                    required
                    name="mobile"
                    value={loginData.mobile}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: "#FFA000" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      width: "100%",
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": {
                          borderColor: "#FFA000",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#FFA000",
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Password"
                    variant="outlined"
                    fullWidth
                    required
                    name="password"
                    value={loginData.password}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon sx={{ color: "#FFA000" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": {
                          borderColor: "#FFA000",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#FFA000",
                        },
                      },
                    }}
                  />
                </Grid>
              </Grid>

              <Grid item xs={12} sx={{ mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{
                    py: 1.8,
                    borderRadius: 2,
                    fontWeight: "bold",
                    fontSize: "1.05rem",
                    letterSpacing: 0.5,
                    background:
                      "linear-gradient(135deg, #FFA000 0%, #FFC107 100%)",
                    boxShadow: "0 4px 6px rgba(255, 160, 0, 0.3)",
                    "&:hover": {
                      boxShadow: "0 6px 8px rgba(255, 160, 0, 0.4)",
                      background:
                        "linear-gradient(135deg, #FF8F00 0%, #FFB300 100%)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                    Login
                </Button>
              </Grid>

              {/* Login Link */}
              <Grid item xs={12}>
                <Typography
                  variant="body2"
                  align="center"
                  sx={{
                    mt: 3,
                    color: "text.secondary",
                  }}
                >
                    Don't have an account?{" "}
                  <Link
                    href="/auth/signup"
                    sx={{
                      color: "#FFA000",
                      fontWeight: "medium",
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Sign Up
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
