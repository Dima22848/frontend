import axios from 'axios';

const baseUrl = 'http://localhost:8000'

// Функция для получения данных о корзине
export const fetchBasket = async () => {
  const response = await axios.get(`${baseUrl}/api/basket`);
  return response.data;
};

// Функция для добавления товара в корзину
export const addToBasket = async (item: any) => {
  const response = await axios.post(`${baseUrl}/api/basket`, item);
  return response.data;
};
