import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchReviews } from '../../api/main/reviewsApi';  // Импортируем функцию для получения данных

// Интерфейс для типа Review
interface Review {
  id: number;
  text: string;
  created_at: string;
  author: string;
  rate: number;
  content_type: number;
  object_id: number;
}

interface ReviewsState {
  reviews: Review[];  // Типизируем состояние с использованием интерфейса Review
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ReviewsState = {
  reviews: [],
  status: 'idle',
  error: null,
};

// Асинхронный thunk для получения отзывов
export const fetchReviewsAsync = createAsyncThunk(
  'reviews/fetchReviews',
  async ({ content_type, object_id }: { content_type: number; object_id: number }) => {
    const reviews = await fetchReviews(content_type, object_id);
    return reviews;
  }
);

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    // Можно добавить дополнительные синхронные экшены
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviewsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchReviewsAsync.fulfilled, (state, action: PayloadAction<Review[]>) => {
        state.status = 'succeeded';
        state.reviews = action.payload;
      })
      .addCase(fetchReviewsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch reviews';
      });
  },
});

export default reviewsSlice.reducer;
