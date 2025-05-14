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
  InputAdornment,
  Alert,
  Rating,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SendIcon from "@mui/icons-material/Send";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import {
  createBooking,
  getBookingsByUser,
  giveRating,
  resetBookingState,
} from "../features/booking/bookingSlice";

const intialBookingData = {
  maidId: "",
  durationMonths: 0,
  startDate: "",
  services: [],
  availability: "",
  street: "",
  city: "",
  state: "",
  country: "",
  pincode: "",
};

const BookMaid = () => {
  const { maids } = useSelector((state) => state.maid);

  const [bookingData, setBookingData] = useState(intialBookingData);
  const [ratindModalOpen, setRatingModalOpen] = useState(false);
  const [ratingData, setRatingData] = useState({
    bookingId: "",
    rating: 3,
    review: "",
  });

  const [modalOpen, setModalOpen] = useState(false);

  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { bookings, loading, error, bookingCreated , bookingUpdated} = useSelector(
    (state) => state.booking
  );
  const { token } = useSelector((state) => state.auth);
  const location = useLocation();

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
  }, [token, fetchuserBookings, location.pathname]);

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
      await dispatch(createBooking({ ...bookingData, id: Date.now() }));
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  useEffect(() => {
    if (bookingCreated && !loading && !error) {
      fetchuserBookings();
      setBookingData(intialBookingData);
      setModalOpen(false);
      setSnackbar({
        open: true,
        message: "Booking submitted successfully!",
        severity: "success",
      });
      dispatch(resetBookingState());
    }
    if (error) {
      setSnackbar({
        open: true,
        message: error || "Failed to create booking. Please try again.",
        severity: "error",
      });
      dispatch(resetBookingState());
    }
  }, [bookingCreated, loading, error, fetchuserBookings, dispatch]);

  useEffect(() => {
    if(bookingUpdated && !loading && !error) {
      fetchuserBookings();
      setRatingModalOpen(false);
      setSnackbar({
        open: true,
        message: "Rating submitted successfully!",
        severity: "success",
      });
      dispatch(resetBookingState());
    }
    if (error) {
      setSnackbar({
        open: true,
        message: error || "Failed to submit rating. Please try again.",
        severity: "error",
      });
      dispatch(resetBookingState());
    }
  }, [bookingUpdated, loading, error, fetchuserBookings, dispatch]);

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
                          <TableCell>
                            {booking?.maidDetails?.name || "N/A"}
                          </TableCell>
                          <TableCell>{booking?.availability}</TableCell>
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
                            {booking.status === "completed" && !booking.rating ? (
                              <>
                                <Chip
                                  label={booking.status}
                                  color="primary"
                                  variant="outlined"
                                  size="small"
                                  sx={{
                                    backgroundColor: "#e0f7fa",
                                    color: "#00796b",
                                    marginRight: 1,
                                  }}
                                />
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() => {
                                    setRatingData({
                                      bookingId: booking._id,
                                      rating: 3,
                                      review: "",
                                    });
                                    setRatingModalOpen(true);
                                  }}
                                  sx={{ ml: 1 }}
                                >
                                  Rate
                                </Button>
                              </>
                            ) : (
                              <Chip
                                label={booking.status}
                                color={
                                  booking.status === "confirmed"
                                    ? "success"
                                    : booking.status === "pending"
                                    ? "warning"
                                    : booking.status === "completed"
                                    ? "primary"
                                    : booking.status === "in-progress"
                                    ? "info"
                                    : "error" // for cancelled and rejected
                                }
                                variant="outlined"
                                size="small"
                                sx={{
                                  backgroundColor:
                                    booking.status === "confirmed"
                                      ? "#f0fff4" // light green
                                      : booking.status === "pending"
                                      ? "#fff3cd" // light yellow
                                      : booking.status === "completed"
                                      ? "#e0f7fa" // light blue
                                      : booking.status === "in-progress"
                                      ? "#e3f2fd" // light info blue
                                      : "#fff5f5", // light red for cancelled/rejected
                                  color:
                                    booking.status === "confirmed"
                                      ? "#2f855a" // dark green
                                      : booking.status === "pending"
                                      ? "#856404" // dark yellow
                                      : booking.status === "completed"
                                      ? "#00796b" // dark teal
                                      : booking.status === "in-progress"
                                      ? "#01579b" // dark info blue
                                      : "#721c24", // dark red for cancelled/rejected
                                  textTransform: "capitalize",
                                  borderWidth: "1px",
                                  borderStyle: "solid",
                                  borderColor:
                                    booking.status === "confirmed"
                                      ? "#c6f6d5"
                                      : booking.status === "pending"
                                      ? "#feebc8"
                                      : booking.status === "completed"
                                      ? "#b2ebf2"
                                      : booking.status === "in-progress"
                                      ? "#bbdefb"
                                      : "#fed7d7",
                                  fontWeight: 500,
                                }}
                              />
                            )}
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
        onClose={() => {
          if (!loading) {
            setModalOpen(false);
            setBookingData(intialBookingData);
          }
        }}
        fullWidth
        maxWidth="md"
        sx={{
          "& .MuiPaper-root": {
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            background: "linear-gradient(to bottom, #ffffff, #f8fafc)",
            overflow: "hidden",
          },
        }}
      >
        {loading && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
            }}
          >
            <CircularProgress sx={{ color: "#FFA000" }} />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <DialogContent
          sx={{
            p: { xs: 2, sm: 3 },
            "&::-webkit-scrollbar": { width: 6 },
            "&::-webkit-scrollbar-thumb": { backgroundColor: "#FFA000" },
          }}
        >
          <Box textAlign="center" mb={3}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 500,
                color: "#2d3748",
                mb: 1,
                position: "relative",
                display: "inline-block",
                "&:after": {
                  content: '""',
                  position: "absolute",
                  bottom: -6,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "100%",
                  height: 3,
                  background: "#FFA000",
                },
              }}
            >
              Book New Maid
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            {/* Section 1: Availability & Services */}
            <Paper
              elevation={0}
              sx={{ p: 2, mb: 2, borderRadius: 2, border: "1px solid #e2e8f0" }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel
                      component="legend"
                      sx={{ fontWeight: 600, color: "#2d3748", mb: 1 }}
                    >
                      Select Availability
                    </FormLabel>
                    <RadioGroup
                      row
                      name="availability"
                      value={bookingData.availability}
                      onChange={handleChange}
                      sx={{ gap: 1 }}
                    >
                      {[
                        {
                          label: "Morning",
                          value: "morning",
                        },
                        {
                          label: "Night",
                          value: "night",
                        },
                        {
                          label: "Full Day",
                          value: "full-day",
                        },
                      ].map((option) => (
                        <FormControlLabel
                          key={option.value}
                          value={option.value}
                          control={
                            <Radio
                              sx={{
                                color: "#e2e8f0",
                                "&.Mui-checked": { color: "#FFA000" },
                              }}
                            />
                          }
                          label={option.label}
                          sx={{
                            "& .MuiFormControlLabel-label": { fontWeight: 500 },
                          }}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel
                      component="legend"
                      sx={{ fontWeight: 600, color: "#2d3748", mb: 1 }}
                    >
                      Select Services
                    </FormLabel>
                    <FormGroup row sx={{ gap: 1 }}>
                      {[
                        "clothes cleaning",
                        "floor cleaning",
                        "utensils cleaning",
                        "cooking",
                        "baby care",
                      ].map((service) => (
                        <FormControlLabel
                          key={service.toLowerCase()}
                          control={
                            <Checkbox
                              checked={bookingData.services.includes(
                                service.toLowerCase()
                              )}
                              onChange={(e) =>
                                handleServiceChange(e, service.toLowerCase())
                              }
                              sx={{
                                color: "#e2e8f0",
                                "&.Mui-checked": { color: "#FFA000" },
                              }}
                            />
                          }
                          label={service}
                          sx={{
                            "& .MuiFormControlLabel-label": { fontWeight: 500 },
                          }}
                        />
                      ))}
                    </FormGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>

            {/* Section 2: Maid Selection & Details */}
            {bookingData.availability && (
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 2,
                  border: "1px solid #e2e8f0",
                }}
              >
                <Grid container spacing={2}>
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
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&:hover fieldset": { borderColor: "#FFA000" },
                          "&.Mui-focused fieldset": { borderColor: "#FFA000" },
                        },
                      }}
                    >
                      {maids
                        ?.filter(
                          (maid) =>
                            maid.availability === bookingData.availability &&
                            (bookingData.services.length === 0 ||
                              bookingData.services.every((serviceName) =>
                                maid.services.some(
                                  (maidService) =>
                                    maidService.name === serviceName
                                )
                              ))
                        )
                        .map((maid) => {
                          const totalSalary = maid.services
                            .filter((s) =>
                              bookingData.services.includes(s.name)
                            )
                            .reduce((sum, s) => sum + s.salary, 0);

                          return (
                            <MenuItem key={maid._id} value={maid._id}>
                              <Box
                                display="flex"
                                justifyContent="space-between"
                                width="100%"
                              >
                                <Box>
                                  <Typography fontWeight={600}>
                                    {maid.name}
                                  </Typography>
                                  {/* Uncomment if you want to display experience */}
                                  {/* <Typography variant="body2" color="text.secondary">
              {maid.experience} yrs exp
            </Typography> */}
                                </Box>
                                <Typography fontWeight={600}>
                                  ₹{totalSalary.toLocaleString()}/month
                                </Typography>
                              </Box>
                            </MenuItem>
                          );
                        })}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Duration (months)"
                      name="durationMonths"
                      type="number"
                      value={bookingData.durationMonths}
                      onChange={handleChange}
                      required
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">months</InputAdornment>
                        ),
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
                    />
                  </Grid>

                  {["Street", "City", "State", "Country", "Pincode"].map(
                    (field) => (
                      <Grid
                        item
                        xs={12}
                        sm={field === "Street" ? 12 : 6}
                        key={field}
                      >
                        <TextField
                          fullWidth
                          label={field}
                          name={field.toLowerCase()}
                          value={bookingData[field.toLowerCase()]}
                          onChange={handleChange}
                          required
                        />
                      </Grid>
                    )
                  )}
                </Grid>
              </Paper>
            )}

            {/* Section 3: Summary */}
            {bookingData.maidId &&
              bookingData.durationMonths &&
              bookingData.startDate && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
                    border: "1px solid #ffe8cc",
                    backgroundColor: "#fff8f0",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <ReceiptLongIcon fontSize="small" /> Booking Summary
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 1,
                    }}
                  >
                    <Typography variant="body2">Maid:</Typography>
                    <Typography fontWeight={500}>
                      {maids.find((m) => m._id === bookingData.maidId)?.name}
                    </Typography>

                    <Typography variant="body2">Services:</Typography>
                    <Typography fontWeight={500}>
                      {bookingData.services.join(", ")}
                    </Typography>

                    <Typography variant="body2">Period:</Typography>
                    <Typography fontWeight={500}>
                      {dayjs(bookingData.startDate).format("DD MMM YYYY")} -{" "}
                      {dayjs(bookingData.startDate)
                        .add(bookingData.durationMonths, "month")
                        .format("DD MMM YYYY")}
                    </Typography>

                    <Typography variant="body2">Total:</Typography>
                    <Typography fontWeight={600}>
                      ₹
                      {(
                        maids
                          .find((m) => m._id === bookingData.maidId)
                          ?.services.filter((s) =>
                            bookingData.services.includes(s.name)
                          ) // Only selected services
                          .reduce((sum, s) => sum + s.salary, 0) *
                          bookingData.durationMonths || 0
                      ).toLocaleString()}
                    </Typography>
                  </Box>
                </Paper>
              )}
            <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
              <Button
                variant="outlined"
                onClick={() => {
                  setModalOpen(false);
                  setBookingData(intialBookingData);
                }}
                sx={{
                  color: "#4a5568",
                  borderColor: "#e2e8f0",
                  "&:hover": { borderColor: "#FFA000", color: "#FFA000" },
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
                  "&:hover": { backgroundColor: "#E69100" },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "#fff" }} />
                ) : (
                  "Confirm Booking"
                )}
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={ratindModalOpen}
        onClose={() => setRatingModalOpen(false)}
        fullWidth
        maxWidth="sm"
        sx={{
          "& .MuiPaper-root": {
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            background: "linear-gradient(to bottom, #ffffff, #f8fafc)",
            overflow: "hidden",
          },
        }}
      >
        <DialogContent
          sx={{
            p: { xs: 2, sm: 3 },
            "&::-webkit-scrollbar": { width: 6 },
            "&::-webkit-scrollbar-thumb": { backgroundColor: "#FFA000" },
          }}
        >
          <Box textAlign="center" mb={3}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 500,
                color: "#2d3748",
                mb: 1,
                position: "relative",
                display: "inline-block",
                "&:after": {
                  content: '""',
                  position: "absolute",
                  bottom: -6,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "100%",
                  height: 3,
                  background: "#FFA000",
                },
              }}
            >
              Rate Your Maid
            </Typography>
          </Box>

          <Box mb={2}>
            <Rating
              name="rating"
              value={ratingData.rating}
              onChange={(event, newValue) => {
                setRatingData({ ...ratingData, rating: newValue });
              }}
              precision={0.5}
              size="large"
              sx={{ fontSize: 40  , alignItems : "center", display: "flex" }}
              
            />            
          </Box>

          <TextField
            fullWidth
            label="Review"
            name="review"
            value={ratingData.review}
            onChange={(e) =>
              setRatingData({ ...ratingData, review: e.target.value })
            }
            multiline
            rows={4}
          />

          <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
            <Button
              variant="outlined"
              onClick={() => setRatingModalOpen(false)}
              sx={{
                color: "#4a5568",
                borderColor: "#e2e8f0",
                "&:hover": { borderColor: "#FFA000", color: "#FFA000" },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#FFA000",
                color: "#fff",
                "&:hover": { backgroundColor: "#E69100" },
              }}
              onClick={async () => {
                try {
                  await dispatch(
                    giveRating({
                      ...ratingData,
                      id: Date.now(),
                    })
                  );
                } catch (error) {
                  console.error("Error submitting rating:", error);
                }
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "#fff" }} />
              ) : (
                "Submit Rating"
              )}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
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
