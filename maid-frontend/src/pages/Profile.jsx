import { Box, Button, Divider, Grid, Paper, Typography } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../features/profile/profileSlice";

const Profile = () => {
  const { token } = useSelector((state) => state.auth);
  const userId = localStorage.getItem("userId");

  const dispatch = useDispatch();

  useEffect(() => {
    if (userId && token) {
      dispatch(fetchProfile(userId));
    }
  }, [dispatch, userId, token]);

  const { userData, loading, error } = useSelector((state) => state.profile);

  console.log("error:", error);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!userData) return <div>No user data found</div>;

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
          maxWidth: "1100px",
          mx: "auto",
          display: "flex",
          gap: 5,
          flexDirection: { xs: "column", md: "row" },
          backgroundColor: "#ffffff",
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          p: 4,
        }}
      >
        {/* Profile Image */}
        <Box sx={{ flexShrink: 0 }}>
          <Box
            // component="img"
            // src={userData.pic || "https://via.placeholder.com/150"}
            // alt="Profile"
            sx={{
              width: 180,
              height: 180,
              borderRadius: 2,
              backgroundColor: "#ffe0b2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fb8c00",
              fontWeight: "bold",
              fontSize: "3.5rem",
              textTransform: "uppercase",
            }}
          >
            {userData.name[0]}
          </Box>
        </Box>

        {/* Profile Info */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            color="#FFA000"
          >
            {userData.name}
          </Typography>
          <Typography variant="subtitle1" gutterBottom color="text.secondary">
            {userData.email}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            {userData.mobile && (
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" color="text.primary">
                  <strong>Phone:</strong> {userData.mobile}
                </Typography>
              </Grid>
            )}
            {userData.area && (
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" color="text.primary">
                  <strong>Area:</strong> {userData.area}
                </Typography>
              </Grid>
            )}
            {userData.city && (
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" color="text.primary">
                  <strong>City:</strong> {userData.city}
                </Typography>
              </Grid>
            )}
            {userData.state && (
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" color="text.primary">
                  <strong>State:</strong> {userData.state}
                </Typography>
              </Grid>
            )}
            {userData.pincode && (
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" color="text.primary">
                  <strong>Zip:</strong> {userData.pincode}
                </Typography>
              </Grid>
            )}
          </Grid>

          <Box sx={{ display: "flex", gap: 2, mt: 4, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#FFA000",
                color: "#fff",
                borderRadius: 2,
                px: 3,
                "&:hover": { backgroundColor: "#fb8c00" },
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
              // onClick={onUpdateProfile}
            >
              Update Profile
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: "#FFA000",
                color: "#FFA000",
                borderRadius: 2,
                px: 3,
                "&:hover": {
                  backgroundColor: "#fff3e0",
                  borderColor: "#fb8c00",
                },
              }}
              // onClick={onChangePassword}
            >
              Change Password
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Profile;
