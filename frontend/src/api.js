import axios from 'axios';

// Base API configuration
const API_URL = 'http://localhost:8000/api';

/**
 * Sends a natural language question to the backend to generate and execute SQL.
 * @param {string} question - The user's question.
 * @returns {Promise<Object>} The API response containing status, generated_sql, and data.
 */
export const askQuestion = async (question) => {
  try {
    const response = await axios.post(`${API_URL}/ask`, { question });
    return response.data;
  } catch (error) {
    // Return a structured error so the UI can handle it gracefully
    if (error.response) {
      throw new Error(error.response.data.detail || 'An error occurred on the server.');
    }
    throw new Error('Could not connect to the server. Is the backend running?');
  }
};
