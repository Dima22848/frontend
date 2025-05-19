import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviewsAsync } from "../../../redux/slices/main/reviewsSlice";
import { RootState, AppDispatch } from "../../../redux/store";
import styles from "./AlcoholItem.module.scss";
import { AlcoholItemData } from "../../../redux/slices/main/alcoholSlice";

const contentTypeMapping: Record<string, number> = {
  pivo: 13,
  cognac: 14,
  wine: 17,
  vodka: 18,
};

const AlcoholItem = () => {
  const { type, slug } = useParams<{ type: string; slug: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const alcoholItems = useSelector((state: RootState) => state.alcohol.items) as AlcoholItemData[];
  const reviews = useSelector((state: RootState) => state.reviews.reviews);
  
  const alcohol = alcoholItems.find((item) => item.slug === slug);

  const content_type = type ? contentTypeMapping[type] || 0 : 0;

  useEffect(() => {
    if (alcohol && type) {
      const object_id = alcohol.id;
      console.log("content_type:", content_type, "object_id:", object_id);
      dispatch(fetchReviewsAsync({ content_type, object_id }));
    }
  }, [alcohol, type, dispatch]);

  if (!alcohol) {
    return <p>Алкоголь не найден</p>;
  }

  const renderStars = (rating: number) => (
    <div className={styles.reviewRating}>
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < rating ? styles.starFilled : styles.starEmpty}>★</span>
      ))}
    </div>
  );

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => navigate(-1)}>
        ← Назад
      </button>
      <div className={styles.content}>
        <img src={alcohol.image} alt={alcohol.name} className={styles.image} />
        <div className={styles.details}>
          <h1>{alcohol.name}</h1>
          <p className={styles.price}>{alcohol.price} грн</p>
          <p className={styles.volume}>Объем: {alcohol.volume}</p>
          <button className={styles.addToCart}>Добавить в корзину</button>
        </div>
      </div>
      <h2>Характеристики</h2>
      <div className={styles.characteristics}>
        {Object.entries(alcohol).map(([key, value]) => {
          if (!["id", "name", "price", "image", "alcoholtype"].includes(key) && value) {
            return (
              <p key={key}>
                <strong>{key}: </strong> {value}
              </p>
            );
          }
          return null;
        })}
      </div>
      <h2>Отзывы</h2>
      <div className={styles.reviews}>
        {reviews.slice(0, 4).map((review) => (
          <div key={review.id} className={styles.review}>
            <span className={styles.userIcon}>👤</span>
            <div className={styles.reviewContent}>
              <div className={styles.reviewHeader}>
                <div className={styles.userWithRating}>
                  <p className={styles.userName}>{review.author}</p>
                  {renderStars(review.rate)}
                </div>
                <p className={styles.reviewDate}>{new Date(review.created_at).toLocaleString()}</p>
              </div>
              <p className={styles.reviewText}>{review.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.reviewButtons}>
        <button onClick={() => navigate("/send-review")}>Оставить отзыв</button>
        <button onClick={() => navigate(`/${type}/${slug}/reviews`, { state: { content_type, object_id: alcohol.id } })}>Все отзывы</button>
      </div>
    </div>
  );
};

export default AlcoholItem;












// import { useParams, useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { RootState } from "../../../redux/store";
// import styles from "./AlcoholItem.module.scss";
// import { AlcoholItemData } from "../../../redux/slices/main/alcoholSlice";

// const AlcoholItem = () => {
//     const { type, slug: slug } = useParams<{ type: string; slug: string }>();
//     const navigate = useNavigate();
//     const alcoholItems = useSelector((state: RootState) => state.alcohol.items) as AlcoholItemData[];
//     const alcohol = alcoholItems.find((item) => item.slug === slug);
    
    

//   if (!alcohol) {
//     return <p>Алкоголь не найден</p>;
//   }

//   const fakeReviews = [
//     {
//       id: 1,
//       user: "Иван Петров",
//       date: "24 января 2025",
//       time: "23:03",
//       rating: 4,
//       text: "Очень хороший вкус, особенно в сочетании с мясом.",
//     },
//     {
//       id: 2,
//       user: "Мария Смирнова",
//       date: "20 февраля 2025",
//       time: "18:45",
//       rating: 5,
//       text: "Отличное качество, рекомендую!",
//     },
//   ];

//   return (
//     <div className={styles.container}>
//       <button className={styles.backButton} onClick={() => navigate(-1)}>
//         ← Назад
//       </button>
//       <div className={styles.content}>
//         <img src={alcohol.image} alt={alcohol.name} className={styles.image} />
//         <div className={styles.details}>
//           <h1>{alcohol.name}</h1>
//           <p className={styles.price}>{alcohol.price} грн</p>
//           <p className={styles.volume}>Объем: {alcohol.volume}</p>
//           <button className={styles.addToCart}>Добавить в корзину</button>
//         </div>
//       </div>
//       <h2>Характеристики</h2>
//       <div className={styles.characteristics}>
//         {Object.entries(alcohol).map(([key, value]) => {
//           if (
//             !["id", "name", "price", "image", "alcoholtype"].includes(key) &&
//             value
//           ) {
//             return (
//               <p key={key}>
//                 <strong>{key}: </strong> {value}
//               </p>
//             );
//           }
//           return null;
//         })}
//       </div>
//       <h2>Отзывы</h2>
//       <div className={styles.reviews}>
//         {fakeReviews.map((review) => (
//           <div key={review.id} className={styles.review}>
//             <span className={styles.userIcon}>👤</span>
//             <div className={styles.reviewContent}>
//               <div className={styles.reviewHeader}>
//                 <p className={styles.userName}>{review.user}</p>
//                 <p className={styles.reviewDate}>
//                   {review.date} {review.time}
//                 </p>
//               </div>
//               <div className={styles.reviewRating}>
//                 {[...Array(5)].map((_, i) =>
//                   i < review.rating ? (
//                     <span key={i} className={styles.starFilled}>★</span>
//                   ) : (
//                     <span key={i} className={styles.starEmpty}>☆</span>
//                   )
//                 )}
//               </div>
//               <p className={styles.reviewText}>{review.text}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//       <div className={styles.reviewButtons}>
//         <button onClick={() => navigate("/send-review")}>
//           Оставить отзыв
//         </button>
//         <button onClick={() => navigate("/reviews")}>Посмотреть все отзывы</button>
//       </div>
//     </div>
//   );
// };

// export default AlcoholItem;

