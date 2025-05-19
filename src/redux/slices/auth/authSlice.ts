import { createSlice, PayloadAction } from '@reduxjs/toolkit'; 
import { RootState } from '../../store';

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


interface AuthState {
  token: string | null;
  user: User | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('access_token') || null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
      if (action.payload) {
        localStorage.setItem('access_token', action.payload);
      } else {
        localStorage.removeItem('access_token');
      }
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem('access_token');
    },
  },
});

export const { setToken, setUser, logout } = authSlice.actions;
export default authSlice.reducer;

export const selectIsAuthenticated = (state: RootState) => !!state.auth.token;
export const selectUser = (state: RootState) => state.auth.user;


