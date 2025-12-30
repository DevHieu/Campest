import { useState } from "react";
import { Avatar, Menu, MenuItem, IconButton, Divider } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

const UserMenu = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const { logout } = useAuth();

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate("/login");
  };

  return (
    <>
      <IconButton onClick={handleOpen}>
        <Avatar sx={{ bgcolor: "#20321e" }}>
          {user?.username?.[0]?.toUpperCase()}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        disableScrollLock
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem component={Link} to="/user" onClick={handleClose}>
          👤 Profile
        </MenuItem>

        <MenuItem component={Link} to="/settings" onClick={handleClose}>
          ⚙️ Settings
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleLogout} sx={{ color: "red" }}>
          🚪 Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
