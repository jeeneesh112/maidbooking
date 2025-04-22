import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Snackbar,
  Box,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  CircularProgress,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  InputLabel,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchMaid, createMaid, deleteMaid } from "../features/maid/maidSlice";

const AddMaid = () => {
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

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const dispatch = useDispatch();
  const { maids, loading } = useSelector((state) => state.maid);

  useEffect(() => {
    dispatch(fetchMaid());
  }, [dispatch]);

  const handleChange = (e) => {
    setMaidData({ ...maidData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(createMaid({ ...maidData, id: Date.now() }));
      // setSnackbarMessage("Maid added successfully!");
      // setSnackbarOpen(true);
      setMaidData({
        name: "",
        mobile: "",
        pic: "",
        city: "",
        state: "",
        area: "",
        pincode: "",
        salary: "",
      });
      setModalOpen(false);
    } catch (err) {
      setSnackbarMessage("Failed to add maid.");
      setSnackbarOpen(true);
    }
  };

  const handleDelete = (id) => {
    dispatch(deleteMaid(id));
    setSnackbarMessage("Maid deleted.");
    setSnackbarOpen(true);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 3,
        backgroundColor: "#fffdf5",
        minHeight: "100vh",
        maxWidth: "100vw",
        minWidth: "80vw",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          alignItems: "center",
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Maid List
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#FFA000",
            color: "#fff",
          }}
          onClick={() => setModalOpen(true)}
        >
          Add Maid
        </Button>
      </Box>

      <Paper elevation={2} sx={{ width: "100%", overflowX: "auto" }}>
        {loading ? (
          <Box sx={{ p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead sx={{ backgroundColor: "#fff3e0" }}>
              {" "}
              {/* soft orange */}
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Mobile</TableCell>
                <TableCell>Area</TableCell>
                <TableCell>City</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Salary</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {maids.map((maid) => (
                <TableRow key={maid.id} hover>
                  <TableCell>{maid.name}</TableCell>
                  <TableCell>{maid.mobile}</TableCell>
                  <TableCell>{maid.area}</TableCell>
                  <TableCell>{maid.city}</TableCell>
                  <TableCell>{maid.state}</TableCell>
                  <TableCell>{maid.salary}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => alert("Edit logic")}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(maid.id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogContent sx={{ padding: "24px 80px" }}>
          <Typography
            variant="h5"
            align="center"
            sx={{ marginBottom: "24px", fontWeight: "bold" }}
          >
            Add New Maid
          </Typography>
          <Divider
            sx={{
              borderBottomWidth: 2,
              borderColor: "#FFA000",
              width: "100%",
              margin: "0 auto 24px",
            }}
          />
          <form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <TextField
                  label="Full Name"
                  name="name"
                  fullWidth
                  value={maidData.name}
                  onChange={handleChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Mobile Number"
                  name="mobile"
                  fullWidth
                  value={maidData.mobile}
                  onChange={handleChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Picture URL"
                  name="pic"
                  fullWidth
                  value={maidData.pic}
                  onChange={handleChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="City"
                  name="city"
                  fullWidth
                  value={maidData.city}
                  onChange={handleChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="State"
                  name="state"
                  fullWidth
                  value={maidData.state}
                  onChange={handleChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Area/Locality"
                  name="area"
                  fullWidth
                  value={maidData.area}
                  onChange={handleChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Pincode"
                  name="pincode"
                  fullWidth
                  value={maidData.pincode}
                  onChange={handleChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Expected Salary (₹)"
                  name="salary"
                  fullWidth
                  value={maidData.salary}
                  onChange={handleChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Box display="flex" justifyContent={ "flex-end" } gap={2}>
                  <Button
                    variant="outlined"
                    onClick={() => setModalOpen(false)}
                    sx={{
                      color: "#555",
                      borderColor: "#ccc",
                      fontSize: "0.875rem",
                      textTransform: "none",
                      "&:hover": {
                        borderColor: "#999",
                        backgroundColor: "#f5f5f5",
                      },
                    }}
                  >
                    Close
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      backgroundColor: "#FFA000",
                      color: "#fff",
                      fontSize: "0.875rem",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "#FF8F00",
                      },
                    }}
                  >
                    Add Maid
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default AddMaid;
