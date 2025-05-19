import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Интерфейс для каждого поста
interface Post {
  id: number;
  profile_id: number;
  text: string;
  file: string | null;
  created_at: string;
}

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://127.0.0.1:8000/api/',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const newsFeedApi = createApi({
  reducerPath: 'newsFeedApi',
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getNewsfeed: builder.query<Post[], void>({
      query: () => 'newsfeed/',
    }),
    getNewsfeedByProfile: builder.query<Post[], number>({
      query: (profileId) => `newsfeed/?profile=${profileId}`,
    }),
  }),
});

export const { useGetNewsfeedQuery, useGetNewsfeedByProfileQuery } = newsFeedApi;