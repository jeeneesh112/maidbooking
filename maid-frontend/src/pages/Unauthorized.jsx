import React from "react";
import { Box, Paper, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 3,
        backgroundColor: "#fffdf5",
        minHeight: "100vh",
        maxWidth: "100vw",
        minWidth: "80vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Paper
        elevation={2}
        sx={{
          padding: 5,
          maxWidth: 600,
          width: "100%",
          textAlign: "center",
          borderRadius: 4,
          border: "1px solid #ffe8a1",
          backgroundColor: "#ffffff",
        }}
      >
        <Typography variant="h4" color="error" fontWeight="bold" gutterBottom>
          403 - Unauthorized
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          You do not have the required permissions to access this page.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/dashboard")}
          sx={{
            backgroundColor: "#facc15",
            "&:hover": {
              backgroundColor: "#eab308",
            },
            borderRadius: 8,
            px: 4,
          }}
        >
          Go to Home
        </Button>
      </Paper>
    </Box>
  );
};

export default Unauthorized;
