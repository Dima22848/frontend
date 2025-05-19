import { useState, useEffect, useRef } from "react";
import { Outlet, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../redux/store";
import { setToken, setUser, logout } from "../../../redux/slices/auth/authSlice";
import { fetchCurrentUser } from "../../../redux/api/auth/authApi";
import styles from "./Layout.module.scss";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface AlcoholItem {
  id: number;
  name: string;
  price: number;
  image: string;
}

const Layout = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [currentUser, setCurrentUser] = useState(user);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [filter, setFilter] = useState("по популярности");
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [alcoholItems, setAlcoholItems] = useState<AlcoholItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const cartDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const catalogDropdownRef = useRef<HTMLDivElement>(null);
  const catalogButtonRef = useRef<HTMLButtonElement>(null);

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(cartItems.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node;
    const isInCart = cartDropdownRef.current?.contains(target);
    const isInProfile = profileDropdownRef.current?.contains(target);
    const isInCatalog = catalogDropdownRef.current?.contains(target) || catalogButtonRef.current?.contains(target);

    if (!isInCart && !isInProfile && !isInCatalog) {
      setIsCartOpen(false);
      setIsProfileOpen(false);
      setIsCatalogOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const email = localStorage.getItem("user_email");

    if (token && email && !user) {
      const loadUser = async () => {
        try {
          const userData = await fetchCurrentUser(token, email);
          dispatch(setToken(token));
          dispatch(setUser(userData));
        } catch (error) {
          console.error("Ошибка при загрузке пользователя:", error);
          localStorage.removeItem("access_token");
          localStorage.removeItem("user_email");
        }
      };

      loadUser();
    }
  }, [dispatch, user]);

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
    setIsProfileOpen(false);
    setIsCatalogOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsCartOpen(false);
    setIsCatalogOpen(false);
  };

  const toggleCatalog = () => {
    setIsCatalogOpen(!isCatalogOpen);
    setIsCartOpen(false);
    setIsProfileOpen(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className={styles.full}>
      <nav className={styles.header}>
        <div className={styles.navbarLeft}>
          <Link to="/">Alcoland</Link>
          <Link to="/support">Поддержка</Link>
        </div>
        <div className={styles.navbarRight}>
          <div onClick={toggleCart}>Корзина</div>
          {currentUser ? (
            <div onClick={toggleProfile}>{currentUser.nickname}</div>
          ) : (
            <>
              <Link to="/login">Вход</Link>
              <Link to="/register">Регистрация</Link>
            </>
          )}
        </div>
      </nav>

      {isCartOpen && (
        <div className={styles.cartDropdown} ref={cartDropdownRef}>
          <h3>Корзина</h3>
          {cartItems.map(item => (
            <div key={item.id} className={styles.cartItem}>
              <img src={item.image} alt={item.name} />
              <div>
                <p>{item.name}</p>
                <div className={styles.quantityControl}>
                  <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                </div>
                <p>{item.price * item.quantity} ₽</p>
              </div>
            </div>
          ))}
          <h4>Всего к оплате: {getTotalPrice()} ₽</h4>
          <button className={styles.payButton}>Оплатить</button>
        </div>
      )}

      {isProfileOpen && user && (
        <div className={styles.profileDropdown} ref={profileDropdownRef}>
          <Link to="/profile">Мой профиль</Link>
          <Link to="/profile/settings">Настройки</Link>
          <button onClick={() => dispatch(logout())} className={styles.logoutLink}>Выйти</button>
        </div>
      )}

      <div className={styles.filterField}>
        <div className={styles.catalog}>
          <button
            ref={catalogButtonRef}
            className={styles.catalogButton}
            onClick={toggleCatalog}
          >Каталог товаров</button>
          {isCatalogOpen && (
            <div className={styles.dropdown} ref={catalogDropdownRef}>
              <Link to="/pivo">Пиво</Link>
              <Link to="/vino">Вино</Link>
              <Link to="/cognak">Коньяк</Link>
              <Link to="/vodka">Водка</Link>
            </div>
          )}
        </div>

        <div className={styles.searchField}>
          <input type="text" placeholder="Поиск..." />
        </div>

        <div className={styles.filterFieldRight}>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="по популярности">По популярности</option>
            <option value="по новизне">По новизне</option>
            <option value="по убыванию цены">По убыванию цены</option>
            <option value="по возрастанию цены">По возрастанию цены</option>
          </select>
        </div>
      </div>

      <div className={styles.content}>
        <Outlet />
      </div>

      <div className={styles.pagination}>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Предыдущая</button>
        <span>{currentPage}</span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage * itemsPerPage >= alcoholItems.length}>Следующая</button>
      </div>

      <div className={styles.recommendations}>
        <h3>Рекомендации</h3>
        <div className={styles.recommendItems}>
          <div className={styles.recommendItem}>Item 1</div>
          <div className={styles.recommendItem}>Item 2</div>
          <div className={styles.recommendItem}>Item 3</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;






// import { useState, useEffect, useRef } from "react";
// import { Outlet, Link } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "../../../redux/store";
// import { setToken, setUser, logout } from "../../../redux/slices/auth/authSlice";
// import { fetchCurrentUser } from "../../../redux/api/auth/authApi"
// import styles from "./Layout.module.scss";

// interface CartItem {
//   id: number;
//   name: string;
//   price: number;
//   quantity: number;
//   image: string;
// }

// interface AlcoholItem {
//   id: number;
//   name: string;
//   price: number;
//   image: string;
// }

// const Layout = () => {
//   const dispatch = useDispatch();
//   const user = useSelector((state: RootState) => state.auth.user);
//   console.log("Текущий пользователь:", user);
//   const [currentUser, setCurrentUser] = useState(user);
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [filter, setFilter] = useState("по популярности");
//   const [isCatalogOpen, setIsCatalogOpen] = useState(false);
//   const [alcoholItems, setAlcoholItems] = useState<AlcoholItem[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 20;

//   const cartDropdownRef = useRef<HTMLDivElement>(null);
//   const profileDropdownRef = useRef<HTMLDivElement>(null);

//   const updateQuantity = (id: number, delta: number) => {
//     setCartItems(cartItems.map((item) =>
//       item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
//     ));
//   };

//   const getTotalPrice = () => {
//     return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
//   };

//   const handleClickOutside = (event: MouseEvent) => {
//     if (
//       (cartDropdownRef.current && !cartDropdownRef.current.contains(event.target as Node)) &&
//       (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node))
//     ) {
//       setIsCartOpen(false);
//       setIsProfileOpen(false);
//       setIsCatalogOpen(false);
//     }
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("access_token");
//     const email = localStorage.getItem("user_email");

//     if (token && email && !user) {
//       const loadUser = async () => {
//         try {
//           const userData = await fetchCurrentUser(token, email);
//           dispatch(setToken(token));
//           dispatch(setUser(userData));
//         } catch (error) {
//           console.error("Ошибка при загрузке пользователя:", error);
//           localStorage.removeItem("access_token");
//           localStorage.removeItem("user_email");
//         }
//       };

//       loadUser();
//     }
//   }, [dispatch, user]);

//   useEffect(() => {
//     setCurrentUser(user);
//   }, [user]);

//   useEffect(() => {
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const toggleCart = () => {
//     setIsCartOpen(!isCartOpen);
//     if (isProfileOpen) setIsProfileOpen(false);
//   };

//   const toggleProfile = () => {
//     setIsProfileOpen(!isProfileOpen);
//     if (isCartOpen) setIsCartOpen(false);
//   };

//   const toggleCatalog = () => {
//     setIsCatalogOpen(!isCatalogOpen);
//   };

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   return (
//     <div className={styles.full}>
//       <nav className={styles.header}>
//         <div className={styles.navbarLeft}>
//           <Link to="/">Alcoland</Link>
//           <Link to="/support">Поддержка</Link>
//         </div>
//         <div className={styles.navbarRight}>
//           <div onClick={toggleCart}>Корзина</div>
//           {currentUser ? (
//             <div onClick={toggleProfile}>{currentUser.nickname}</div>
//           ) : (
//             <>
//               <Link to="/login">Вход</Link>
//               <Link to="/register">Регистрация</Link>
//             </>
//           )}
//         </div>
//       </nav>

//       {isCartOpen && (
//         <div className={styles.cartDropdown} ref={cartDropdownRef}>
//           <h3>Корзина</h3>
//           {cartItems.map(item => (
//             <div key={item.id} className={styles.cartItem}>
//               <img src={item.image} alt={item.name} />
//               <div>
//                 <p>{item.name}</p>
//                 <div className={styles.quantityControl}>
//                   <button onClick={() => updateQuantity(item.id, -1)}>-</button>
//                   <span>{item.quantity}</span>
//                   <button onClick={() => updateQuantity(item.id, 1)}>+</button>
//                 </div>
//                 <p>{item.price * item.quantity} ₽</p>
//               </div>
//             </div>
//           ))}
//           <h4>Всего к оплате: {getTotalPrice()} ₽</h4>
//           <button className={styles.payButton}>Оплатить</button>
//         </div>
//       )}

//       {isProfileOpen && user && (
//         <div className={styles.profileDropdown} ref={profileDropdownRef}>
//           <Link to="/profile">Мой профиль</Link>
//           <Link to="/profile/settings">Настройки</Link>
//           <button onClick={() => dispatch(logout())} className={styles.logoutLink}>Выйти</button>
//         </div>
//       )}

//       <div className={styles.filterField}>
//         <div className={styles.catalog}>
//           <button className={styles.catalogButton} onClick={toggleCatalog}>Каталог товаров</button>
//           {isCatalogOpen && (
//             <div className={styles.dropdown}>
//               <Link to="/pivo">Пиво</Link>
//               <Link to="/vino">Вино</Link>
//               <Link to="/cognak">Коньяк</Link>
//               <Link to="/vodka">Водка</Link>
//             </div>
//           )}
//         </div>

//         <div className={styles.searchField}>
//           <input type="text" placeholder="Поиск..." />
//         </div>

//         <div className={styles.filterFieldRight}>
//           <select value={filter} onChange={(e) => setFilter(e.target.value)}>
//             <option value="по популярности">По популярности</option>
//             <option value="по новизне">По новизне</option>
//             <option value="по убыванию цены">По убыванию цены</option>
//             <option value="по возрастанию цены">По возрастанию цены</option>
//           </select>
//         </div>
//       </div>

//       <div className={styles.content}>
//         <Outlet />
//       </div>

//       {/* Пагинация */}
//       <div className={styles.pagination}>
//         <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Предыдущая</button>
//         <span>{currentPage}</span>
//         <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage * itemsPerPage >= alcoholItems.length}>Следующая</button>
//       </div>

//       <div className={styles.recommendations}>
//         <h3>Рекомендации</h3>
//         <div className={styles.recommendItems}>
//           <div className={styles.recommendItem}>Item 1</div>
//           <div className={styles.recommendItem}>Item 2</div>
//           <div className={styles.recommendItem}>Item 3</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Layout;





