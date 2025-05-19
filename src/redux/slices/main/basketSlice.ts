import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchBasket, addToBasket } from '../../api/main/basketApi';

// Определяем тип элемента корзины
interface BasketItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// Определяем тип состояния корзины
type BasketState = BasketItem[];

const initialState: BasketState = [];

export const loadBasket = createAsyncThunk<BasketItem[]>('basket/loadBasket', async () => {
  const basket = await fetchBasket();
  return basket; // Убедитесь, что fetchBasket возвращает массив объектов BasketItem
});

export const addItemToBasket = createAsyncThunk<BasketItem, BasketItem>(
  'basket/addItemToBasket',
  async (item) => {
    const updatedBasket = await addToBasket(item);
    return updatedBasket; // Убедитесь, что addToBasket возвращает объект BasketItem
  }
);

const basketSlice = createSlice({
  name: 'basket',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadBasket.fulfilled, (state, action: PayloadAction<BasketItem[]>) => {
        return action.payload;
      })
      .addCase(addItemToBasket.fulfilled, (state, action: PayloadAction<BasketItem>) => {
        state.push(action.payload);
      });
  },
});

export default basketSlice.reducer;
