// src/layouts/MainLayout.jsx
import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  CleaningServices as CleaningIcon,
  AssignmentTurnedIn as BookingsIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { NavLink } from "react-router-dom";
import { PersonOutline } from "@mui/icons-material";  
import { useSelector } from "react-redux";

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" , roles: ["view_dashboard"]},
  { text: "Book a Maid", icon: <CleaningIcon />, path: "/book-maid", roles: ["book_maid"]},
  { text: "My Bookings", icon: <BookingsIcon />, path: "/my-bookings", roles: ["view_bookings"]},
  { text: "Manage Bookings", icon: <BookingsIcon />, path: "/admin/bookings" , roles: ["manage_bookings"]},
  { text: "Manage Maids", icon: <CleaningIcon />, path: "/admin/maids" , roles: ["manage_maids"]},
  {text : "Profile", icon: <PersonOutline />, path: "/profile",roles: ["view_profile"],},
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // const { userData } = useSelector((state) => state.profile);
  const {user} = useSelector((state) => state.auth);
  const userRoles = user?.roles || [];
  const isSuperAdmin = user?.userType === "superadmin";

  console.log("userRoles:", userRoles);
  console.log("isSuperAdmin:", isSuperAdmin);

  const filteredMenuItems = menuItems.filter((item) => {
    return isSuperAdmin || item?.roles?.some((role) => userRoles.includes(role));
  });

  console.log("filteredMenuItems:", filteredMenuItems);

  return (
    <Box
      sx={{ display: "flex", minHeight: "100vh", minWidth: "100vw" }}
    >
      <Box
        sx={{
          width: collapsed ? 70 : 240,
          background: "linear-gradient(180deg, #FFA000, #FFC107)",
          color: "white",
          transition: "width 0.3s",
          boxShadow: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: collapsed ? "center" : "flex-start",
          p: 1,
        }}
      >
        <IconButton
          onClick={() => setCollapsed(!collapsed)}
          sx={{ color: "white", alignSelf: "flex-end" }}
        >
          <MenuIcon />
        </IconButton>

        {collapsed ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
              mb: 3,
              px: collapsed ? 0 : 1,
              gap: 1.5,
              transition: "all 0.3s ease",
            }}
          >
            <img
              src="https://media-hosting.imagekit.io/01d51a6530cc472f/download.jpeg?Expires=1839836883&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=mrSDtKCqi5lzR-hM0PpVqnfH0LrVrnIhm2biYJapfFxYj71B7Nva8skz0POjh1zrTm6PqMToGmyVla3GuItbU8d4InCTIdtr7qv8tihwSjriWOYDAQ8Qb1IrMLUR~2vBYxhVOUCCD29Wfzq9RhLfWBH7U3eyDbc0dkfbclGqtaik2qI8lqVjkcRpGsB3YB95xGVdKXDY7-70tLq19F0GT1hLA5dZteGF87Jt9j2jB~ODyiIOb5NYuktsm~2pAtBjAztJGkLqlBJK5c1MvlVNF7DffbhJsj38SSWP7BIacNKErABZEHRY-yrxOO9ZVf2HRpjlARNxrnHoZFyVgJCGTQ__"
              alt="MaidPro Logo"
              style={{ width: 36, height: 36, borderRadius: 8 }}
            />
            {!collapsed && (
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: "white" }}
              >
                MaidPro
              </Typography>
            )}
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
              mb: 3,
              px: collapsed ? 0 : 1,
              gap: 1.5,
              transition: "all 0.3s ease",
            }}
          >
            <img
              src="https://media-hosting.imagekit.io/01d51a6530cc472f/download.jpeg?Expires=1839836883&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=mrSDtKCqi5lzR-hM0PpVqnfH0LrVrnIhm2biYJapfFxYj71B7Nva8skz0POjh1zrTm6PqMToGmyVla3GuItbU8d4InCTIdtr7qv8tihwSjriWOYDAQ8Qb1IrMLUR~2vBYxhVOUCCD29Wfzq9RhLfWBH7U3eyDbc0dkfbclGqtaik2qI8lqVjkcRpGsB3YB95xGVdKXDY7-70tLq19F0GT1hLA5dZteGF87Jt9j2jB~ODyiIOb5NYuktsm~2pAtBjAztJGkLqlBJK5c1MvlVNF7DffbhJsj38SSWP7BIacNKErABZEHRY-yrxOO9ZVf2HRpjlARNxrnHoZFyVgJCGTQ__"
              alt="MaidPro Logo"
              style={{ width: 36, height: 36, borderRadius: 8 }}
            />
            {!collapsed && (
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: "white" }}
              >
                MaidPro
              </Typography>
            )}
          </Box>
        )}

        <List sx={{ width: "100%" }}>
          {filteredMenuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Tooltip
                title={collapsed ? item.text : ""}
                placement="right"
                key={item.text}
              >
                <ListItemButton
                  component={NavLink}
                  to={item.path}
                  sx={{
                    my: 1,
                    borderRadius: 2,
                    backgroundColor: isActive ? "white" : "transparent",
                    color: isActive ? "#FFA000" : "white",
                    "&:hover": {
                      backgroundColor: isActive
                        ? "white"
                        : "rgba(255,255,255,0.2)",
                    },
                    justifyContent: collapsed ? "center" : "flex-start",
                    px: 2,
                    transition: "all 0.3s ease",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? "#FFA000" : "white",
                      minWidth: 0,
                      mr: collapsed ? 0 : 2,
                      justifyContent: "center",
                      transition: "margin 0.3s ease",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  {/* Instead of removing text, we fade/scale it */}
                  <ListItemText
                    primary={item.text}
                    sx={{
                      opacity: collapsed ? 0 : 1,
                      transform: collapsed ? "scaleX(0)" : "scaleX(1)",
                      transformOrigin: "left",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      transition: "opacity 0.3s ease, transform 0.3s ease",
                    }}
                  />
                </ListItemButton>
              </Tooltip>
            );
          })}
        </List>
      </Box>
      <Box>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Sidebar;
