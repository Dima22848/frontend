import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../redux/store";
import { useGetMessagesByChatIdQuery } from "../../../redux/api/chat/messageApi";
import { setMessages, addMessage } from "../../../redux/slices/chat/messageSlice";
import styles from "./Messages.module.scss";

interface Message {
  id: number;
  chat: number;
  sender: {
    id: number;
    nickname: string;
  };
  text: string;
  file: string | null;
  file_url: string | null;
  created_at: string;
}

const Messages = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  const { data: messages = [], isLoading, isError } = useGetMessagesByChatIdQuery(slug || "");
  const messagesInStore = useSelector((state: RootState) => state.message.messages[Number(slug) || 0] || []);

  const [newMessage, setNewMessage] = useState<string>("");
  const stableSlug = useMemo(() => slug, [slug]);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (stableSlug) {
      socketRef.current = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${stableSlug}/`);

      socketRef.current.onopen = () => console.log("✅ WebSocket подключен");
      socketRef.current.onerror = (error) => console.error("❌ WebSocket ошибка:", error);

      socketRef.current.onmessage = (event) => {
        console.log("📥 Входящее сообщение:", event.data);

        try {
          const messageData = JSON.parse(event.data);
          if (messageData.type === "new_message") {
            dispatch(addMessage(messageData.message));
          }
        } catch (error) {
          console.error("❌ Ошибка при обработке входящего сообщения:", error);
        }
      };

      socketRef.current.onclose = (event) => {
        console.warn(`⚠️ WebSocket закрыт: Код ${event.code}, Причина: ${event.reason}`);
      };

      return () => {
        socketRef.current?.close();
      };
    }
  }, [stableSlug, dispatch]);

  useEffect(() => {
    if (messages.length && stableSlug) {
      dispatch(setMessages({ chatId: Number(stableSlug), messages }));
    }
  }, [messages, stableSlug, dispatch]);

  const handleSendMessage = () => {
    console.log("👤 ID пользователя:", userId);
  
    if (!userId) {
      console.error("❌ Ошибка: пользователь не авторизован!");
      return;
    }
  
    if (newMessage.trim() && socketRef.current) {
      const messageData = {
        type: "new_message",
        chat_id: Number(stableSlug),
        sender_id: userId,
        text: newMessage.trim(),
      };
  
      console.log("📤 Отправка сообщения:", messageData);
  
      try {
        socketRef.current.send(JSON.stringify(messageData));
      } catch (error) {
        console.error("❌ Ошибка при отправке сообщения:", error);
      }
  
      setNewMessage("");
    }
  };
  

  return (
    <div className={styles.messagesContainer}>
      <div className={styles.messagesList}>
        <h3>Сообщения</h3>
        {isLoading && <p>Загрузка...</p>}
        {isError && <p>Ошибка при загрузке сообщений</p>}
        <div className={styles.messageList}>
          {(messagesInStore || messages).map((message: Message) => (
            <div key={message.id} className={styles.messageItem}>
              <div className={styles.messageSender}>
                <strong>{message.sender.nickname}</strong>
                <span>{new Date(message.created_at).toLocaleString()}</span>
              </div>
              <div className={styles.messageText}>{message.text}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.messageInput}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Введите сообщение..."
        />
        <button onClick={handleSendMessage}>Отправить</button>
      </div>
    </div>
  );
};

export default Messages;




// import React, { useState, useEffect, useRef, useMemo } from "react";
// import { useParams } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "../../../redux/store";
// import { useGetMessagesByChatIdQuery } from "../../../redux/api/chat/messageApi";
// import { setMessages, addMessage } from "../../../redux/slices/chat/messageSlice";
// import styles from "./Messages.module.scss";

// interface Message {
//   id: number;
//   chat: number;
//   sender: {
//     id: number;
//     nickname: string;
//   };
//   text: string;
//   file: string | null;
//   file_url: string | null;
//   created_at: string;
// }

// const Messages = () => {
//   const { slug } = useParams();
//   const dispatch = useDispatch();
//   const userId = useSelector((state: RootState) => state.auth.user?.id);

//   const { data: messages = [], isLoading, isError } = useGetMessagesByChatIdQuery(slug || "");
//   const messagesInStore = useSelector((state: RootState) => state.message.messages[Number(slug) || 0] || []);

//   const [newMessage, setNewMessage] = useState<string>("");
//   const stableSlug = useMemo(() => slug, [slug]);
//   const socketRef = useRef<WebSocket | null>(null);

//   useEffect(() => {
//     if (stableSlug) {
//       socketRef.current = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${stableSlug}/`);

//       socketRef.current.onopen = () => console.log("✅ WebSocket подключен");
//       socketRef.current.onerror = (error) => console.error("❌ WebSocket ошибка:", error);

//       socketRef.current.onmessage = (event) => {
//         console.log("📥 Входящее сообщение:", event.data);

//         try {
//           const messageData = JSON.parse(event.data);
//           if (messageData.type === "new_message") {
//             dispatch(addMessage(messageData.message));
//           }
//         } catch (error) {
//           console.error("❌ Ошибка при обработке входящего сообщения:", error);
//         }
//       };

//       socketRef.current.onclose = (event) => {
//         console.warn(`⚠️ WebSocket закрыт: Код ${event.code}, Причина: ${event.reason}`);
//       };

//       return () => {
//         socketRef.current?.close();
//       };
//     }
//   }, [stableSlug, dispatch]);

//   useEffect(() => {
//     if (messages.length && stableSlug) {
//       dispatch(setMessages({ chatId: Number(stableSlug), messages }));
//     }
//   }, [messages, stableSlug, dispatch]);

//   const handleSendMessage = () => {
//     console.log("👤 ID пользователя:", userId);
  
//     if (!userId) {
//       console.error("❌ Ошибка: пользователь не авторизован!");
//       return;
//     }
  
//     if (newMessage.trim() && socketRef.current) {
//       const messageData = {
//         type: "new_message",
//         chat_id: Number(stableSlug),
//         sender_id: userId,
//         text: newMessage.trim(),
//       };
  
//       console.log("📤 Отправка сообщения:", messageData);
  
//       try {
//         socketRef.current.send(JSON.stringify(messageData));
//       } catch (error) {
//         console.error("❌ Ошибка при отправке сообщения:", error);
//       }
  
//       setNewMessage("");
//     }
//   };
  

//   return (
//     <div className={styles.messagesContainer}>
//       <div className={styles.messagesList}>
//         <h3>Сообщения</h3>
//         {isLoading && <p>Загрузка...</p>}
//         {isError && <p>Ошибка при загрузке сообщений</p>}
//         <div className={styles.messageList}>
//           {(messagesInStore || messages).map((message: Message) => (
//             <div key={message.id} className={styles.messageItem}>
//               <div className={styles.messageSender}>
//                 <strong>{message.sender.nickname}</strong>
//                 <span>{new Date(message.created_at).toLocaleString()}</span>
//               </div>
//               <div className={styles.messageText}>{message.text}</div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className={styles.messageInput}>
//         <input
//           type="text"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           placeholder="Введите сообщение..."
//         />
//         <button onClick={handleSendMessage}>Отправить</button>
//       </div>
//     </div>
//   );
// };

// export default Messages;










// import React, { useState, useEffect, useMemo, useRef } from "react";
// import { useParams } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "../../../redux/store";
// import { useGetMessagesByChatIdQuery } from "../../../redux/api/chat/messageApi";
// import { setMessages } from "../../../redux/slices/chat/messageSlice";
// import styles from "./Messages.module.scss";

// // Интерфейс для сообщения
// interface Message {
//   id: number;
//   chat: number;
//   sender: {
//     id: number;
//     nickname: string;
//   };
//   text: string;
//   file: string | null;
//   file_url: string | null;
//   created_at: string;
// }

// const Messages = () => {
//   const { slug } = useParams(); // Получаем ID чата из параметров маршрута
//   const dispatch = useDispatch();
  
//   const { data: messages = [], isLoading, isError, error } = useGetMessagesByChatIdQuery(slug || "");
//   const messagesInStore = useSelector((state: RootState) => state.message.messages[Number(slug) || 0] || []);

//   const [newMessage, setNewMessage] = useState<string>("");

//   const stableSlug = useMemo(() => slug, [slug]);

//   // useRef для отслеживания предыдущих сообщений
//   const prevMessagesRef = useRef<Message[]>(messagesInStore || []);

//   useEffect(() => {
//     // Сравниваем старые и новые сообщения
//     if (messages && stableSlug) {
//       if (JSON.stringify(messages) !== JSON.stringify(prevMessagesRef.current)) {
//         dispatch(setMessages({ chatId: Number(stableSlug), messages }));
//         prevMessagesRef.current = messages; // Обновляем ref
//       }
//     }
//   }, [messages, stableSlug, dispatch, messagesInStore]);

//   // Обработчик отправки нового сообщения
//   const handleSendMessage = () => {
//     if (newMessage.trim()) {
//       // Логика отправки сообщения (например, через WebSocket или API)
//       console.log("Отправить сообщение:", newMessage);
//       setNewMessage("");
//     }
//   };

//   return (
//     <div className={styles.messagesContainer}>
//       <div className={styles.messagesList}>
//         <h3>Сообщения</h3>
//         {isLoading && <p>Загрузка...</p>}
//         {isError && <p>Ошибка при загрузке сообщений</p>}
//         <div className={styles.messageList}>
//           {(messagesInStore || messages).map((message: Message) => (
//             <div key={message.id} className={styles.messageItem}>
//               <div className={styles.messageSender}>
//                 <strong>{message.sender.nickname}</strong>
//                 <span>{new Date(message.created_at).toLocaleString()}</span>
//               </div>
//               <div className={styles.messageText}>{message.text}</div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className={styles.messageInput}>
//         <input
//           type="text"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           placeholder="Введите сообщение..."
//         />
//         <button onClick={handleSendMessage}>Отправить</button>
//       </div>
//     </div>
//   );
// };

// export default Messages;

