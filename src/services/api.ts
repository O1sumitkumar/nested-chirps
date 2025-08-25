const API_BASE_URL = 'http://localhost:3000/ai-agent/query';

export interface QueryRequest {
  query: string;
  dbUrl?: string;
  dbType?: string;
  refreshSchema?: boolean;
}

export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
}

export const queryApi = async <T = any>(request: QueryRequest): Promise<T> => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dbUrl: 'i-will-add-later',
        dbType: 'mongodb',
        ...request,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API query failed:', error);
    throw error;
  }
};

// Specific query functions
export const getChirps = () => 
  queryApi({ query: "Get all recent chirps with user details, ordered by created date" });

export const getTrendingTopics = () => 
  queryApi({ query: "Get trending hashtags and topics with engagement metrics" });

export const getUser = (username: string) => 
  queryApi({ query: `Get user profile for username: ${username}` });

export const createChirp = (content: string, userId: string) => 
  queryApi({ query: `Create new chirp with content: "${content}" for user: ${userId}` });

export const authenticateUser = (email: string, password: string) => 
  queryApi({ query: `Authenticate user with email: ${email} and password: ${password}` });

export const registerUser = (email: string, password: string, username: string, name: string) => 
  queryApi({ query: `Register new user with email: ${email}, username: ${username}, name: ${name}, password: ${password}` });

export const getWhoToFollow = () => 
  queryApi({ query: "Get suggested users to follow based on activity and interests" });

export const searchUsers = (searchTerm: string) => 
  queryApi({ query: `Search for users matching: ${searchTerm}` });

export const searchChirps = (searchTerm: string) => 
  queryApi({ query: `Search chirps containing: ${searchTerm}` });