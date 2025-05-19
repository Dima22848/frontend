import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../../redux/slices/auth/authSlice";
import { selectUsers, fetchUsers } from "../../../redux/slices/auth/usersSlice";
import styles from "./Friends.module.scss";
import { AppDispatch } from "../../../redux/store";

const Friends = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector(selectUser);
  const users = useSelector(selectUsers);

  useEffect(() => {
    if (users.length === 0) {
      dispatch(fetchUsers(localStorage.getItem("access_token") || ""));
    }
  }, [dispatch, users]);

  console.log("🔹 currentUser:", currentUser);
  console.log("🔹 currentUser.friends:", currentUser?.friends);
  console.log("🔹 users (все пользователи):", users);

  if (!currentUser) {
    return <p>Загрузка профиля...</p>;
  }

  if (users.length === 0) {
    return <p>Загрузка списка друзей...</p>;
  }

  const friendsList = users.filter((user) => currentUser.friends.includes(user.id));

  console.log("🔹 friendsList (отфильтрованные друзья):", friendsList);

  return (
    <div className={styles.friendsContainer}>
      <h2>Мои друзья</h2>
      <div className={styles.friendsList}>
        {friendsList.length > 0 ? (
          friendsList.map((friend) => (
            <div key={friend.id} className={styles.friendCard}>
              <div className={styles.friendProfile}>
                <img src={friend.image} alt={friend.nickname} className={styles.friendAvatar} />
                <p className={styles.friendName}>{friend.nickname}</p>
              </div>
              <div className={styles.friendActions}>
                <button className={styles.viewProfile}>Посмотреть профиль</button>
                <button className={styles.sendMessage}>Написать сообщение</button>
                <button className={styles.removeFriend}>Убрать из друзей</button>
              </div>
            </div>
          ))
        ) : (
          <p>У вас пока нет друзей</p>
        )}
      </div>
    </div>
  );
};

export default Friends;
