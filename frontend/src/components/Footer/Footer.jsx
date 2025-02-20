import React from "react";
import styles from "./Footer.module.css";
import logo from "../../assets/images/logo.png";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <div className={styles.information}>
      <img src={logo} alt="logo" className={styles.logo} />
      <div className={styles.stores}>
        <h2>Cửa Hàng Bán Lẻ</h2>
        <p>
          <b>Địa chỉ 1:</b> Hẻm tổ 4, 259/6 KP 1, Tân Chánh Hiệp, Quận 12, Hồ
          Chí Minh, Việt Nam
        </p>
      </div>
      <div className={styles.social}>
        <h2>Follow campest trên</h2>
        <div className={styles.social_items}>
          <a
            href="https://www.facebook.com/NatureHike.VN/?locale=vi_VN"
            target="_blank"
          >
            <FaFacebook size={25} />
          </a>
          <a href="https://www.instagram.com/naturehikestore/" target="_blank">
            <FaInstagram size={25} />
          </a>
          <a href="https://x.com/naturehikeeeee" target="_blank">
            <FaTwitter size={25} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
