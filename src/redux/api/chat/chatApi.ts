import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Интерфейс для чата
interface Chat {
    id: number;
    name: string;
    participants: number[]; // Список ID пользователей
    image: string | null;
    created_at: string;
}

const token = localStorage.getItem("access_token"); // Получаем токен из localStorage

export const chatApi = createApi({
    reducerPath: "chatApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://127.0.0.1:8000/api",
        prepareHeaders: (headers) => {
            // Добавляем токен в заголовки запроса, если он есть
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getChats: builder.query<Chat[], void>({
            query: () => "/chats/",
        }),
        getChatById: builder.query<Chat, string>({
            query: (chatId) => `/chats/${chatId}/`,
        }),
    }),
});

export const { useGetChatsQuery, useGetChatByIdQuery } = chatApi;
export default chatApi;

