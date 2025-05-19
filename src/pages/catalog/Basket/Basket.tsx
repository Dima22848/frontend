// import { useState, useRef } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "../../../redux/store";
// import styles from "./Basket.module.scss";

// const Basket = ({ isCartOpen, toggleCart }: { isCartOpen: boolean; toggleCart: () => void }) => {
//   const cartItems = useSelector((state: RootState) => state.basket);
//   const cartDropdownRef = useRef<HTMLDivElement>(null);

//   const updateQuantity = (id: number, delta: number) => {
//     // TODO: Добавить логику обновления количества товаров в корзине через Redux
//   };

//   const getTotalPrice = () => {
//     return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
//   };

//   return (
//     isCartOpen && (
//       <div className={styles.cartDropdown} ref={cartDropdownRef}>
//         <h3>Корзина</h3>
//         {cartItems.map(item => (
//           <div key={item.id} className={styles.cartItem}>
//             <img src={item.image} alt={item.name} />
//             <div>
//               <p>{item.name}</p>
//               <div className={styles.quantityControl}>
//                 <button onClick={() => updateQuantity(item.id, -1)}>-</button>
//                 <span>{item.quantity}</span>
//                 <button onClick={() => updateQuantity(item.id, 1)}>+</button>
//               </div>
//               <p>{item.price * item.quantity} ₽</p>
//             </div>
//           </div>
//         ))}
//         <h4>Всего к оплате: {getTotalPrice()} ₽</h4>
//         <button className={styles.payButton}>Оплатить</button>
//       </div>
//     )
//   );
// };

// export default Basket;


const Basket = () => (
    <h1>Корзина</h1>
)

export default Basket;