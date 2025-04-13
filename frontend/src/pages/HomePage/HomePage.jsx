import React from "react";
import styles from "./HomePage.module.css";
import HomeBox from "../../components/HomeBox";
import { FaMapMarkedAlt, FaFire, FaRoute } from "react-icons/fa";

export default function HomePage() {
  return (
    <div>
      <div className={styles.home_wrapper}>
        <div className={styles.title}>
          <h1>Cắm trại – Đơn giản là tận hưởng!</h1>
          <button className="shadow_btn">Start Exploring</button>
        </div>
      </div>
      <div className={styles.features}>
        <h1>Tính năng của Campest</h1>
        <div className={styles.features_list}>
          <HomeBox
            type="feature"
            icon={<FaMapMarkedAlt size={30} />}
            title="Tìm kiếm bãi cắm trại"
            describe="Khám phá một loạt các khu cắm trại trên nhiều địa điểm khác nhau."
            link="/survival"
          />
          <HomeBox
            type="feature"
            icon={<FaFire size={30} />}
            title="Kĩ năng sinh tồn"
            describe="Học các kỹ năng sinh tồn cần thiết cho cuộc phiêu lưu ngoài trời của bạn."
            link="/survival"
          />
          <HomeBox
            type="feature"
            icon={<FaRoute size={30} />}
            title="Lên kế hoạch cắm trại"
            describe="Lên kế hoạch chuyến đi dễ dàng với công cụ thông minh của chúng tôi!"
            link="/schedule"
          />
        </div>
      </div>
      <div className={styles.blogs}>
        <h1>Những bài blog mới nhất</h1>
        <div className={styles.features_list}>
          <HomeBox
            type="blog"
            image="https://static.vecteezy.com/system/resources/thumbnails/048/337/108/small_2x/winter-wonderland-concept-a-lone-campfire-burns-brightly-in-a-snowy-pine-forest-providing-a-stark-contrast-to-the-cold-tranquil-surroundings-and-creating-a-sense-of-warmth-and-survival-photo.jpg"
            title="Tìm kiếm bãi cắm trại"
            describe="Khám phá một loạt các khu cắm trại trên nhiều địa điểm khác nhau."
          />
          <HomeBox
            type="blog"
            image="https://static.vecteezy.com/system/resources/thumbnails/048/337/108/small_2x/winter-wonderland-concept-a-lone-campfire-burns-brightly-in-a-snowy-pine-forest-providing-a-stark-contrast-to-the-cold-tranquil-surroundings-and-creating-a-sense-of-warmth-and-survival-photo.jpg"
            title="Kĩ năng sinh tồn"
            describe="Học các kỹ năng sinh tồn cần thiết cho cuộc phiêu lưu ngoài trời của bạn."
          />
          <HomeBox
            type="blog"
            image="https://static.vecteezy.com/system/resources/thumbnails/048/337/108/small_2x/winter-wonderland-concept-a-lone-campfire-burns-brightly-in-a-snowy-pine-forest-providing-a-stark-contrast-to-the-cold-tranquil-surroundings-and-creating-a-sense-of-warmth-and-survival-photo.jpg"
            title="Lên kế hoạch cắm trại"
            describe="Lên kế hoạch chuyến đi dễ dàng với công cụ thông minh của chúng tôi!"
          />
        </div>
      </div>
      <div className={styles.joinUs}>
        <h2>Sẵn sàng tiếp tục khám phá?</h2>
        <h3>
          Cùng chúng tôi chinh phục thiên nhiên và rèn luyện kỹ năng sinh tồn
          của bạn.
        </h3>
        <button className={`shadow_btn ${styles.join_button}`}>Join Us</button>
      </div>
    </div>
  );
}
