import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '39817976-dbe93a5c1c4f526b07b652022';

export const per_page = 40;
export const fetchImg = async (term, page) => {
  const response = await axios.get(`${BASE_URL}`, {
    params: {
      key: API_KEY,
      q: term,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page,
      page,
    },
  });

  return response.data;
};
