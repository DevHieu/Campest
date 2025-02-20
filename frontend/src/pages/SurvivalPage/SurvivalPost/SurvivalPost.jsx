import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./SurvivalPost.module.css";
import axios from "axios";
import DOMPurify from "dompurify";

export default function SurvivalPost() {
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get("postId");
  const apiKey = import.meta.env.VITE_WP_API;

  const [data, setData] = useState([]);
  const [imgUrl, setImgUrl] = useState("");
  const sanitizedBlog = DOMPurify.sanitize(data.content);
  useEffect(() => {
    axios.get(apiKey + "/posts/" + queryId).then((res) => {
      setData(res.data);
      setImgUrl(res.data.post_thumbnail.URL);
    });
  }, []);

  function formatDate() {
    var options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(data.date).toLocaleDateString([], options);
  }

  if (imgUrl === "") {
    return <div>Loading.....</div>;
  }
  return (
    <div className={styles.wrapper}>
      <p className={styles.author}>
        <b>Tác giả: {data.author.name}</b>
      </p>
      <p className={styles.author}>
        <b>Ngày đăng tải: {formatDate()}</b>
      </p>
      <h1 className={styles.title}>{data.title}</h1>

      <div className={styles.thumbnail}>
        <img src={imgUrl} alt="thumbnail" loading="lazy" />
      </div>

      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: sanitizedBlog }}
      ></div>
    </div>
  );
}
