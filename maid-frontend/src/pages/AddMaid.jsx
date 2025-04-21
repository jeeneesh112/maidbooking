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
      setSnackbarMessage("Maid added successfully!");
      setSnackbarOpen(true);
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

      {/* <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          component={Paper}
          elevation={6}
          sx={{
            maxWidth: 600,
            mx: 'auto',
            mt: '10vh',
            p: 4,
            outline: 'none',
          }}
        >
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Add New Maid
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {[
                { label: 'Name', name: 'name' },
                { label: 'Mobile', name: 'mobile' },
                { label: 'Picture URL', name: 'pic' },
                { label: 'City', name: 'city' },
                { label: 'State', name: 'state' },
                { label: 'Area', name: 'area' },
                { label: 'Pincode', name: 'pincode' },
                { label: 'Salary', name: 'salary' },
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
                  Add Maid
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal> */}

<Dialog
  open={modalOpen}
  onClose={() => setModalOpen(false)}
  fullWidth
  maxWidth="sm"
  PaperProps={{
    sx: {
      backgroundColor: '#fffdf5', // very light yellow
      p: 3,
    },
  }}
>
  <DialogTitle
    sx={{
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: '1.5rem',
      color: '#FFA000',
      pb: 1,
    }}
  >
    Add New Maid
  </DialogTitle>

  <Divider sx={{ mb: 2 }} />

  <DialogContent sx={{ px: 1 }}>
    <form id="add-maid-form" onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        {[
          { label: 'Name', name: 'name' },
          { label: 'Mobile', name: 'mobile' },
          { label: 'Picture URL', name: 'pic' },
          { label: 'City', name: 'city' },
          { label: 'State', name: 'state' },
          { label: 'Area', name: 'area' },
          { label: 'Pincode', name: 'pincode' },
          { label: 'Salary', name: 'salary' },
        ].map((field) => (
          <Grid item xs={12} sm={6} key={field.name}>
            <Typography
              variant="subtitle2"
              sx={{ mb: 0.5, fontWeight: 500, color: '#444' }}
            >
              {field.label}
            </Typography>
            <TextField
              name={field.name}
              value={maidData[field.name]}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              size="small"
            />
          </Grid>
        ))}
      </Grid>
    </form>
  </DialogContent>

  <DialogActions
    sx={{
      justifyContent: 'center',
      pt: 2,
    }}
  >
    <Button
      onClick={() => setModalOpen(false)}
      variant="outlined"
      sx={{
        borderColor: '#FFA000',
        color: '#FFA000',
        '&:hover': {
          backgroundColor: '#ffe0a3',
          borderColor: '#FFA000',
        },
      }}
    >
      Cancel
    </Button>
    <Button
      type="submit"
      form="add-maid-form"
      variant="contained"
      sx={{
        backgroundColor: '#FFA000',
        color: '#fff',
        '&:hover': {
          backgroundColor: '#e38e00',
        },
        ml: 2,
      }}
    >
      Add Maid
    </Button>
  </DialogActions>
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
