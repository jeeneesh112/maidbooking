import React from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import OtpVerify from "./pages/auth/OtpVerify";
import Dashboard from "./pages/Dashboard";
import AddMaid from "./pages/AddMaid";
import ManageBookings from "./pages/ManageBookings";
import PrivateRoute from "./utils/PrivateRoute";
import EditMaid from "./pages/EditMaid";
import Sidebar from "./pages/Sidebar";
import Profile from "./pages/Profile";
import TokenExpiryWatcher from "./utils/TokenExpiryWatcher";
import Unauthorized from "./pages/Unauthorized";        

const App = () => {
  return (
    <>
      <TokenExpiryWatcher />
      <Routes>
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/otp" element={<OtpVerify />} />
        <Route path="/" element={<Login />} />

        <Route
          element={
            // <PrivateRoute>
            <Sidebar />
            // </PrivateRoute>
          }
        >
          {/* <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        /> */}
          <Route>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route>
            <Route path="/unauthorized" element={<Unauthorized />} />
          </Route>

          {/* <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
         </PrivateRoute>
        }
      /> */}

          <Route
          //  element={<PrivateRoute allowedRoles={["view_profile"]} />}
          >
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles={["manage_maids"]} />}>
            <Route path="/admin/maids" element={<AddMaid />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles={["manage_bookings"]} />}>
            <Route path="/admin/bookings" element={<ManageBookings />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles={["manage_maids"]} />}>
            <Route path="/admin/maids/edit/:maidId" element={<EditMaid />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
