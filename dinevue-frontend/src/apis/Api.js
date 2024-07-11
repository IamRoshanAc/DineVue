import axios from "axios";

// Create an Axios instance
const Api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true, // Include this if needed for handling cookies or credentials
  headers: {
    "Content-Type": "application/json", // Default content type
  },
});

// Function to get authorization header dynamically
const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  return token ? { headers: { 'Authorization': `Bearer ${token}` } } : {};
};

// API functions

// Test API
export const testApi = () => Api.get("/test");

// User APIs
export const createUserApi = (data) => Api.post('/api/user/create', data);
export const loginUserApi = (data) => Api.post('/api/user/login', data);
export const getAllUserApi = () => Api.get('/api/user/getall');

// Restaurant APIs
export const createRestaurantApi = (data) => Api.post('/api/restaurant/createRestaurant', data);
export const loginRestaurantApi = (data) => Api.post('/api/restaurant/loginRestaurant', data);
export const getAllRestaurantApi = () => Api.get('/api/restaurant/getAllRestaurants');

// Reservation API
export const createReservationApi = async (reservationData) => {
  try {
    const response = await Api.post('/api/reservations/create_reservations', reservationData, getAuthConfig());
    return response.data;
  } catch (error) {
    // Detailed error handling
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error('Error response:', error.response);
      throw new Error(`Error creating reservation: ${error.response.status} ${error.response.statusText}`);
    } else if (error.request) {
      // Request was made but no response received
      console.error('Error request:', error.request);
      throw new Error('Error creating reservation: No response received from server');
    } else {
      // Something else happened
      console.error('Error message:', error.message);
      throw new Error(`Error creating reservation: ${error.message}`);
    }
  }
};

// Single Restaurant API
export const getSingleRestaurantApi = (id) => Api.get(`/api/restaurant/restaurant/${id}`, getAuthConfig());

export default Api;
