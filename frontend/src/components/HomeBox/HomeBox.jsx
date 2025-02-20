import React from "react";
import styles from "./HomeBox.module.css";

function HomeBox({ type, icon, title, describe, image }) {
  return (
    <div
      className={
        type === "feature"
          ? styles.box_wrapper
          : `${styles.box_wrapper} ${styles.blog_box}`
      }
    >
      {type === "feature" ? (
        <div>
          <div className={styles.icon}>{icon}</div>
          <h2>{title}</h2>
          <p>{describe}</p>
        </div>
      ) : (
        <div>
          <div className={styles.image}>
            <img src={image} alt="blog-image" />
          </div>
          <h2>{title}</h2>
          <p>{describe}</p>
        </div>
      )}
    </div>
  );
}

export default HomeBox;
