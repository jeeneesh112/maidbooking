import { Box, Typography } from "@mui/material";
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!userData) return <div>No user data found</div>;

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4">Profile</Typography>
      <Box sx={{ marginTop: "20px" }}>
        <Typography variant="h6">Name: {userData.name  }</Typography>
        <Typography variant="h6">Email: {userData.email}</Typography>
        {userData.mobile && (
          <Typography variant="h6">Phone: {userData.mobile}</Typography>
        )}
        {userData.area && (
          <Typography variant="h6">Area: {userData.area}</Typography>
        )}
        {userData.city && (
          <Typography variant="h6">City: {userData.city}</Typography>
        )}
        {userData.state && (
          <Typography variant="h6">State: {userData.state}</Typography>
        )}
        {userData.pincode && (
          <Typography variant="h6">Zip: {userData.pincode}</Typography>
        )}
        
      </Box>
    </Box>
  );
};

export default Profile;