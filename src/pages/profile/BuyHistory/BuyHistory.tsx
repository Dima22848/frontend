import React from "react";
import styles from "./BuyHistory.module.scss";

const purchaseHistory = [
  {
    id: 1,
    items: [
      {
        id: 101,
        alcoholName: "Вино Красное",
        alcoholImage: "https://via.placeholder.com/150",
        quantity: 2,
        price: 500,
      },
      {
        id: 102,
        alcoholName: "Виски Шотландский",
        alcoholImage: "https://via.placeholder.com/150",
        quantity: 1,
        price: 1200,
      },
    ],
  },
  {
    id: 2,
    items: [
      {
        id: 103,
        alcoholName: "Коньяк Армянский",
        alcoholImage: "https://via.placeholder.com/150",
        quantity: 3,
        price: 1500,
      },
    ],
  },
];

const BuyHistory = () => {
  return (
    <div className={styles.historyContainer}>
      <h1 className={styles.pageTitle}>Моя история покупок</h1>

      {purchaseHistory.map((purchase) => {
        const totalAmount = purchase.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );

        return (
          <div key={purchase.id} className={styles.purchaseBlock}>
            {purchase.items.map((item) => (
              <div key={item.id} className={styles.purchaseItem}>
                <img
                  src={item.alcoholImage}
                  alt={item.alcoholName}
                  className={styles.alcoholImage}
                />
                <div className={styles.alcoholDetails}>
                  <h2 className={styles.alcoholName}>{item.alcoholName}</h2>
                  <p className={styles.quantity}>Количество: {item.quantity}</p>
                  <p className={styles.price}>Цена за единицу: {item.price} руб.</p>
                  <p className={styles.totalItemPrice}>
                    Всего: {item.price * item.quantity} руб.
                  </p>
                </div>
              </div>
            ))}

            <div className={styles.totalAmount}>
              <h3>Общая сумма заказа: {totalAmount} руб.</h3>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BuyHistory;
