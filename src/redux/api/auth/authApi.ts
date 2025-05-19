import axios from "axios";
import { User } from "../../slices/auth/usersSlice";

const API_BASE_URL = "http://localhost:8000/api";

interface AuthResponse {
    access: string;
    refresh?: string;
}

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
    try {
        const response = await axios.post<AuthResponse>(`${API_BASE_URL}/token/`, { email, password });
        return response.data;
    } catch (error) {
        throw new Error("Ошибка авторизации");
    }
};

export const fetchCurrentUser = async (token: string, userEmail: string): Promise<User | null> => {
    try {
        const response = await axios.get<User[]>(`${API_BASE_URL}/users/`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const currentUser = response.data.find(user => user.email === userEmail);

        if (!currentUser) {
            throw new Error("Текущий пользователь не найден");
        }

        return currentUser;
    } catch (error) {
        throw new Error("Ошибка загрузки данных пользователя");
    }
};

export const fetchUsers = async (token: string): Promise<User[]> => {
    try {
        const response = await axios.get<User[]>(`${API_BASE_URL}/users/`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
    } catch (error) {
        throw new Error("Ошибка загрузки пользователей");
    }
};

export const registerUser = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/register/`, { email, password });
        return response.data;
    } catch (error) {
        throw new Error("Ошибка регистрации");
    }
};

export const logoutUser = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_email");
};

