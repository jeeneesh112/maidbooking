import { Box, Typography } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../features/profile/profileSlice";

const Profile = () => {
  const { user, loading } = useSelector((state) => state.auth);

  const userId = localStorage.getItem("userId");

  console.log("error", user);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      fetchProfile(userId)
    );
  }, [dispatch, userId]);

  if (loading) return <div>Loading...</div>;

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4">Profile</Typography>
      {/* <Box sx={{ marginTop: "20px" }}>
        <Typography variant="h6">Name: {user.name}</Typography>
        <Typography variant="h6">Email: {user.email}</Typography>
        <Typography variant="h6">Phone: {user.phone}</Typography>
      </Box> */}
    </Box>
  );
};

export default Profile;
