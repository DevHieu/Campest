import React from "react";
import styles from "./Navbar.module.css";
import logo from "../../assets/images/logo.png";
import { Link } from "react-router-dom";

export default function Navbar() {
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
          <Link to="/schedule" className={styles.nav_list_items}>
            Tìm bãi cắm trại
          </Link>
          <Link to="/schedule" className={styles.nav_list_items}>
            Tìm đồ cắm trại
          </Link>
          <Link to="/schedule" className={styles.nav_list_items}>
            Lên Lịch trình
          </Link>
        </div>
      </div>
    </div>
  );
}
