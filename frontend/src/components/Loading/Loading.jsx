import React from "react";
import styles from "./Loading.module.css";
import carIcon from "../../assets/images/car_icon.png";

function Loading() {
  return (
    <div className={styles.loading_container}>
      <div className={styles.car_wrapper}>
        <img src={carIcon} alt="loading car" className={styles.car} />

        {/* Smoke */}
        <span className={`${styles.smoke} ${styles.s1}`} />
        <span className={`${styles.smoke} ${styles.s2}`} />
        <span className={`${styles.smoke} ${styles.s3}`} />
      </div>

      <p className={styles.text}>
        Đang tải
        <span className={styles.dots}>
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </p>
    </div>
  );
}

export default Loading;
