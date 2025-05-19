import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviewsAsync } from "../../../redux/slices/main/reviewsSlice";
import { RootState, AppDispatch } from "../../../redux/store";
import styles from "./Reviews.module.scss";

const contentTypeMapping: Record<string, number> = {
  pivo: 13,
  cognac: 14,
  wine: 17,
  vodka: 18,
};

const Reviews = () => {
  const { type, slug } = useParams<{ type: string; slug: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const reviews = useSelector((state: RootState) => state.reviews.reviews);

  useEffect(() => {
    if (type && slug) {
      const content_type = contentTypeMapping[type] || 0;
      const object_id = parseInt(slug); // Предполагаем, что slug - это id
      dispatch(fetchReviewsAsync({ content_type, object_id }));
    }
  }, [type, slug, dispatch]);

  const renderStars = (rating: number) => (
    <div className={styles.reviewRating}>
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < Math.round(rating) ? styles.starFilled : styles.starEmpty}>★</span>
      ))}
    </div>
  );

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => navigate(-1)}>
        ← Назад
      </button>
      <h1 className={styles.allReviewsTitle}>Все отзывы</h1>
      <div className={styles.reviews}>
        {reviews.map((review) => (
          <div key={review.id} className={styles.review}>
            <div className={styles.reviewHeader}>
              <div className={styles.userWithRating}>
                <span className={styles.userIcon}>👤</span>
                <p className={styles.userName}>{review.author}</p>
                {renderStars(review.rate)}
              </div>
              <p className={styles.reviewDate}>{new Date(review.created_at).toLocaleString()}</p>
            </div>
            <p className={styles.reviewText}>{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;