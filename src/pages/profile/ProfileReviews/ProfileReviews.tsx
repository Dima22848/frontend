import React from 'react';
import styles from './ProfileReviews.module.scss';

const reviews = [
  {
    id: 1,
    alcoholName: 'Вино Красное',
    alcoholImage: 'https://via.placeholder.com/150',
    price: '500 руб.',
    reviewText: 'Отличное вино, идеально подходит к мясу. Очень понравился вкус и аромат.',
  },
  {
    id: 2,
    alcoholName: 'Виски Шотландский',
    alcoholImage: 'https://via.placeholder.com/150',
    price: '1200 руб.',
    reviewText: 'Очень насыщенный вкус с нотками дуба. Стоит своих денег, рекомендую!',
  },
  // Добавьте больше отзывов, если нужно
];

const ProfileReviews = () => {
  return (
    <div className={styles.reviewsContainer}>
      <h1 className={styles.pageTitle}>Мои отзывы</h1>

      <div className={styles.reviewsList}>
        {reviews.map((review) => (
          <div key={review.id} className={styles.reviewItem}>
            <div className={styles.alcoholInfo}>
              <img src={review.alcoholImage} alt={review.alcoholName} className={styles.alcoholImage} />
              <div className={styles.alcoholDetails}>
                <h2 className={styles.alcoholName}>{review.alcoholName}</h2>
                <p className={styles.price}>{review.price}</p>
              </div>
            </div>
            <div className={styles.reviewText}>
              <p>{review.reviewText}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileReviews;
