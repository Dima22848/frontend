import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetCommentsByNewsFeedIdQuery, useCreateCommentMutation } from "../../../redux/api/account/newsFeedCommentsApi";
import { fetchUser } from "../../../redux/api/account/accountApi";
import { selectUser } from "../../../redux/slices/auth/authSlice";
import styles from "./NewsFeed.module.scss";

interface Post {
  id: number;
  profile_id: number;
  text: string;
  file: string | null;
  created_at: string;
}

interface UserData {
  [key: number]: {
    id: number;
    nickname: string;
    image: string;
  };
}

interface NewsFeedItemProps {
  post: Post;
  userData: UserData;
}

const NewsFeedItem: React.FC<NewsFeedItemProps> = ({ post, userData }) => {
  const { data: comments, refetch } = useGetCommentsByNewsFeedIdQuery(post.id);
  const [createComment] = useCreateCommentMutation();
  const [userCommentsData, setUserCommentsData] = useState<Record<number, any>>({});
  const [newComment, setNewComment] = useState("");
  const currentUser = useSelector(selectUser); // Получаем текущего пользователя

  useEffect(() => {
    const getUserData = async (profileId: number) => {
      if (!userData[profileId]) {
        const user = await fetchUser(profileId.toString());
        setUserCommentsData((prevData: Record<number, any>) => ({
          ...prevData,
          [profileId]: user,
        }));
      }
    };

    comments?.forEach((comment) => {
      getUserData(comment.profile_id);
    });
  }, [comments, userData]);

  const handleCommentSubmit = async () => {
    if (!currentUser) {
      alert("Вы должны быть авторизованы, чтобы оставлять комментарии.");
      return;
    }
  
    if (!newComment.trim()) {
      alert("Комментарий не может быть пустым.");
      return;
    }
  
    const newCommentData = {
      profile_id: currentUser.id,
      newsfeed_id: post.id,
      text: newComment,
    };
  
    console.log("Отправка комментария:", newCommentData);
  
    try {
      await createComment(newCommentData).unwrap();
      console.log("Комментарий успешно добавлен!");
  
      setNewComment(""); // Очищаем поле ввода
  
      // Перезапрашиваем комментарии после добавления
      refetch();
    } catch (error) {
      console.error("Ошибка при добавлении комментария:", error);
    }
  };
  

  return (
    <div className={styles.post}>
      <div className={styles.postHeader}>
        <img
          src={userData[post.profile_id]?.image || "/images/default-user.jpg"}
          alt="User Avatar"
          className={styles.userPhoto}
        />
        <span className={styles.userName}>
          {userData[post.profile_id]?.nickname || `Пользователь ${post.profile_id}`}
        </span>
        <span className={styles.postDate}>{new Date(post.created_at).toLocaleString()}</span>
      </div>

      <p className={styles.postContent}>{post.text}</p>
      {post.file && <img src={post.file} alt="Post Attachment" className={styles.postImage} />}

      <div className={styles.postActions}>
        <button className={styles.likeButton}>👍 Нравится</button>
        <button className={styles.dislikeButton}>👎 Не нравится</button>
      </div>

      <div className={styles.commentsSection}>
        <h4>Комментарии:</h4>
        {comments?.length ? (
          comments.map((comment) => (
            <div key={comment.id} className={styles.comment}>
              <div className={styles.commentHeader}>
                <img
                  src={userCommentsData[comment.profile_id]?.image || "/images/default-user.jpg"}
                  alt="User Avatar"
                  className={styles.commentAuthorPhoto}
                />
                <span className={styles.commentAuthor}>
                  {userCommentsData[comment.profile_id]?.nickname || `Пользователь ${comment.profile_id}`}
                </span>
                <span className={styles.commentDate}>
                  {new Date(comment.created_at).toLocaleString()}
                </span>
              </div>
              <span className={styles.commentText}>{comment.text}</span>
            </div>
          ))
        ) : (
          <p>Комментариев пока нет</p>
        )}

        {/* Форма для добавления комментария */}
        <div className={styles.commentForm}>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Напишите комментарий..."
          />
          <button onClick={handleCommentSubmit}>Отправить</button>
        </div>
      </div>
    </div>
  );
};

export default NewsFeedItem;










// import React, { useEffect, useState } from "react";
// import { useGetCommentsByNewsFeedIdQuery } from "../../../redux/api/account/newsFeedCommentsApi";
// import { fetchUser } from "../../../redux/api/account/accountApi"; // Функция для получения пользователя по ID
// import styles from "./NewsFeed.module.scss";

// interface Post {
//   id: number;
//   profile_id: number;
//   text: string;
//   file: string | null;
//   created_at: string;
// }

// interface UserData {
//   [key: number]: {
//     id: number;
//     nickname: string;
//     image: string;
//   };
// }

// interface NewsFeedItemProps {
//   post: Post;
//   userData: UserData;
// }

// const NewsFeedItem: React.FC<NewsFeedItemProps> = ({ post, userData }) => {
//   const { data: comments } = useGetCommentsByNewsFeedIdQuery(post.id);
//   const [userCommentsData, setUserCommentsData] = useState<any>({}); // Состояние для хранения данных о пользователях комментариев

//   useEffect(() => {
//     // Функция для получения данных пользователя по ID
//     const getUserData = async (profileId: number) => {
//       if (!userData[profileId]) {
//         const user = await fetchUser(profileId.toString());
//         setUserCommentsData((prevData: any) => ({
//           ...prevData,
//           [profileId]: user,
//         }));
//       }
//     };

//     // Получаем данные для пользователей, оставивших комментарии
//     comments?.forEach(comment => {
//       getUserData(comment.profile_id);
//     });
//   }, [comments, userData]);

//   return (
//     <div className={styles.post}>
//       <div className={styles.postHeader}>
//         <img
//           src={userData[post.profile_id]?.image || "/images/default-user.jpg"}
//           alt="User Avatar"
//           className={styles.userPhoto}
//         />
//         <span className={styles.userName}>
//           {userData[post.profile_id]?.nickname || `Пользователь ${post.profile_id}`}
//         </span>
//         <span className={styles.postDate}>{new Date(post.created_at).toLocaleString()}</span>
//       </div>

//       <p className={styles.postContent}>{post.text}</p>
//       {post.file && <img src={post.file} alt="Post Attachment" className={styles.postImage} />}

//       <div className={styles.postActions}>
//         <button className={styles.likeButton}>👍 Нравится</button>
//         <button className={styles.dislikeButton}>👎 Не нравится</button>
//       </div>

//       <div className={styles.commentsSection}>
//         <h4>Комментарии:</h4>
//         {comments?.length ? (
//           comments.map(comment => (
//             <div key={comment.id} className={styles.comment}>
//               <div className={styles.commentHeader}>
//                 <img
//                   src={userCommentsData[comment.profile_id]?.image || "/images/default-user.jpg"} // Аватар пользователя, оставившего комментарий
//                   alt="User Avatar"
//                   className={styles.commentAuthorPhoto}
//                 />
//                 <span className={styles.commentAuthor}>
//                   {userCommentsData[comment.profile_id]?.nickname || `Пользователь ${comment.profile_id}`} {/* Никнейм комментариста */}
//                 </span>
//                 <span className={styles.commentDate}>
//                   {new Date(comment.created_at).toLocaleString()} {/* Дата комментария */}
//                 </span>
//               </div>
//               <span className={styles.commentText}>{comment.text}</span>
//             </div>
//           ))
//         ) : (
//           <p>Комментариев пока нет</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default NewsFeedItem;





