import React from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import OtpVerify from "./pages/auth/OtpVerify";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AddMaid from "./pages/AddMaid";
import ManageBookings from "./pages/ManageBookings";
import PrivateRoute from "./utils/PrivateRoute";
import EditMaid from "./pages/EditMaid";
import Sidebar from "./pages/Sidebar";

const App = () => {
  return (
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
      <Route
        path="/dashboard"
        element={
          // <PrivateRoute>
            <Dashboard />
          // </PrivateRoute>
        }
      />
      <Route
        path="/admin"
        element={
          // <PrivateRoute>
            <AdminDashboard />
          // </PrivateRoute>
        }
      />
      <Route
        path="/admin/maids"
        element={
          // <PrivateRoute>
            <AddMaid />
          // </PrivateRoute>
        }
      />
      <Route
        path="/admin/bookings"
        element={
          // <PrivateRoute>
            <ManageBookings />
          // </PrivateRoute>
        }
      />
      <Route
        path="/admin/maids/edit/:maidId"
        element={
          // <PrivateRoute>
            <EditMaid />
          // </PrivateRoute>
        }
      />
      </Route>
    </Routes>
  );
};

export default App;
