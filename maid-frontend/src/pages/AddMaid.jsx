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
import TablePagination from "@mui/material/TablePagination";

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
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const dispatch = useDispatch();
  const { maids, loading, error } = useSelector((state) => state.maid);
  const { userData } = useSelector((state) => state.profile);
  const { token, user } = useSelector((state) => state.auth);

  const fetchMaids = useCallback(() => {
    dispatch(
      fetchMaid({
        area: user.userType === "superadmin" ? "" : userData?.area,
        page: page,
        limit: limit,
      })
    );
  }, [dispatch, user.userType, userData?.area, page, limit]);

  useEffect(() => {
    if (token) {
      fetchMaids();
    }
  }, [token, fetchMaids]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMaidData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
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
      // fetchMaids();x
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
    // fetchMaids();
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
      {/* Top Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold" color="#FF8F00">
          Maid List
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#FFA000",
            color: "#fff",
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            "&:hover": {
              backgroundColor: "#FF8F00",
            },
          }}
          onClick={() => setModalOpen(true)}
        >
          + Add Maid
        </Button>
      </Box>

      {/* Maid Table */}
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          overflowX: "auto",
          borderRadius: 2,
        }}
      >
        {loading ? (
          <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Table>
              <TableHead sx={{ backgroundColor: "#fff3e0" }}>
                <TableRow>
                  <TableCell>
                    <strong>Photo</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Mobile</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Area</strong>
                  </TableCell>
                  <TableCell>
                    <strong>City</strong>
                  </TableCell>
                  <TableCell>
                    <strong>State</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Salary</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {maids?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography variant="h6" color="text.secondary">
                        No maids found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  maids?.map((maid) => (
                    <TableRow key={maid?._id} hover>
                      <TableCell>
                        {maid?.picture ? (
                          <Box
                            component="img"
                            src={maid.picture}
                            alt={maid?.name}
                            sx={{
                              width: 70,
                              height: 70,
                              borderRadius: "10%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: 70,
                              height: 70,
                              borderRadius: "10%",
                              backgroundColor: "#ffe0b2",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#fb8c00",
                              fontWeight: "bold",
                              fontSize: "1.5rem",
                              textTransform: "uppercase",
                            }}
                          >
                            {maid?.name?.[0] || "?"}
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>{maid?.name}</TableCell>
                      <TableCell>{maid?.mobile}</TableCell>
                      <TableCell>{maid?.area}</TableCell>
                      <TableCell>{maid?.city}</TableCell>
                      <TableCell>{maid?.state}</TableCell>
                      <TableCell>₹{maid?.salaryPerMonth}</TableCell>
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

            <TablePagination
              component="div"
              count={maids?.length || 0}
              page={page - 1}
              onPageChange={(event, newPage) => setPage(newPage + 1)}
              rowsPerPage={limit}
              onRowsPerPageChange={(event) => {
                setLimit(parseInt(event.target.value, 10));
                setPage(1);
              }}
              rowsPerPageOptions={[5, 10, 25, 50]}
              sx={{ px: 2, py: 1 }}
            />
          </>
        )}
      </Paper>

      {/* Add Maid Modal */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          },
        }}
      >
        <DialogContent
          sx={{
            p: { xs: 3, sm: 4 },
            "&.MuiDialogContent-root": {
              py: 3,
            },
          }}
        >
          <Box textAlign="center" mb={3}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: "#FF8F00",
                mb: 1,
                letterSpacing: "0.5px",
              }}
            >
              Add New Maid
            </Typography>
            <Divider
              sx={{ borderBottomWidth: 2, borderColor: "#FFA000", mb: 3 }}
            />
          </Box>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {[
                {
                  name: "name",
                  label: "Full Name ",
                  required: true,
                  type: "text",
                },
                {
                  name: "mobile",
                  label: "Mobile Number ",
                  required: true,
                  type: "tel",
                },
                {
                  name: "pic",
                  label: "Picture URL",
                  required: false,
                  type: "url",
                },
                { name: "city", label: "City ", required: true, type: "text" },
                {
                  name: "state",
                  label: "State ",
                  required: true,
                  type: "text",
                },
                {
                  name: "area",
                  label: "Area/Locality ",
                  required: true,
                  type: "text",
                },
                {
                  name: "pincode",
                  label: "Pincode ",
                  required: true,
                  type: "text",
                },
                {
                  name: "salary",
                  label: "Expected Salary (₹) ",
                  required: true,
                  type: "number",
                },
              ].map((field) => (
                <Grid item xs={12} sm={6} key={field.name}>
                  <TextField
                    label={field.label}
                    name={field.name}
                    fullWidth
                    value={maidData[field.name]}
                    onChange={handleChange}
                    size="medium"
                    type={field.type}
                    required={field.required}
                    error={!!errors[field.name]}
                    helperText={errors[field.name]}
                    variant="outlined"
                    sx={{
                      borderRadius: 2,
                      backgroundColor: field.required ? "#fff8f0" : "#f8fafc",
                    }}
                  />
                </Grid>
              ))}
            </Grid>

            <Box
              display="flex"
              justifyContent="flex-end"
              gap={2}
              mt={4}
              sx={{
                pt: 2,
                borderTop: "1px solid #f0f0f0",
              }}
            >
              <Button
                variant="outlined"
                onClick={handleCloseModal}
                sx={{
                  color: "#4a5568",
                  borderColor: "#e2e8f0",
                  borderRadius: 2,
                  px: 4,
                  py: 1,
                  textTransform: "none",
                  fontWeight: 500,
                  "&:hover": {
                    borderColor: "#cbd5e0",
                    backgroundColor: "#f7fafc",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "#FF8F00",
                  color: "#fff",
                  fontWeight: 600,
                  px: 4,
                  py: 1,
                  borderRadius: 2,
                  textTransform: "none",
                  boxShadow: "0 2px 6px rgba(255, 143, 0, 0.3)",
                  "&:hover": {
                    backgroundColor: "#e67e00",
                    boxShadow: "0 4px 8px rgba(255, 143, 0, 0.4)",
                  },
                }}
              >
                Add Maid
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>

      {/* Snackbar notifications */}
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
