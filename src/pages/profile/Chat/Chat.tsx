import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useGetChatsQuery } from "../../../redux/api/chat/chatApi";
import { useNavigate, Outlet } from "react-router-dom";
import styles from "./Chat.module.scss";

const Chat = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { data: chats = [], isLoading, isError, error } = useGetChatsQuery();
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  useEffect(() => {
    if (isLoading) console.log("Загрузка чатов...");
    if (isError) console.error("Ошибка загрузки чатов:", error);
  }, [isLoading, isError, error]);

  const filteredChats = chats.filter((chat) => {
    const isGroupChat = chat.participants.length > 2;
    const chatName = isGroupChat
      ? chat.name || "Групповой чат"
      : chat.name || `Чат с пользователем ${chat.participants.find((p) => Number(p) !== userId) || "Без имени"}`;

    return chatName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  console.log(chats);

  return (
    <div className={styles.chatContainer}>
      {/* Список чатов */}
      <div className={styles.chatList}>
        <h2>Чаты</h2>
        <input
          type="text"
          placeholder="Поиск чатов"
          className={styles.searchBar}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className={styles.dialogsList}>
          {filteredChats.map((chat) => (
            <div key={chat.id} className={styles.dialogItem} onClick={() => navigate(`/profile/chats/${chat.id}`)}>
              <img
                src={chat.image ? `http://127.0.0.1:8000${chat.image}` : "/default-avatar.png"}
                alt="avatar"
                className={styles.avatar}
              />
              <div>
                <strong>{chat.name || "Без названия"}</strong>
                <p>Последнее сообщение...</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Окно сообщений */}
      <div className={styles.chatContent}>
        <Outlet />
      </div>
    </div>
  );
};

export default Chat;
