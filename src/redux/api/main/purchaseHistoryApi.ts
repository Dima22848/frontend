import axios from 'axios';
import { DJANGO_URL_API } from "../baseApi";  


// Функция для получения истории покупок
export const fetchPurchaseHistory = async () => {
  const response = await axios.get(`${DJANGO_URL_API}/purchase-history`);
  return response.data;
};
