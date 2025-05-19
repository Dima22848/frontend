import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { fetchUsers as fetchUsersApi } from "../../api/auth/authApi";

export interface User {
    id: number;
    nickname: string;
    email: string;
    image: string;
    city_display?: string;
    age?: number;
    profession?: string;
    hobby?: string;
    extra_info?: string;
    friends: number[];
    following: number[];
    followers: number[];
}

interface UsersState {
    users: User[];
    loading: boolean;
}

const initialState: UsersState = {
    users: [],
    loading: false,
};

export const fetchUsers = createAsyncThunk("users/fetchUsers", async (token: string) => {
    return await fetchUsersApi(token);
});

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.users = action.payload;
                state.loading = false;
            })
            .addCase(fetchUsers.rejected, (state) => {
                state.loading = false;
            });
    },
});

export const selectUsers = (state: RootState) => state.users.users;
export const selectUserById = (state: RootState, userId: number) =>
    state.users.users.find((user: User) => user.id === userId);

export default usersSlice.reducer;
