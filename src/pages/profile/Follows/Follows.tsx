import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../../redux/slices/auth/authSlice";
import { selectUsers, fetchUsers } from "../../../redux/slices/auth/usersSlice";
import styles from "./Follows.module.scss";
import { AppDispatch } from "../../../redux/store";

const Follows = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector(selectUser);
  const users = useSelector(selectUsers);

  useEffect(() => {
    if (users.length === 0) {
      dispatch(fetchUsers(localStorage.getItem("access_token") || ""));
    }
  }, [dispatch, users]);

  if (!currentUser) {
    return <p>Загрузка профиля...</p>;
  }

  if (users.length === 0) {
    return <p>Загрузка подписок и подписчиков...</p>;
  }

  // Фильтрация подписок и подписчиков
  const followingList = users.filter((user) => currentUser.following.includes(user.id));
  const followersList = users.filter((user) => currentUser.followers.includes(user.id));

  return (
    <div className={styles.followsContainer}>
      <h2>Мои подписки</h2>
      <div className={styles.followsGrid}>
        {/* Мои подписки */}
        <div className={styles.followBlock}>
          <h3>Мои подписки</h3>
          {followingList.length > 0 ? (
            followingList.map((user) => (
              <div key={user.id} className={styles.followCard}>
                <div className={styles.followProfile}>
                  <img src={user.image} alt={user.nickname} className={styles.followAvatar} />
                  <p className={styles.followName}>{user.nickname}</p>
                </div>
                <div className={styles.followActions}>
                  <button className={styles.viewProfile}>Посмотреть профиль</button>
                  <button className={styles.sendMessage}>Написать сообщение</button>
                  <button className={styles.unfollow}>Отписаться</button>
                </div>
              </div>
            ))
          ) : (
            <p>Вы ни на кого не подписаны</p>
          )}
        </div>

        {/* Мои подписчики */}
        <div className={styles.followBlock}>
          <h3>Мои подписчики</h3>
          {followersList.length > 0 ? (
            followersList.map((user) => (
              <div key={user.id} className={styles.followCard}>
                <div className={styles.followProfile}>
                  <img src={user.image} alt={user.nickname} className={styles.followAvatar} />
                  <p className={styles.followName}>{user.nickname}</p>
                </div>
                <div className={styles.followActions}>
                  <button className={styles.viewProfile}>Посмотреть профиль</button>
                  <button className={styles.sendMessage}>Написать сообщение</button>
                  <button className={styles.removeFollower}>Удалить подписчика</button>
                </div>
              </div>
            ))
          ) : (
            <p>У вас пока нет подписчиков</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Follows;
