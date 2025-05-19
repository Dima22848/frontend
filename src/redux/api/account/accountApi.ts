import axios from "axios";

interface Account {
  id: number;
  friends?: number[];
  following?: number[];
  followers?: number[];
  city_display?: string;
  nickname: string;
  image?: string;
  age?: number;
  profession?: string;
  hobby?: string;
  extra_info?: string;
}

// Получить информацию о пользователе
export const fetchUser = async (userId: string) => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/users/${userId}/`);
    return response.data;
  } catch (error) {
    throw new Error("Не удалось загрузить данные пользователя");
  }
};

// Получить список друзей
export const fetchFriends = async (userId: string) => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/users/${userId}/friends/`);
    return response.data;
  } catch (error) {
    throw new Error("Не удалось загрузить список друзей");
  }
};

// Получить всех пользователей (добавлено)
export const fetchUsers = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/users/");
    return response.data;
  } catch (error) {
    throw new Error("Не удалось загрузить список пользователей");
  }
};
