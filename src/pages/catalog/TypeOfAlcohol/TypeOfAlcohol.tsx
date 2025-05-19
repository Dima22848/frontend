import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { loadAlcoholItems } from "../../../redux/slices/main/alcoholSlice"; // исправленный импорт
import { RootState, useAppDispatch } from "../../../redux/store";
import styles from "../../Homepages/Layout/Layout.module.scss";
import { Link } from "react-router-dom";

export interface AlcoholItem {
  id: number;
  name: string;
  image: string;
  price: number;
  type: string; // "pivo", "vino", "vodka" и т.д.
  slug: string;
}


const TypeOfAlcohol = () => {
  const { type } = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (type) {
      dispatch(loadAlcoholItems(type)); // Загружаем данные
    }
  }, [type, dispatch]);

  const { items, status, error } = useSelector((state: RootState) => state.alcohol);

  if (status === "loading") return <p>Загрузка...</p>;
  if (status === "failed") return <p>Ошибка: {error}</p>;

  return (
    <div className={styles.content}>
      <div className={styles.filterSidebar}>
        <p>Выберите тип алкоголя</p>
      </div>
      <div className={styles.main}>
        <div className={styles.alcoholItems}>
          {items.map((item: AlcoholItem) => (
            <Link key={item.id} to={`/${type}/${item.slug}`} className={styles.alcoholItem}>
              <img style={{ width: "200px", height: "300px" }} src={item.image} alt={item.name} />
              <p>{item.name}</p>
              <p>{item.price} грн</p>
              <button>Добавить в корзину</button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TypeOfAlcohol;
