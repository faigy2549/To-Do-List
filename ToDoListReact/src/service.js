import axios from 'axios';

// Set up axios defaults
const apiClient = axios.create({
  baseURL:process.env.REACT_APP_API_URL,// Default API base URL
  headers: {
    'Content-Type': 'application/json', // Default headers for JSON API
  },
});

// Add an interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response) => response, // Pass through the successful response
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    // Optionally, handle specific status codes here
    // Example: if (error.response?.status === 401) { handleAuthError(); }
    return Promise.reject(error); // Re-throw the error for local handling
  }
);

export default {
  getTasks: async () => {
    const result = await apiClient.get('/tasks'); // Uses default baseURL
    return result.data;
  },

  addTask: async (name) => {
    console.log('addTask', name);
    const result = await apiClient.post('/tasks', { name, isComplete: false });
    return result.data;
  },

  setCompleted: async (id,name, isComplete) => {
    console.log('setCompleted', { id,name, isComplete });
    const result = await apiClient.put(`/tasks/${id}`, { name,isComplete });
    return result.data;
  },

  deleteTask: async (id) => {
    console.log('deleteTask', { id });
    await apiClient.delete(`/tasks/${id}`);
    console.log('Task deleted');
  },
};
