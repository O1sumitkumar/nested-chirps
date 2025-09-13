import { API_CONFIG, buildApiUrl } from '@/lib/config';
import type { User } from '@/store/slices/authSlice';

const API_BASE_URL = buildApiUrl(API_CONFIG.ENDPOINTS.QUERY);

// API Response Types
export interface AuthResponse {
  success: boolean;
  data?: User;
  token?: string;
  message?: string;
}

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
    const token = localStorage.getItem('token');
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        dbUrl: API_CONFIG.DEFAULT_DB.URL,
        dbType: API_CONFIG.DEFAULT_DB.TYPE,
        // refreshSchema: true,
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
  queryApi({ query: "Get all recent Chirps post, ordered by created date" });

export const getTrendingTopics = () =>
  queryApi({ query: "Get trending hashtags and topics with engagement metrics" });

export const getUser = (username: string) =>
  queryApi({ query: `Get user profile for username: ${username}` });

// Chirp creation payload interface - matches backend format
export interface CreateChirpPayload {
  userid: string;
  username: string;
  displayname: string;
  handle: string;
  avatar: string;
  isverified: boolean;
  content: string;
  mediaurls: string[];
  hashtags: string[];
  mentions: string[];
  location?: string | null;
  visibility: string;
  isreply: boolean;
  parentchirpid?: string | null;
  threadid?: string;
}

export const createChirp = (payload: CreateChirpPayload) => {
  const query = `create chirps with data: ${JSON.stringify(payload)}`;
  return queryApi({ query });
};

export const authenticateUser = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    // For development/testing - create a mock user if the API is not available
    const mockUser = {
      id: '1',
      name: 'John Doe',
      username: 'johndoe',
      email: email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      verified: true
    };

    const mockToken = 'mock-jwt-token-' + Date.now();

    // Try the real API first
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.LOGIN), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const apiData = await response.json();

        // Transform API response to match our User interface
        const transformedUser = {
          id: apiData.data._id,
          name: apiData.data.fullName,
          username: apiData.data.username,
          email: apiData.data.email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${apiData.data.username}`,
          verified: false
        };

        return {
          success: true,
          data: transformedUser,
          token: apiData.token,
          message: apiData.message
        };
      } else {
        const errorData = await response.json();
        return {
          success: false,
          message: errorData.message || 'Login failed'
        };
      }
    } catch (apiError) {
      console.log('API not available, using mock authentication');
    }

    // Fallback to mock authentication for development
    return {
      success: true,
      data: mockUser,
      token: mockToken,
      message: 'Successfully logged in (mock)'
    };
  } catch (error) {
    console.error('Login request failed:', error);
    throw error;
  }
};

export const registerUser = async (email: string, password: string, username: string, name: string): Promise<AuthResponse> => {
  try {
    // For development/testing - create a mock user if the API is not available
    const mockUser = {
      id: Date.now().toString(),
      name: name,
      username: username,
      email: email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      verified: false
    };

    // Try the real API first
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.SIGNUP), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username, fullName: name }),
      });

      if (response.ok) {
        const apiData = await response.json();

        // Transform API response to match our User interface
        const transformedUser = {
          id: apiData.data._id,
          name: apiData.data.fullName,
          username: apiData.data.username,
          email: apiData.data.email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${apiData.data.username}`,
          verified: false
        };

        return {
          success: true,
          data: transformedUser,
          token: apiData.token,
          message: apiData.message
        };
      } else {
        const errorData = await response.json();
        return {
          success: false,
          message: errorData.message || 'Registration failed'
        };
      }
    } catch (apiError) {
      console.log('API not available, using mock registration');
    }

    // Fallback to mock registration for development
    return {
      success: true,
      data: mockUser,
      message: 'Successfully registered (mock)'
    };
  } catch (error) {
    console.error('Registration request failed:', error);
    throw error;
  }
};

export const getWhoToFollow = () =>
  queryApi({ query: "Get suggested users to follow based on activity and interests" });

export const searchUsers = (searchTerm: string) =>
  queryApi({ query: `Search for users matching: ${searchTerm}` });

export const searchChirps = (searchTerm: string) =>
  queryApi({ query: `Search chirps containing: ${searchTerm}` });

// Chirp interactions
export const likeChirp = (chirpId: string, userId: string) =>
  queryApi({ query: `Like chirp ${chirpId} by user ${userId}` });

export const unlikeChirp = (chirpId: string, userId: string) =>
  queryApi({ query: `Unlike chirp ${chirpId} by user ${userId}` });

export const rechirpChirp = (chirpId: string, userId: string) =>
  queryApi({ query: `Retweet chirp ${chirpId} by user ${userId}` });

export const unrechirpChirp = (chirpId: string, userId: string) =>
  queryApi({ query: `Remove retweet of chirp ${chirpId} by user ${userId}` });

export const replyToChirp = (payload: CreateChirpPayload & { parentchirpid: string; threadid: string }) => {
  const query = `create chirps with data: ${JSON.stringify(payload)}`;
  return queryApi({ query });
};

export const deleteChirp = (chirpId: string, userId: string) =>
  queryApi({ query: `Delete chirp ${chirpId} by user ${userId}` });

export const updateChirp = (chirpId: string, content: string, userId: string) =>
  queryApi({ query: `Update chirp ${chirpId} with new content: "${content}" by user ${userId}` });

// User profile and relationships
export const getUserProfile = (userId: string) =>
  queryApi({ query: `Get detailed user profile for user ID: ${userId}` });

export const updateUserProfile = (userId: string, profileData: any) =>
  queryApi({ query: `Update user profile for ${userId} with data: ${JSON.stringify(profileData)}` });

export const followUser = (followerId: string, followeeId: string) =>
  queryApi({ query: `User ${followerId} follows user ${followeeId}` });

export const unfollowUser = (followerId: string, followeeId: string) =>
  queryApi({ query: `User ${followerId} unfollows user ${followeeId}` });

export const getFollowers = (userId: string) =>
  queryApi({ query: `Get all followers of user ${userId}` });

export const getFollowing = (userId: string) =>
  queryApi({ query: `Get all users that user ${userId} is following` });

export const getUserChirps = (userId: string) =>
  queryApi({ query: `Get all chirps posted by user ${userId} ordered by date` });

export const getChirpDetail = (chirpId: string) =>
  queryApi({ query: `Get detailed chirp information for chirp ${chirpId} including replies` });

export const getNotifications = (userId: string) =>
  queryApi({ query: `Get notifications for user ${userId} including likes, follows, replies` });

export const markNotificationRead = (notificationId: string) =>
  queryApi({ query: `Mark notification ${notificationId} as read` });