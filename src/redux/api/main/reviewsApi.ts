import axios from 'axios';

export interface Review {
  id: number;
  author: string;
  content_type: number;
  text: string;
  created_at: string;
  rate: number;
  object_id: number;
}

const API_URL = 'http://127.0.0.1:8000/api/reviews/';

export const fetchReviews = async (content_type: number, object_id: number): Promise<Review[]> => {
  const response = await axios.get(API_URL, {
    params: {
      content_type,
      object_id
    }
  });
  return response.data;
};
