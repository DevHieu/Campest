import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import axios from "axios";
import styles from "./SurvivalPage.module.css";
import { Link } from "react-router-dom";

export default function SchedulePage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiKey = import.meta.env.VITE_WP_API;

  useEffect(() => {
    axios
      .get(apiKey + "/posts")
      .then((res) => {
        setData(res.data.posts);
      })
      .then(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className={styles.wrapper}>
      {data.map((value) => {
        const sanitizedBlog = DOMPurify.sanitize(value.excerpt);

        return (
          <div key={value.ID} className={styles.blog_post}>
            <div className={styles.image_container}>
              <img src={value.post_thumbnail.URL} alt="image" loading="lazy" />
            </div>
            <h2>{value.title}</h2>
            <div
              dangerouslySetInnerHTML={{ __html: sanitizedBlog }}
              className={styles.excerpt}
            ></div>
            <Link
              to={{
                pathname: "post",
                search: "?postId=" + value.ID,
              }}
              className={`shadow_btn ${styles.more}`}
            >
              Đọc tiếp...
            </Link>
          </div>
        );
      })}
    </div>
  );
}
