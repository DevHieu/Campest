import React, { useEffect } from "react";
import styles from "./Navbar.module.css";
import logo from "../../assets/images/logo.png";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

import Avatar from "@mui/material/Avatar";

export default function Navbar() {
  const { user } = useAuth();

  const firstLetter = (name) => {
    return name.substring(0, 1).toUpperCase();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>
        </div>
        <div className={styles.nav_list}>
          <Link to="/survival" className={styles.nav_list_items}>
            Kĩ năng sinh tồn
          </Link>
          <Link to="/campsite" className={styles.nav_list_items}>
            Tìm bãi cắm trại
          </Link>
          <Link to="/schedule" className={styles.nav_list_items}>
            Tìm đồ cắm trại
          </Link>
          <Link to="/schedule" className={styles.nav_list_items}>
            Lên Lịch trình
          </Link>
          {user === null ? (
            <Link to="/login" className={styles.nav_list_items}>
              Đăng nhập
            </Link>
          ) : (
            <Link to="/user" className={styles.nav_list_avatar}>
              <Avatar sx={{ bgcolor: "#20321e" }} className={styles.avatar}>
                {firstLetter(user.username)}
              </Avatar>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
