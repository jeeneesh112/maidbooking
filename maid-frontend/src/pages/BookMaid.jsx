import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  MenuItem,
  TextField,
  Snackbar,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogContent,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import EventNoteIcon from "@mui/icons-material/EventNote";

const BookMaid = () => {
  const { userData } = useSelector((state) => state.profile);
  const { maids } = useSelector((state) => state.maid);
  console.log("userData:", userData);
  console.log("maids:", maids);

  const [bookings, setBookings] = useState([]); // Replace with API data
  const [formData, setFormData] = useState({
    maidId: "",
    durationMonths: "",
    startDate: "",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { maidId, durationMonths, startDate } = formData;

    const start = dayjs(startDate);
    const end = start.add(Number(durationMonths), "month");
    const maid = maids.find((m) => m._id === maidId);

    if (!maid) return;

    const totalAmount = maid.salaryPerMonth * durationMonths;

    const newBooking = {
      userId: userData._id,
      maidId,
      maidName: maid.name,
      durationMonths: Number(durationMonths),
      startDate: start.format("YYYY-MM-DD"),
      endDate: end.format("YYYY-MM-DD"),
      totalAmount,
    };

    setBookings([...bookings, newBooking]);
    setModalOpen(false);
    setFormData({ maidId: "", durationMonths: "", startDate: "" });
    setSnackbar({ open: true, message: "Booking submitted successfully!" });

    // Call your API to persist booking here
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
          Your Maid Bookings
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
          Book Maid
        </Button>
      </Box>

      <Paper elevation={2} sx={{ width: "100%", overflowX: "auto" }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#fff3e0" }}>
              <TableRow>
                <TableCell>Maid</TableCell>
                <TableCell>Duration (Months)</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Total Amount (₹)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body1" color="text.secondary">
                      No bookings yet.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((booking, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{booking.maidName}</TableCell>
                    <TableCell>{booking.durationMonths}</TableCell>
                    <TableCell>{booking.startDate}</TableCell>
                    <TableCell>{booking.endDate}</TableCell>
                    <TableCell>₹{booking.totalAmount}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        fullWidth
        maxWidth="md"
        sx={{
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <DialogContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Box textAlign="center" mb={3}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: "#2d3748",
                mb: 1,
              }}
            >
              Book New Maid
            </Typography>
          </Box>
          <Divider
            sx={{ borderBottomWidth: 2, borderColor: "#FFA000", mb: 3 }}
          />

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Select Maid"
                  name="maidId"
                  value={formData.maidId}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  size="medium"
                  sx={{
                    borderRadius: 2,
                    backgroundColor: "#f8fafc",
                    height: "56px", // Makes the field taller
                    "& .MuiSelect-icon": {
                      top: "calc(50% - 12px)", // Adjusts the dropdown icon position if needed
                    },
                  }}
                >
                  {maids?.map((maid) => (
                    <MenuItem key={maid._id} value={maid._id}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        width="100%"
                      >
                        <span style={{ fontWeight: 500 }}>{maid.name}</span>
                        <span style={{ color: "#4a5568" }}>
                          ₹{maid.salaryPerMonth.toLocaleString()}/month
                        </span>
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Duration (months)"
                  name="durationMonths"
                  type="number"
                  value={formData.durationMonths}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  size="medium"
                  sx={{
                    borderRadius: 2,
                      backgroundColor: "#f8fafc",
                      height: "56px",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                //   label="Start Date"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  size="medium"
                  sx={{
                    borderRadius: 2,
                    backgroundColor: "#f8fafc",
                    height: "56px",
                  }}
                />
              </Grid>
              {formData.maidId &&
                formData.durationMonths &&
                formData.startDate &&
                (() => {
                  const maid = maids.find((m) => m._id === formData.maidId);
                  if (!maid) return null;
                  const start = dayjs(formData.startDate);
                  const end = start.add(
                    Number(formData.durationMonths),
                    "month"
                  );
                  const total =
                    maid.salaryPerMonth * Number(formData.durationMonths);

                  return (
                    <Grid item xs={12}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          borderRadius: 2,
                          backgroundColor: "#fff8f0",
                          border: "1px solid #ffe8cc",
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 600,
                            mb: 2,
                            color: "#2d3748",
                          }}
                        >
                          Booking Summary
                        </Typography>

                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Box mb={2}>
                              <Typography variant="body2" color="textSecondary">
                                Maid:
                              </Typography>
                              <Typography fontWeight={500}>
                                {maid.name}
                              </Typography>
                            </Box>
                            <Box mb={2}>
                              <Typography variant="body2" color="textSecondary">
                                Duration:
                              </Typography>
                              <Typography fontWeight={500}>
                                {formData.durationMonths} month(s)
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Box mb={2}>
                              <Typography variant="body2" color="textSecondary">
                                Start Date:
                              </Typography>
                              <Typography fontWeight={500}>
                                {start.format("DD MMM YYYY")}
                              </Typography>
                            </Box>
                            <Box mb={2}>
                              <Typography variant="body2" color="textSecondary">
                                End Date:
                              </Typography>
                              <Typography fontWeight={500}>
                                {end.format("DD MMM YYYY")}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12}>
                            <Divider sx={{ my: 1 }} />
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <Typography variant="body1" fontWeight={600}>
                                Total Amount :
                              </Typography>
                              <Typography
                                variant="h6"
                                fontWeight={700}
                                color="#2d3748"
                              >
                                ₹{total.toLocaleString("en-IN")}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  );
                })()}

              <Grid item xs={12} mt={10}>
                <Box display="flex" justifyContent="flex-end" gap={2}>
                  <Button
                    variant="outlined"
                    onClick={() => setModalOpen(false)}
                    sx={{
                      color: "#4a5568",
                      borderColor: "#e2e8f0",
                      borderRadius: 2,
                      px: 3,
                      py: 1,
                      textTransform: "none",
                      fontWeight: 500,
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      backgroundColor: "#FFA000",
                      color: "#fff",
                      fontWeight: 500,
                      px: 4,
                      py: 1,
                      borderRadius: 2,
                      textTransform: "none",
                    }}
                  >
                    Confirm Booking
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={() => setSnackbar({ ...snackbar, open: false })}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  );
};

export default BookMaid;
