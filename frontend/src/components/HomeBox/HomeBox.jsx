import React from "react";
import styles from "./HomeBox.module.css";
import { Link } from "react-router-dom";

function HomeBox({ type, icon, title, describe, image, link }) {
  return (
    <Link
      to={link}
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
            <img src={image} alt="blog-image" loading="lazy" />
          </div>
          <h2>{title}</h2>
          <p>{describe}</p>
        </div>
      )}
    </Link>
  );
}

export default HomeBox;
