import axios from 'axios';
import { DJANGO_URL_API } from "../baseApi";  


// Функция для получения данных о конкретном типе алкоголя
export const fetchAlcoholItems = async (type: string) => {
  const response = await axios.get(`${DJANGO_URL_API}/alcohol/?type=${type}`);
  return response.data;
};
