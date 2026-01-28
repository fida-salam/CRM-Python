// import React, { useState } from "react";
// import {
//   Box,
//   Drawer,
//   AppBar,
//   Toolbar,
//   Typography,
//   IconButton,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Divider,
//   Button,
// } from "@mui/material";
// import { useNavigate, useLocation } from "react-router-dom";
// import MenuIcon from "@mui/icons-material/Menu";
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import PeopleIcon from "@mui/icons-material/People";
// import BusinessIcon from "@mui/icons-material/Business";
// import GroupIcon from "@mui/icons-material/Group";
// import ChatIcon from "@mui/icons-material/Chat";
// import DashboardIcon from "@mui/icons-material/Dashboard";
// import LogoutIcon from "@mui/icons-material/Logout";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// import SettingsIcon from "@mui/icons-material/Settings";
// import { useAuth } from "../../contexts/AuthContext";

// const drawerWidth = 240;

// function Layout({ children }) {
//   const [open, setOpen] = useState(true);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user, logout } = useAuth();

//   const handleDrawerToggle = () => {
//     setOpen(!open);
//   };

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   // Define all possible menu items with required roles
//   const allMenuItems = [
//     {
//       text: "Dashboard",
//       icon: <DashboardIcon />,
//       path: "/dashboard",
//       roles: ["super_admin", "admin", "user"], // All roles can see dashboard
//     },
//     {
//       text: "Customers",
//       icon: <PeopleIcon />,
//       path: "/customers",
//       roles: ["super_admin", "admin", "user"], // All roles can see customers
//     },
//     {
//       text: "Interactions",
//       icon: <ChatIcon />,
//       path: "/interactions",
//       roles: ["super_admin", "admin", "user"], // All roles can see interactions
//     },
//     {
//       text: "Companies",
//       icon: <BusinessIcon />,
//       path: "/companies",
//       roles: ["super_admin", "admin"], // Only admins can see companies
//     },
//     {
//       text: "Users",
//       icon: <GroupIcon />,
//       path: "/users",
//       roles: ["super_admin", "admin"], // Only admins can see users
//     },
//     {
//       text: "Profile",
//       icon: <AccountCircleIcon />,
//       path: "/profile",
//       roles: ["super_admin", "admin", "user"], // All roles can see profile
//     },
//     {
//       text: "Settings",
//       icon: <SettingsIcon />,
//       path: "/settings",
//       roles: ["super_admin", "admin"], // Only admins can see settings
//     },
//   ];

//   // Filter menu items based on user role
//   const getUserMenuItems = () => {
//     const userRole = user?.role || "user"; // Default to 'user' if no role

//     return allMenuItems.filter((item) => {
//       // Check if user's role is in the allowed roles for this menu item
//       return item.roles.includes(userRole);
//     });
//   };

//   // Get filtered menu items for current user
//   const menuItems = getUserMenuItems();

//   return (
//     <Box sx={{ display: "flex" }}>
//       {/* Sidebar Drawer */}
//       <Drawer
//         variant="permanent"
//         sx={{
//           width: open ? drawerWidth : 64,
//           flexShrink: 0,
//           "& .MuiDrawer-paper": {
//             width: open ? drawerWidth : 64,
//             boxSizing: "border-box",
//             transition: (theme) =>
//               theme.transitions.create("width", {
//                 easing: theme.transitions.easing.sharp,
//                 duration: theme.transitions.duration.enteringScreen,
//               }),
//             overflowX: "hidden",
//           },
//         }}
//       >
//         {/* Spacer for top alignment */}
//         <Toolbar>
//           <Typography variant="h6" noWrap>
//             {open ? "CRM" : ""}
//           </Typography>
//           {open && user?.role && (
//             <Typography
//               variant="caption"
//               sx={{
//                 ml: 1,
//                 px: 1,
//                 py: 0.5,
//                 borderRadius: 1,
//                 backgroundColor:
//                   user.role === "super_admin"
//                     ? "primary.main"
//                     : user.role === "admin"
//                       ? "secondary.main"
//                       : "grey.500",
//                 color: "white",
//                 fontSize: "0.7rem",
//               }}
//             >
//               {user.role.replace("_", " ")}
//             </Typography>
//           )}
//         </Toolbar>
//         <Divider />
//         <List>
//           {menuItems.map((item) => (
//             <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
//               <ListItemButton
//                 selected={location.pathname === item.path}
//                 onClick={() => navigate(item.path)}
//                 sx={{
//                   minHeight: 48,
//                   justifyContent: open ? "initial" : "center",
//                   px: 2.5,
//                   "&.Mui-selected": {
//                     backgroundColor: "primary.light",
//                     "&:hover": {
//                       backgroundColor: "primary.light",
//                     },
//                   },
//                 }}
//               >
//                 <ListItemIcon
//                   sx={{
//                     minWidth: 0,
//                     mr: open ? 3 : "auto",
//                     justifyContent: "center",
//                     color:
//                       location.pathname === item.path
//                         ? "primary.main"
//                         : "inherit",
//                   }}
//                 >
//                   {item.icon}
//                 </ListItemIcon>
//                 <ListItemText
//                   primary={item.text}
//                   sx={{
//                     opacity: open ? 1 : 0,
//                     color:
//                       location.pathname === item.path
//                         ? "primary.main"
//                         : "inherit",
//                   }}
//                 />
//               </ListItemButton>
//             </ListItem>
//           ))}
//         </List>
//       </Drawer>

//       {/* AppBar */}
//       <Box sx={{ flexGrow: 1 }}>
//         <AppBar
//           position="fixed"
//           sx={{
//             width: open ? `calc(100% - ${drawerWidth}px)` : `calc(100% - 64px)`,
//             ml: open ? `${drawerWidth}px` : "64px",
//             transition: (theme) =>
//               theme.transitions.create(["width", "margin"], {
//                 easing: theme.transitions.easing.sharp,
//                 duration: theme.transitions.duration.enteringScreen,
//               }),
//           }}
//         >
//           <Toolbar>
//             <IconButton
//               color="inherit"
//               aria-label="toggle drawer"
//               onClick={handleDrawerToggle}
//               edge="start"
//               sx={{
//                 marginRight: 2,
//                 backgroundColor: "rgba(255, 255, 255, 0.1)",
//                 "&:hover": {
//                   backgroundColor: "rgba(255, 255, 255, 0.2)",
//                 },
//               }}
//             >
//               {open ? <ChevronLeftIcon /> : <MenuIcon />}
//             </IconButton>
//             <Typography
//               variant="h6"
//               noWrap
//               component="div"
//               sx={{ flexGrow: 1 }}
//             >
//               CRM System
//             </Typography>

//             {/* User Info and Logout */}
//             <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//               <IconButton
//                 onClick={() => navigate("/profile")}
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 1,
//                   textTransform: "none",
//                   color: "inherit",
//                   "&:hover": {
//                     backgroundColor: "action.hover",
//                   },
//                 }}
//               >
//                 <AccountCircleIcon />
//                 <Box sx={{ textAlign: "left" }}>
//                   <Typography variant="body1" sx={{ fontWeight: "bold" }}>
//                     {user?.username || "User"}
//                   </Typography>
//                   <Typography
//                     variant="caption"
//                     sx={{ display: "block", opacity: 0.8 }}
//                   >
//                     {user?.company_name || "No Company"}
//                   </Typography>
//                 </Box>
//               </IconButton>

//               <Button
//                 color="inherit"
//                 startIcon={<LogoutIcon />}
//                 onClick={handleLogout}
//                 sx={{
//                   backgroundColor: "rgba(255, 255, 255, 0.1)",
//                   "&:hover": {
//                     backgroundColor: "rgba(255, 255, 255, 0.2)",
//                   },
//                 }}
//               >
//                 {open ? "Logout" : ""}
//               </Button>
//             </Box>
//           </Toolbar>
//         </AppBar>

//         {/* Main Content */}
//         <Box
//           component="main"
//           sx={{
//             flexGrow: 1,
//             p: 3,
//             mt: 8,
//           }}
//         >
//           {children}
//         </Box>
//       </Box>
//     </Box>
//   );
// }

// export default Layout;



import React, { useState } from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";
import GroupIcon from "@mui/icons-material/Group";
import ChatIcon from "@mui/icons-material/Chat";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import { useAuth } from "../../contexts/AuthContext";
import CompanySelector from "./CompanySelector"; // NEW IMPORT

const drawerWidth = 240;

function Layout({ children }) {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Define all possible menu items with required roles
  const allMenuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/dashboard",
      roles: ["super_admin", "admin", "user", "manager"], // All roles can see dashboard
    },
    {
      text: "Customers",
      icon: <PeopleIcon />,
      path: "/customers",
      roles: ["super_admin", "admin", "user", "manager"], // All roles can see customers
    },
    {
      text: "Interactions",
      icon: <ChatIcon />,
      path: "/interactions",
      roles: ["super_admin", "admin", "user", "manager"], // All roles can see interactions
    },
    {
      text: "Companies",
      icon: <BusinessIcon />,
      path: "/companies",
      roles: ["super_admin", "admin"], // Only admins can see companies
    },
    {
      text: "Users",
      icon: <GroupIcon />,
      path: "/users",
      roles: ["super_admin", "admin", "manager"], // Admins and managers can see users
    },
    {
      text: "Profile",
      icon: <AccountCircleIcon />,
      path: "/profile",
      roles: ["super_admin", "admin", "user", "manager"], // All roles can see profile
    },
    {
      text: "Settings",
      icon: <SettingsIcon />,
      path: "/settings",
      roles: ["super_admin", "admin"], // Only admins can see settings
    },
  ];

  // Filter menu items based on user role in current company
  const getUserMenuItems = () => {
    const userRole = user?.role || "user"; // Default to 'user' if no role

    return allMenuItems.filter((item) => {
      // Check if user's role is in the allowed roles for this menu item
      return item.roles.includes(userRole);
    });
  };

  // Get filtered menu items for current user
  const menuItems = getUserMenuItems();

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: open ? drawerWidth : 64,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? drawerWidth : 64,
            boxSizing: "border-box",
            transition: (theme) =>
              theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            overflowX: "hidden",
          },
        }}
      >
        {/* Spacer for top alignment */}
        <Toolbar>
          <Typography variant="h6" noWrap>
            {open ? "CRM" : ""}
          </Typography>
          {open && user?.role && (
            <Typography
              variant="caption"
              sx={{
                ml: 1,
                px: 1,
                py: 0.5,
                borderRadius: 1,
                backgroundColor:
                  user.role === "super_admin"
                    ? "primary.main"
                    : user.role === "admin"
                      ? "secondary.main"
                      : user.role === "manager"
                        ? "info.main"
                        : "grey.500",
                color: "white",
                fontSize: "0.7rem",
              }}
            >
              {user.role.replace("_", " ")}
            </Typography>
          )}
        </Toolbar>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  "&.Mui-selected": {
                    backgroundColor: "primary.light",
                    "&:hover": {
                      backgroundColor: "primary.light",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color:
                      location.pathname === item.path
                        ? "primary.main"
                        : "inherit",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    opacity: open ? 1 : 0,
                    color:
                      location.pathname === item.path
                        ? "primary.main"
                        : "inherit",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* AppBar */}
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="fixed"
          sx={{
            width: open ? `calc(100% - ${drawerWidth}px)` : `calc(100% - 64px)`,
            ml: open ? `${drawerWidth}px` : "64px",
            transition: (theme) =>
              theme.transitions.create(["width", "margin"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="toggle drawer"
              onClick={handleDrawerToggle}
              edge="start"
              sx={{
                marginRight: 2,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
              }}
            >
              {open ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1 }}
            >
              CRM System
            </Typography>

            {/* NEW: Company Selector */}
            <CompanySelector />

            {/* User Info and Logout */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton
                onClick={() => navigate("/profile")}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  textTransform: "none",
                  color: "inherit",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <AccountCircleIcon />
                <Box sx={{ textAlign: "left" }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    {user?.username || "User"}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ display: "block", opacity: 0.8 }}
                  >
                    {user?.default_company?.name || user?.company_name || "No Company"}
                  </Typography>
                </Box>
              </IconButton>

              <Button
                color="inherit"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                  },
                }}
              >
                {open ? "Logout" : ""}
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: 8,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default Layout;