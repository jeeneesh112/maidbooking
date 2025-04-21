import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  CircularProgress,
  Snackbar,
  Paper,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditMaid = () => {
  const navigate = useNavigate();
  const { maidId } = useParams();
  const [maidData, setMaidData] = useState({
    name: "",
    mobile: "",
    pic: "",
    city: "",
    state: "",
    area: "",
    pincode: "",
    salary: "",
  });
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/maids/${maidId}`)
      .then((response) => {
        setMaidData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching maid:", err);
        setLoading(false);
      });
  }, [maidId]);

  const handleChange = (e) => {
    setMaidData({ ...maidData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`/api/maids/${maidId}`, maidData);
      setSnackbarMessage("Maid updated successfully!");
      setSnackbarOpen(true);
      setTimeout(() => navigate("/admin/maids"), 1500);
    } catch (err) {
      console.error("Error updating maid:", err);
      setSnackbarMessage("Failed to update maid.");
      setSnackbarOpen(true);
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 3,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fffbe6",
        minHeight: "100vh",
      }}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, width: "100%" }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Edit Maid Details
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {[
                { label: "Name", name: "name" },
                { label: "Mobile", name: "mobile" },
                { label: "Picture URL", name: "pic" },
                { label: "City", name: "city" },
                { label: "State", name: "state" },
                { label: "Area", name: "area" },
                { label: "Pincode", name: "pincode" },
                { label: "Salary", name: "salary" },
              ].map((field) => (
                <Grid item xs={12} key={field.name}>
                  <TextField
                    label={field.label}
                    name={field.name}
                    value={maidData[field.name]}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
              ))}
              <Grid item xs={12}>
                <Button type="submit" variant="contained" fullWidth>
                  Update Maid
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default EditMaid;
