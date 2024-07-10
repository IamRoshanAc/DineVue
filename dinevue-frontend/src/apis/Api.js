import axios from "axios";

const Api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true, // Include this if needed for handling cookies or credentials
  headers: {
    "Content-Type": "multipart/form-data", // Adjust content type as per your API needs
  },
});

// Function to get authorization header dynamically
const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  if (token) {
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  } else {
    return {};
  }
};

// API functions

export const testApi = () => Api.get("/test");

// User APIs
export const createUserApi = (data) => Api.post('/api/user/create', data);
export const loginUserApi = (data) => Api.post('/api/user/login', data);
export const getAllUserApi = () => Api.get('/api/user/getall');

// Restaurant APIs
export const createRestaurantApi = (data) => Api.post('/api/restaurant/createRestaurant', data);
export const loginRestaurantApi = (data) => Api.post('/api/restaurant/loginRestaurant', data);
export const getAllRestaurantApi = () => Api.get('api/restaurant/getAllRestaurants');

// Modified getSingleRestaurantApi to use dynamic authorization header
// export const getSingleRestaurantApi = async (id) => {
//   try {
//     const response = await Api.get(`/api/restaurant/restaurant/${id}`, getAuthConfig());
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

export const getSingleRestaurantApi = (id) => Api.get(`/api/restaurant/restaurant/${id}`);


export default Api;
