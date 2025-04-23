import React, { useState, useEffect, useCallback } from "react";
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
  Dialog,
  DialogContent,
  Divider,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchMaid, createMaid, deleteMaid } from "../features/maid/maidSlice";
import CloseIcon from "@mui/icons-material/Close";

const initialMaidData = {
  name: "",
  mobile: "",
  pic: "",
  city: "",
  state: "",
  area: "",
  pincode: "",
  salary: "",
};

const AddMaid = () => {
  const [maidData, setMaidData] = useState(initialMaidData);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const { maids, loading, error } = useSelector((state) => state.maid);
  const { userData } = useSelector((state) => state.profile);
  const { token, user } = useSelector((state) => state.auth);

  const fetchMaids = useCallback(() => {
    dispatch(
      fetchMaid({
        area: user.userType === "superadmin" ? "" : userData?.area,
        page: 1,
        limit: 10,
      })
    );
  }, [dispatch, user.userType, userData?.area]);

  useEffect(() => {
    if (token) {
      fetchMaids();
    }
  }, [token, fetchMaids]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMaidData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateFields = useCallback((data) => {
    const errs = {};
    if (!data.name?.trim()) errs.name = "Name is required";
    if (!data.mobile?.trim()) errs.mobile = "Mobile number is required";
    if (!data.city?.trim()) errs.city = "City is required";
    if (!data.state?.trim()) errs.state = "State is required";
    if (!data.area?.trim()) errs.area = "Area is required";
    if (!data.pincode?.trim()) errs.pincode = "Pincode is required";
    if (!data.salary?.trim()) errs.salary = "Salary is required";
    return errs;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateFields(maidData);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await dispatch(createMaid({ ...maidData, id: Date.now() })).unwrap();
      setMaidData(initialMaidData);
      setErrors({});
      setModalOpen(false);
      fetchMaids();
      setSnackbarMessage("Maid added successfully");
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage("Failed to add maid");
      setSnackbarOpen(true);
    }
  };

  const handleDelete = (id) => {
    dispatch(deleteMaid(id));
    setSnackbarMessage("Maid deleted successfully");
    setSnackbarOpen(true);
    fetchMaids();
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setMaidData(initialMaidData);
    setErrors({});
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
            "&:hover": {
              backgroundColor: "#FF8F00",
            },
          }}
          onClick={() => setModalOpen(true)}
        >
          Add Maid
        </Button>
      </Box>

      <Paper elevation={2} sx={{ width: "100%", overflowX: "auto" }}>
        {loading ? (
          <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead sx={{ backgroundColor: "#fff3e0" }}>
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
              {maids?.maids?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="h6" color="text.secondary">
                      No maids found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                maids?.maids?.map((maid) => (
                  <TableRow key={maid?._id} hover>
                    <TableCell>{maid?.name}</TableCell>
                    <TableCell>{maid?.mobile}</TableCell>
                    <TableCell>{maid?.area}</TableCell>
                    <TableCell>{maid?.city}</TableCell>
                    <TableCell>{maid?.state}</TableCell>
                    <TableCell>{maid?.salaryPerMonth}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => alert("Edit logic")}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(maid._id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Paper>

      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography
            variant="h5"
            align="center"
            sx={{ mb: 2, fontWeight: "bold" }}
          >
            Add New Maid
          </Typography>
          <Divider
            sx={{
              borderBottomWidth: 2,
              borderColor: "#FFA000",
              mb: 3,
            }}
          />
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {[
                { name: "name", label: "Full Name", required: true },
                { name: "mobile", label: "Mobile Number", required: true },
                { name: "pic", label: "Picture URL", required: false },
                { name: "city", label: "City", required: true },
                { name: "state", label: "State", required: true },
                { name: "area", label: "Area/Locality", required: true },
                { name: "pincode", label: "Pincode", required: true },
                { name: "salary", label: "Expected Salary (₹)", required: true },
              ].map((field) => (
                <Grid item xs={12} sm={6} key={field.name}>
                  <TextField
                    label={field.label}
                    name={field.name}
                    fullWidth
                    value={maidData[field.name]}
                    onChange={handleChange}
                    size="small"
                    required={field.required}
                    error={!!errors[field.name]}
                    helperText={errors[field.name]}
                  />
                </Grid>
              ))}
              
              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end" gap={2} mt={1}>
                  <Button
                    variant="outlined"
                    onClick={handleCloseModal}
                    sx={{
                      color: "#555",
                      borderColor: "#ccc",
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
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={() => setSnackbarOpen(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
      
      {error && (
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => dispatch({ type: "maid/clearError" })}
          message={error}
          action={
            <IconButton
              size="small"
              color="inherit"
              onClick={() => dispatch({ type: "maid/clearError" })}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      )}
    </Box>
  );
};

export default AddMaid;