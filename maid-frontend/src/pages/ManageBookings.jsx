import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Snackbar,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Avatar,
  Badge,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  getallBookings,
  getmaidviseBookings,
} from "../features/booking/bookingSlice";
import { useLocation } from "react-router-dom";
import PhoneIcon from "@mui/icons-material/Phone";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BuildIcon from "@mui/icons-material/Build";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PersonIcon from "@mui/icons-material/Person";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WorkIcon from "@mui/icons-material/Work";

const DetailCard = ({ icon, title, value }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      height: "80px", // Fixed height
      minWidth: "80px", // Minimum width
      backgroundColor: "white",
      borderRadius: 2,
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
      {icon}
      <Typography
        variant="subtitle2"
        sx={{
          color: "black",
          fontWeight: "medium",
          ml: 1,
        }}
      >
        {title}
      </Typography>
    </Box>
    <Typography
      variant="body2"
      sx={{
        color: "black",
        wordBreak: "break-word", // Handle long text
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "-webkit-box",
        WebkitLineClamp: 2, // Limit to 2 lines
        WebkitBoxOrient: "vertical",
      }}
    >
      {value}
    </Typography>
  </Paper>
);

const ManageBookings = () => {
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [selectedBooking, setSelectedBooking] = useState(null);
  // const [maidBookings, setMaidBookings] = useState([]);
  const [maidAvailability, setMaidAvailability] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { bookings, loading } = useSelector((state) => state.booking);
  const { token } = useSelector((state) => state.auth);
  const location = useLocation();

  const fetchBookings = useCallback(() => {
    dispatch(
      getallBookings({
        page: page,
        limit: limit,
      })
    );
  }, [dispatch, page, limit]);

  useEffect(() => {
    if (token) {
      fetchBookings();
    }
  }, [token, fetchBookings, location.pathname]);

  const handleRowClick = async (booking) => {
    setSelectedBooking(booking);
    try {
      // Fetch all bookings for this maid
      const result = await dispatch(
        getmaidviseBookings({
          maidId: booking.maidId,
        })
      );
      const maidBookingsData = result.payload.bookings || [];
      const activeBookings = maidBookingsData.filter(
        (b) =>
          (b.status === "confirmed" || b.status === "in-progress") &&
          booking.startDate <= b.endDate &&
          booking.endDate >= b.startDate
      );

      const maidprofile = maidBookingsData[0]?.maidDetails;

      const isAvailable = activeBookings.length < 3;
      setMaidAvailability({
        isAvailable,
        activeCount: activeBookings.length,
        activeBookings,
        maidDetails: maidprofile,
      });
      setOpenDialog(true);
      console.log("Maid availability data:", maidAvailability);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to fetch maid details",
      });
    }
  };

  const handleApprove = () => {
    // Implement approval logic here
    setSnackbar({
      open: true,
      message: "Booking approved successfully",
    });
    setOpenDialog(false);
  };

  const handleReject = () => {
    // Implement rejection logic here
    setSnackbar({
      open: true,
      message: "Booking rejected",
    });
    setOpenDialog(false);
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
          Manage Maid Bookings
        </Typography>
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
                  <TableCell>Name</TableCell>
                  <TableCell>Mobile Number</TableCell>
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
                  bookings?.map((booking) => (
                    <TableRow
                      key={booking._id}
                      hover
                      onClick={() => handleRowClick(booking)}
                      sx={{
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "#f5f5f5",
                        },
                      }}
                    >
                      <TableCell>
                        {booking?.userDetails?.name || "N/A"}
                      </TableCell>
                      <TableCell>
                        {booking?.userDetails?.mobile || "N/A"}
                      </TableCell>
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
                  ))
                )}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={bookings?.length || 0}
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
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "red",
            borderRadius: 3,
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "white",
            borderBottom: "2px solid #FFA000",
            py: 2,
            px: 3,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="h6"
              sx={{
                color: "black",
                fontWeight: "bold",
              }}
            >
              Maid Availability Details
            </Typography>
            <IconButton
              onClick={() => setOpenDialog(false)}
              sx={{
                color: "black",
                "&:hover": {
                  backgroundColor: "rgba(93, 64, 55, 0.1)",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            backgroundColor: "white",
            p: 0,
          }}
        >
          {selectedBooking && maidAvailability && (
            <Grid container spacing={0}>
              {/* Maid Profile Section */}
              <Grid
                item
                xs={12}
                md={4}
                sx={{
                  backgroundColor: "white",
                  p: 3,
                  borderRight: { md: "1px solid #ffe0b2" },
                  display: "flex",
                  flexDirection: "row",
                  gap: 2,
                  overflowX: "auto",
                }}
              >
                {/* Profile Section */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    minWidth: 300,
                    flexShrink: 0,
                    backgroundColor: "white",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Avatar
                    src={maidAvailability.maidDetails?.picture}
                    sx={{
                      width: 70,
                      height: 70,
                      border: "2px solid black",
                      fontSize: "2.3rem",
                      backgroundColor: "white",
                      color: "black",
                      marginLeft : 2,
                    }}
                  >
                    {!maidAvailability.maidDetails?.picture &&
                      maidAvailability.maidDetails?.name
                        ?.charAt(0)
                        .toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ color: "black", fontWeight: "bold" }}
                    >
                      {maidAvailability.maidDetails?.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "black", mb: 0.5 }}
                    >
                      {maidAvailability.maidDetails?.area},{" "}
                      {maidAvailability.maidDetails?.city}
                    </Typography>
                    <Chip
                      icon={<PhoneIcon fontSize="small" color="black"/>}
                      label={maidAvailability.maidDetails?.mobile}
                      size="small"
                      sx={{
                        backgroundColor: "#ffb74d",
                        color: "black",
                      }}
                    />
                  </Box>
                </Box>

                {/* Maid Information */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    minWidth: 200,
                    backgroundColor: "white",
                    borderRadius: 2,
                    flexShrink: 0,
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "black", fontWeight: "bold", mb: 1 }}
                  >
                    Maid Information
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <CurrencyRupeeIcon
                      color="black"
                      fontSize="small"
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="body2" sx={{ color: "black" }}>
                      ₹
                      {maidAvailability.maidDetails?.salaryPerMonth?.toLocaleString(
                        "en-IN"
                      )}
                      /month
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <WorkIcon color="black" fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2" sx={{ color: "black" }}>
                      {maidAvailability.maidDetails?.experience || "N/A"}
                    </Typography>
                  </Box>
                </Paper>

                {/* Availability */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    minWidth: 200,
                    // backgroundColor: maidAvailability.isAvailable
                    //   ? "rgba(76, 175, 80, 0.2)"
                    //   : "rgba(244, 67, 54, 0.2)",
                    backgroundColor: "white",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    borderLeft: `3px solid ${
                      maidAvailability.isAvailable ? "#7cb342" : "#e53935"
                    }`,
                    borderRadius: 2,
                    flexShrink: 0,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "black", fontWeight: "bold", mb: 1 }}
                  >
                    Availability
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: maidAvailability.isAvailable
                          ? "#7cb342"
                          : "#e53935",
                        mr: 1,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: maidAvailability.isAvailable
                          ? "#33691e"
                          : "#c62828",
                      }}
                    >
                      {maidAvailability.isAvailable ? "Available" : "Booked"}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: "black" }}>
                    {maidAvailability.activeCount}/3 slots filled
                  </Typography>
                </Paper>

                {/* Services */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    minWidth: 200,
                    backgroundColor: "white",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    borderRadius: 2,
                    flexShrink: 0,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "black", fontWeight: "bold", mb: 1 }}
                  >
                    Services
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    {maidAvailability.maidDetails?.services
                      ?.slice(0, 3)
                      .map((service, index) => (
                        <Chip
                          key={index}
                          label={service.name}
                          size="small"
                          sx={{
                            backgroundColor: "#ffe0b2",
                            color: "black",
                            whiteSpace: "nowrap",
                          }}
                        />
                      ))}
                    {maidAvailability.maidDetails?.services?.length > 3 && (
                      <Typography variant="caption" sx={{ color: "#8d6e63" }}>
                        +{maidAvailability.maidDetails?.services.length - 3}{" "}
                        more
                      </Typography>
                    )}
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} md={8} sx={{ p: 3 }}>
                {/* Current Bookings Section */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    mb: 3,
                    backgroundColor: "white",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: "black",
                      fontWeight: "bold",
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <AssignmentIcon color="black" sx={{ mr: 1 }} />
                    Current Bookings
                  </Typography>

                  {maidAvailability.activeBookings.length > 0 ? (
                    <List dense sx={{ py: 0 }}>
                      {maidAvailability.activeBookings.map((booking) => (
                        <ListItem
                          key={booking._id}
                          sx={{
                            py: 1.5,
                            px: 2,
                            mb: 1,
                            backgroundColor: "white",
                            borderRadius: 1,
                            borderLeft: "3px solid #ffb74d",
                            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                            // border : "2px solid #ffb74d",
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar
                              src={booking.userDetails?.picture}
                              sx={{ width: 40, height: 40 }}
                            >
                              {!booking.userDetails?.picture &&
                                booking.userDetails?.name
                                  ?.charAt(0)
                                  .toUpperCase()}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography
                                variant="subtitle2"
                                sx={{ color: "black" }}
                              >
                                {booking.userDetails?.name}
                              </Typography>
                            }
                            secondary={
                              <>
                                <Typography
                                  variant="caption"
                                  sx={{ color: "black", display: "block" }}
                                >
                                  {dayjs(booking.startDate).format(
                                    "DD MMM YYYY"
                                  )}{" "}
                                  -{" "}
                                  {dayjs(booking.endDate).format("DD MMM YYYY")}
                                </Typography>
                                <Chip
                                  label={booking.status}
                                  size="small"
                                  sx={{
                                    mt: 0.5,
                                    backgroundColor:
                                      booking.status === "available"
                                        ? "#e8f5e9"
                                        : booking.status === "in-progress"
                                        ? "#fff3e0"
                                        : "#e8eaf6",
                                    color:
                                      booking.status === "available"
                                        ? "#2e7d32"
                                        : booking.status === "in-progress"
                                        ? "#ff6f00"
                                        : "#3949ab",
                                    fontWeight: "medium",
                                    textTransform: "capitalize",
                                    border: "1px solid",
                                    borderColor:
                                      booking.status === "available"
                                        ? "#c8e6c9"
                                        : booking.status === "in-progress"
                                        ? "#ffe0b2"
                                        : "#c5cae9",
                                  }}
                                />
                              </>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Box
                      sx={{
                        p: 2,
                        textAlign: "center",
                        backgroundColor: "white",
                        border: "1px dashed #ffe0b2",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body2" sx={{ color: "black" }}>
                        No active bookings currently
                      </Typography>
                    </Box>
                  )}
                </Paper>

                {/* <Divider
                  sx={{
                    my: 2,
                    borderColor: "#ffb74d",
                    borderWidth: 1,
                  }}
                /> */}

                {/* Requested Booking Section */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    mb: 3,
                    backgroundColor: "white",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                    borderRadius: 2,
                  }}
                >
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "black",
                      fontWeight: "bold",
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <EventNoteIcon color="black" sx={{ mr: 1 }} />
                    Requested Booking Details
                  </Typography>

                  <Grid container spacing={2}>
                    {/* First Row - Full width boxes */}
                    <Grid item xs={12} sm={6}>
                      <DetailCard
                        icon={<PersonIcon color="black" />}
                        title="Customer"
                        value={selectedBooking.userDetails?.name}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <DetailCard
                        icon={<PhoneIcon color="black" />}
                        title="Mobile"
                        value={selectedBooking.userDetails?.mobile}
                      />
                    </Grid>

                    {/* Second Row - Spaced boxes */}
                    <Grid item xs={12} sm={6}>
                      <DetailCard
                        icon={<EventAvailableIcon color="black" />}
                        title="Start Date"
                        value={dayjs(selectedBooking.startDate).format(
                          "DD MMM YYYY"
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <DetailCard
                        icon={<EventBusyIcon color="black" />}
                        title="End Date"
                        value={dayjs(selectedBooking.endDate).format(
                          "DD MMM YYYY"
                        )}
                      />
                    </Grid>

                    {/* Third Row - Spaced boxes */}
                    <Grid item xs={12} sm={6}>
                      <DetailCard
                        icon={<CalendarTodayIcon color="black" />}
                        title="Duration"
                        value={`${selectedBooking.durationMonths} months`}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <DetailCard
                        icon={<CurrencyRupeeIcon color="black" />}
                        title="Total Amount"
                        value={`₹${selectedBooking.totalAmount?.toLocaleString(
                          "en-IN"
                        )}`}
                      />
                    </Grid>

                    {/* Services - Full width at bottom */}
                    <Grid item xs={12}>
                      <DetailCard
                        icon={<BuildIcon color="black" />}
                        title="Services"
                        value={selectedBooking.services?.join(", ") || "N/A"}
                      />
                    </Grid>
                  </Grid>
                </Box>
                </Paper>
              </Grid>
            </Grid>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            backgroundColor: "white",
            // boxShadow: "0px -2px 4px rgba(0, 0, 0, 0.1)",
            px: 3,
            py: 2,
            borderTop: "1px solid #ffb74d",
          }}
        >
          <Button
            onClick={handleReject}
            variant="outlined"
            startIcon={<CancelIcon />}
            sx={{
              color: "#c62828",
              borderColor: "#ef9a9a",
              "&:hover": {
                backgroundColor: "rgba(198, 40, 40, 0.04)",
                borderColor: "#e53935",
              },
              "&:disabled": {
                color: "#ef9a9a",
                borderColor: "#ffcdd2",
              },
            }}
            disabled={selectedBooking?.status !== "pending"}
          >
            Reject
          </Button>
          <Button
            onClick={handleApprove}
            variant="contained"
            startIcon={<CheckCircleIcon />}
            sx={{
              backgroundColor: "#2e7d32",
              "&:hover": {
                backgroundColor: "#1b5e20",
              },
              "&:disabled": {
                backgroundColor: "#a5d6a7",
              },
            }}
            disabled={
              !maidAvailability?.isAvailable ||
              selectedBooking?.status !== "pending"
            }
          >
            Approve
          </Button>
        </DialogActions>
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

export default ManageBookings;
