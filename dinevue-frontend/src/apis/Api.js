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
export const getUserById = (id) => Api.get(`/api/user/getuser/${id}`);

// Update user API
export const updateUserApi = (id, data) => Api.put(`/api/user/update/${id}`, data, getAuthConfig());

// Change password API
export const changePasswordApi = (userId, currentPassword, newPassword) => 
  Api.post('/api/user/change-password', { userId, currentPassword, newPassword }, getAuthConfig());

export const addRestaurantToSavedApi = async (userId, restaurantId) => {
  try {
    const response = await Api.post('/api/user/add-restaurant-to-saved', { userId, restaurantId }, getAuthConfig());
    return response.data; // Adjust as per your API response structure
  } catch (error) {
    throw error; // Re-throwing the error for centralized error handling
  }
};

// Delete user API
export const deleteUserApi = (id) => Api.delete(`/api/user/delete/${id}`, getAuthConfig());

// Restaurant APIs
export const createRestaurantApi = (data) => Api.post('/api/restaurant/createRestaurant', data);
export const loginRestaurantApi = (data) => Api.post('/api/restaurant/loginRestaurant', data);
export const getAllRestaurantApi = () => Api.get('/api/restaurant/getAllRestaurants');
export const getSingleRestaurantApi = (id) => Api.get(`/api/restaurant/restaurant/${id}`, getAuthConfig());

// Update restaurant approval status
export const updateRestaurantApprovalApi = (id, approvalStatus) => 
  Api.put(`/api/restaurant/restaurant/${id}/approve`, { approved: approvalStatus }, getAuthConfig());

// Request reset code
export const requestResetCodeApi = (data) => Api.post('/api/user/forgot-password', data);
export const resetPasswordApi = (data) => Api.put('/api/user/reset-password', data);

// Reservation API
export const createReservationApi = async (reservationData) => {
  try {
    const response = await Api.post('/api/reservations/create_reservation', reservationData, getAuthConfig());
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

export const getReservationByRestaurantId = (id) => Api.get(`/api/reservations/restaurant/${id}`, getAuthConfig());
export const getReservationByUserId = (id) => Api.get(`/api/reservations/user/${id}`, getAuthConfig());
export const deleteReservationApi = (id) => Api.delete(`/api/reservations/${id}`, getAuthConfig());

// Function to update reservation status
export const updateReservationStatusApi = async (reservationId, status) => {
  try {
    // Use the correct endpoint format for updating the reservation status
    const response = await Api.put(`/api/reservations/${reservationId}/update_status`, 
      { status }, 
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    // Detailed error handling
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error('Error response:', error.response);
      throw new Error(`Error updating reservation status: ${error.response.status} ${error.response.statusText}`);
    } else if (error.request) {
      // Request was made but no response received
      console.error('Error request:', error.request);
      throw new Error('Error updating reservation status: No response received from server');
    } else {
      // Something else happened
      console.error('Error message:', error.message);
      throw new Error(`Error updating reservation status: ${error.message}`);
    }
  }
};

// Reviews API
export const createReviewApi = (data) => Api.post('/api/reviews/create_review', data);
export const getAllReviewsApi = () => Api.get('/api/reviews/getAllReviews');

export default Api;
