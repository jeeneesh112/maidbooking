import React, { useCallback, useEffect, useState } from "react";
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
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Chip,
  CircularProgress,
  TablePagination,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  createBooking,
  getBookingsByUser,
} from "../features/booking/bookingSlice";

const intialBookingData = {
  maidId: "",
  durationMonths: 0,
  startDate: "",
  services: [],
  availability: "",
};

const BookMaid = () => {
  // const { userData } = useSelector((state) => state.profile);
  const { maids } = useSelector((state) => state.maid);

  const [bookingData, setBookingData] = useState(intialBookingData);
  // const [formData, setFormData] = useState({
  //   maidId: "",
  //   durationMonths: "",
  //   startDate: "",
  //   services: [],
  //   availability: "",
  // });

  const [modalOpen, setModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { bookings, loading, error } = useSelector((state) => state.booking);
  const { token } = useSelector((state) => state.auth);

  const fetchuserBookings = useCallback(() => {
    dispatch(
      getBookingsByUser({
        page: page,
        limit: limit,
      })
    );
  }, [dispatch, page, limit]);

  useEffect(() => {
    if (token) {
      fetchuserBookings();
    }
  }, [token, fetchuserBookings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleServiceChange = (e, serviceName) => {
    const isChecked = e.target.checked;

    setBookingData((prev) => {
      if (isChecked) {
        return {
          ...prev,
          services: [...prev.services, serviceName],
        };
      } else {
        return {
          ...prev,
          services: prev.services.filter((service) => service !== serviceName),
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("bookingData:", bookingData);
      await dispatch(createBooking({ ...bookingData, id: Date.now() }));
      setBookingData(intialBookingData);
      setModalOpen(false);
      setSnackbar({ open: true, message: "Booking submitted successfully!" });
    } catch (error) {
      console.error("Error creating booking:", error);
      setSnackbar({
        open: true,
        message: "Failed to create booking. Please try again.",
      });
    }
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
          <TableContainer>
            <Table>
            <TableHead sx={{ backgroundColor: "#fff3e0" }}>
                <TableRow>
                  <TableCell>Maid</TableCell>
                  <TableCell>Availability</TableCell>
                  <TableCell>Services</TableCell>
                  <TableCell>Duration (Months)</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Total Amount (₹)</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography variant="body1" color="text.secondary">
                        No bookings yet.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  bookings?.map(
                    (booking) => (
                      console.log("booking:", booking),
                      (
                        <TableRow key={booking._id}>
                          <TableCell>{booking.maidName || "N/A"}</TableCell>
                          <TableCell>{booking.availability}</TableCell>
                          <TableCell>
                            {booking.services?.length > 0 ? (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 4,
                                }}
                              >
                                {booking.services.map((serviceName, index) => (
                                  <div key={index}>• {serviceName}</div>
                                ))}
                              </div>
                            ) : (
                              "No services"
                            )}
                          </TableCell>
                          <TableCell>{booking.durationMonths}</TableCell>
                          <TableCell>
                            {dayjs(booking.startDate).format("DD MMM YYYY")}
                          </TableCell>
                          <TableCell>
                            {dayjs(booking.endDate).format("DD MMM YYYY")}
                          </TableCell>
                          <TableCell>
                            ₹{booking.totalAmount?.toLocaleString("en-IN")}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={booking.status}
                              color={
                                booking.status === "confirmed"
                                  ? "success"
                                  : booking.status === "pending"
                                  ? "warning"
                                  : booking.status === "completed"
                                  ? "primary"
                                  : "error"
                              }
                              variant="outlined"
                              size="small"
                              sx={{
                                backgroundColor:
                                  booking.status === "confirmed"
                                    ? "#f0fff4"
                                    : booking.status === "pending"
                                    ? "#fff3cd"
                                    : booking.status === "completed"
                                    ? "#e0f7fa"
                                    : "#fff5f5",
                                color:
                                  booking.status === "confirmed"
                                    ? "#2f855a"
                                    : booking.status === "pending"
                                    ? "#856404"
                                    : booking.status === "completed"
                                    ? "#00796b"
                                    : "#721c24",
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      )
                    )
                  )
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
          </TableContainer>
        )}
      </Paper>

      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        fullWidth
        maxWidth="md"
        sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
      >
        <DialogContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Box textAlign="center" mb={3}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, color: "#2d3748", mb: 1 }}
            >
              Book New Maid
            </Typography>
          </Box>
          <Divider
            sx={{ borderBottomWidth: 2, borderColor: "#FFA000", mb: 3 }}
          />

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Availability Selection (unchanged) */}
              <Grid item xs={12}>
                <FormControl component="fieldset" fullWidth>
                  <FormLabel component="legend" required>
                    Select Availability
                  </FormLabel>
                  <RadioGroup
                    row
                    name="availability"
                    value={bookingData.availability}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="morning"
                      control={<Radio />}
                      label="Morning"
                    />
                    <FormControlLabel
                      value="night"
                      control={<Radio />}
                      label="Night"
                    />
                    <FormControlLabel
                      value="full-day"
                      control={<Radio />}
                      label="Full Day"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              {/* Updated Service Selection */}
              <Grid item xs={12}>
                <FormControl component="fieldset" fullWidth>
                  <FormLabel component="legend" required>
                    Select Required Services
                  </FormLabel>
                  <FormGroup row>
                    {[
                      "clothes cleaning",
                      "floor cleaning",
                      "utensils cleaning",
                      "cooking",
                      "baby care",
                    ].map((serviceName) => (
                      <FormControlLabel
                        key={serviceName}
                        control={
                          <Checkbox
                            checked={bookingData.services.includes(serviceName)}
                            onChange={(e) =>
                              handleServiceChange(e, serviceName)
                            }
                          />
                        }
                        label={serviceName}
                      />
                    ))}
                  </FormGroup>
                </FormControl>
              </Grid>

              {/* Maid Selection with Updated Filtering */}
              {bookingData.availability && (
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Select Maid"
                    name="maidId"
                    value={bookingData.maidId}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="medium"
                    sx={{
                      borderRadius: 2,
                      backgroundColor: "#f8fafc",
                      height: "56px",
                    }}
                  >
                    {maids
                      ?.filter((maid) => {
                        // First filter by availability
                        if (maid.availability !== bookingData.availability)
                          return false;

                        // Then filter by services if any are selected
                        if (bookingData.services.length > 0) {
                          return bookingData.services.every((serviceName) =>
                            maid.services.some(
                              (maidService) => maidService.name === serviceName
                            )
                          );
                        }
                        return true;
                      })
                      .map((maid) => {
                        const totalSalary = maid.services.reduce(
                          (sum, service) => sum + service.salary,
                          0
                        );

                        return (
                          <MenuItem key={maid._id} value={maid._id}>
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              width="100%"
                            >
                              <span style={{ fontWeight: 500 }}>
                                {maid.name}
                              </span>
                              <span style={{ color: "#4a5568" }}>
                                ₹{totalSalary.toLocaleString()}/month
                              </span>
                            </Box>
                          </MenuItem>
                        );
                      })}
                  </TextField>
                </Grid>
              )}

              {/* Duration and Start Date (unchanged) */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Duration (months)"
                  name="durationMonths"
                  type="number"
                  value={bookingData.durationMonths}
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
                  name="startDate"
                  type="date"
                  value={bookingData.startDate}
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

              {/* Updated Booking Summary */}
              {bookingData.maidId &&
                bookingData.durationMonths &&
                bookingData.startDate &&
                (() => {
                  const maid = maids.find((m) => m._id === bookingData.maidId);
                  if (!maid) return null;

                  const start = dayjs(bookingData.startDate);
                  const end = start.add(
                    Number(bookingData.durationMonths),
                    "month"
                  );

                  // Calculate total based on maid's services that match selected services
                  const selectedServicesSalary = maid.services
                    .filter((service) =>
                      bookingData.services.includes(service.name)
                    )
                    .reduce((sum, service) => sum + service.salary, 0);

                  const total =
                    selectedServicesSalary * Number(bookingData.durationMonths);

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
                          sx={{ fontWeight: 600, mb: 2, color: "#2d3748" }}
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
                                Services:
                              </Typography>
                              <Typography fontWeight={500}>
                                {bookingData.services.join(", ")}
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
                                Total Amount:
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

              {/* Buttons (unchanged) */}
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
