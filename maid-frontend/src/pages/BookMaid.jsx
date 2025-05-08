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

  const [modalOpen, setModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { bookings, loading, error } = useSelector((state) => state.booking);
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

      {/* <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
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
        <Box
          sx={{
            background: "#FFA000",
            height: 6,
            width: "100%",
          }}
        />

        <DialogContent
          sx={{
            p: { xs: 3, sm: 4 },
            "&::-webkit-scrollbar": {
              width: 6,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#FFA000",
              // borderRadius: 3,
            },
          }}
        >
          <Box textAlign="center" mb={4}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#2d3748",
                mb: 1,
                letterSpacing: -0.5,
                position: "relative",
                display: "inline-block",
                "&:after": {
                  content: '""',
                  position: "absolute",
                  bottom: -8,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 60,
                  height: 4,
                  background: "#FFA000",
                  // borderRadius: 2,
                },
              }}
            >
              Book New Maid
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fill in the details to book your preferred maid
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Availability Selection */}
      {/* <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{ p: 2.5, borderRadius: 2, border: "1px solid #e2e8f0" }}
                >
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel
                      component="legend"
                      sx={{
                        fontWeight: 600,
                        color: "#2d3748",
                        mb: 1.5,
                        fontSize: "0.95rem",
                      }}
                    >
                      Select Availability
                    </FormLabel>
                    <RadioGroup
                      row
                      name="availability"
                      value={bookingData.availability}
                      onChange={handleChange}
                      sx={{ gap: 2 }}
                    >
                      {[
                        { value: "morning", label: "Morning" },
                        { value: "night", label: "Night" },
                        { value: "full-day", label: "Full Day" },
                      ].map((option) => (
                        <Paper
                          key={option.value}
                          elevation={0}
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            flex: 1,
                            border: "1px solid",
                            borderColor:
                              bookingData.availability === option.value
                                ? "#FFA000"
                                : "#e2e8f0",
                            backgroundColor:
                              bookingData.availability === option.value
                                ? "#fff8f0"
                                : "#f8fafc",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              borderColor: "#FFA000",
                            },
                          }}
                        >
                          <FormControlLabel
                            value={option.value}
                            control={
                              <Radio
                                sx={{
                                  color: "#e2e8f0",
                                  "&.Mui-checked": {
                                    color: "#FFA000",
                                  },
                                }}
                              />
                            }
                            label={option.label}
                            sx={{
                              width: "100%",
                              m: 0,
                              "& .MuiFormControlLabel-label": {
                                fontWeight: 500,
                                color: "#2d3748",
                              },
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </Paper>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Paper>
              </Grid> */}

      {/* Service Selection */}
      {/* <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{ p: 2.5, borderRadius: 2, border: "1px solid #e2e8f0" }}
                >
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel
                      component="legend"
                      sx={{
                        fontWeight: 600,
                        color: "#2d3748",
                        mb: 1.5,
                        fontSize: "0.95rem",
                      }}
                    >
                      Select Required Services
                    </FormLabel>
                    <Grid container spacing={1.5}>
                      {[
                        "clothes cleaning",
                        "floor cleaning",
                        "utensils cleaning",
                        "cooking",
                        "baby care",
                      ].map((serviceName) => (
                        <Grid item xs={12} sm={6} md={4} key={serviceName}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 1.5,
                              borderRadius: 1.5,
                              border: "1px solid",
                              borderColor: bookingData.services.includes(
                                serviceName
                              )
                                ? "#FFA000"
                                : "#e2e8f0",
                              backgroundColor: bookingData.services.includes(
                                serviceName
                              )
                                ? "#fff8f0"
                                : "#f8fafc",
                              transition: "all 0.2s ease",
                              "&:hover": {
                                borderColor: "#FFA000",
                              },
                            }}
                          >
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={bookingData.services.includes(
                                    serviceName
                                  )}
                                  onChange={(e) =>
                                    handleServiceChange(e, serviceName)
                                  }
                                  sx={{
                                    color: "#e2e8f0",
                                    "&.Mui-checked": {
                                      color: "#FFA000",
                                    },
                                  }}
                                />
                              }
                              label={
                                <Typography
                                  sx={{
                                    fontWeight: 500,
                                    color: "#2d3748",
                                    textTransform: "capitalize",
                                  }}
                                >
                                  {serviceName}
                                </Typography>
                              }
                              sx={{ m: 0 }}
                            />
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </FormControl>
                </Paper>
              </Grid> */}

      {/* Maid Selection */}
      {/* {bookingData.availability && (
                <Grid item xs={12}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      border: "1px solid #e2e8f0",
                    }}
                  >
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
                      SelectProps={{
                        MenuProps: {
                          PaperProps: {
                            sx: {
                              borderRadius: 2,
                              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                              mt: 1,
                            },
                          },
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          backgroundColor: "#f8fafc",
                          "& fieldset": {
                            borderColor: "#e2e8f0",
                          },
                          "&:hover fieldset": {
                            borderColor: "#FFA000",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#FFA000",
                            boxShadow: "0 0 0 2px rgba(255,160,0,0.2)",
                          },
                        },
                      }}
                    >
                      {maids
                        ?.filter((maid) => {
                          if (maid.availability !== bookingData.availability)
                            return false;
                          if (bookingData.services.length > 0) {
                            return bookingData.services.every((serviceName) =>
                              maid.services.some(
                                (maidService) =>
                                  maidService.name === serviceName
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
                            <MenuItem
                              key={maid._id}
                              value={maid._id}
                              sx={{
                                py: 1.5,
                                "&.Mui-selected": {
                                  backgroundColor: "#fff8f0",
                                },
                                "&:hover": {
                                  backgroundColor: "#fff8f0",
                                },
                              }}
                            >
                              <Box
                                display="flex"
                                justifyContent="space-between"
                                width="100%"
                                alignItems="center"
                              >
                                <Box>
                                  <Typography sx={{ fontWeight: 600 }}>
                                    {maid.name}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {maid.experience} years experience
                                  </Typography>
                                </Box>
                                <Chip
                                  label={`₹${totalSalary.toLocaleString()}/month`}
                                  size="small"
                                  sx={{
                                    backgroundColor: "#fff8f0",
                                    color: "#FFA000",
                                    fontWeight: 600,
                                  }}
                                />
                              </Box>
                            </MenuItem>
                          );
                        })}
                    </TextField>
                  </Paper>
                </Grid>
              )} */}

      {/* Duration and Start Date */}
      {/* <Grid item xs={12} sm={6}>
                <Paper
                  elevation={0}
                  sx={{ p: 2.5, borderRadius: 2, border: "1px solid #e2e8f0" }}
                >
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
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Typography variant="body2" color="text.secondary">
                            months
                          </Typography>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: "#f8fafc",
                        "& fieldset": {
                          borderColor: "#e2e8f0",
                        },
                        "&:hover fieldset": {
                          borderColor: "#FFA000",
                        },
                      },
                    }}
                  />
                </Paper>
              </Grid> */}

      {/* <Grid item xs={12} sm={6}>
                <Paper
                  elevation={0}
                  sx={{ p: 2.5, borderRadius: 2, border: "1px solid #e2e8f0" }}
                >
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
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: "#f8fafc",
                        "& fieldset": {
                          borderColor: "#e2e8f0",
                        },
                        "&:hover fieldset": {
                          borderColor: "#FFA000",
                        },
                      },
                    }}
                  />
                </Paper>
              </Grid> */}

      {/* Address Fields */}
      {/* {["street", "city", "state", "country", "pincode"].map(
                (field, index) => (
                  <Grid item xs={12} sm={index === 0 ? 12 : 6} key={field}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        borderRadius: 2,
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <TextField
                        fullWidth
                        label={field.charAt(0).toUpperCase() + field.slice(1)}
                        name={field}
                        value={bookingData[field]}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        size="medium"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            backgroundColor: "#f8fafc",
                            "& fieldset": {
                              borderColor: "#e2e8f0",
                            },
                            "&:hover fieldset": {
                              borderColor: "#FFA000",
                            },
                          },
                        }}
                      />
                    </Paper>
                  </Grid>
                )
              )} */}

      {/* Booking Summary */}
      {/* {bookingData.maidId &&
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
                          background:
                            "linear-gradient(to right, #fff8f0, #fff)",
                          border: "1px solid #ffe8cc",
                          boxShadow: "0 4px 12px rgba(255,160,0,0.08)",
                        }}
                      >
                        <Box display="flex" alignItems="center" mb={2}>
                          <ReceiptLongIcon sx={{ color: "#FFA000", mr: 1.5 }} />
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 700, color: "#2d3748" }}
                          >
                            Booking Summary
                          </Typography>
                        </Box>

                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <Box mb={2}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Maid Information
                              </Typography>
                              <Box mt={1} display="flex" alignItems="center">
                                <Avatar
                                  sx={{
                                    bgcolor: "#FFA000",
                                    width: 40,
                                    height: 40,
                                    mr: 1.5,
                                  }}
                                >
                                  {maid.name.charAt(0)}
                                </Avatar>
                                <Box>
                                  <Typography fontWeight={600}>
                                    {maid.name}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {maid.experience} years experience
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>

                            <Box mb={2}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                mb={1}
                              >
                                Selected Services
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 1,
                                }}
                              >
                                {bookingData.services.map((service) => (
                                  <Chip
                                    key={service}
                                    label={service}
                                    size="small"
                                    sx={{
                                      backgroundColor: "#fff8f0",
                                      color: "#FFA000",
                                      fontWeight: 500,
                                    }}
                                  />
                                ))}
                              </Box>
                            </Box>
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <Box mb={2}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Booking Period
                              </Typography>
                              <Box
                                mt={1.5}
                                display="flex"
                                justifyContent="space-between"
                              >
                                <Box>
                                  <Typography variant="body2">
                                    Start Date
                                  </Typography>
                                  <Typography fontWeight={600}>
                                    {start.format("DD MMM YYYY")}
                                  </Typography>
                                </Box>
                                <Box>
                                  <Typography variant="body2">
                                    End Date
                                  </Typography>
                                  <Typography fontWeight={600}>
                                    {end.format("DD MMM YYYY")}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>

                            <Box mt={3}>
                              <Divider sx={{ my: 1.5 }} />
                              <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                              >
                                <Typography variant="body1" fontWeight={700}>
                                  Total Amount
                                </Typography>
                                <Typography
                                  variant="h5"
                                  fontWeight={800}
                                  color="#2d3748"
                                >
                                  ₹{total.toLocaleString("en-IN")}
                                </Typography>
                              </Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                ({bookingData.durationMonths} months service)
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  );
                })()} */}

      {/* Buttons */}
      {/* <Grid item xs={12} mt={4}>
                <Box display="flex" justifyContent="space-between" gap={2}>
                  <Button
                    variant="outlined"
                    onClick={() => setModalOpen(false)}
                    startIcon={<CloseIcon />}
                    sx={{
                      color: "#4a5568",
                      borderColor: "#e2e8f0",
                      borderRadius: 2,
                      px: 4,
                      py: 1.5,
                      textTransform: "none",
                      fontWeight: 600,
                      "&:hover": {
                        borderColor: "#FFA000",
                        color: "#FFA000",
                        backgroundColor: "#fff8f0",
                      },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    endIcon={<SendIcon />}
                    sx={{
                      background: "linear-gradient(to right, #FFA000, #FF8F00)",
                      color: "#fff",
                      fontWeight: 600,
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: "none",
                      boxShadow: "0 4px 12px rgba(255,160,0,0.3)",
                      "&:hover": {
                        background:
                          "linear-gradient(to right, #FF8F00, #FFA000)",
                        boxShadow: "0 6px 16px rgba(255,160,0,0.4)",
                      },
                    }}
                  >
                    Confirm Booking
                  </Button>
                </Box>
              </Grid> */}
      {/* </Grid> */}
      {/* </form> */}
      {/* </DialogContent> */}
      {/* </Dialog>  */}

      <Dialog
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setBookingData(intialBookingData);
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
                Confirm Booking
              </Button>
            </Box>
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
