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
    const token = localStorage.getItem('token');
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        dbUrl: 'mongodb://localhost:27017/chirps',
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
  queryApi({ query: "Get all recent Chirps post, ordered by created date" });

export const getTrendingTopics = () =>
  queryApi({ query: "Get trending hashtags and topics with engagement metrics" });

export const getUser = (username: string) =>
  queryApi({ query: `Get user profile for username: ${username}` });

export const createChirp = (content: string, userId: string) =>
  queryApi({ query: `Create new chirp with content: "${content}" for user: ${userId}` });

export const authenticateUser = async (email: string, password: string) => {
  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      ...data,
      success: typeof data?.success !== 'undefined' ? Boolean(data.success) : true,
      user: data?.user ?? data?.data?.user ?? null,
      token: data?.token ?? data?.data?.token ?? undefined,
      message: data?.message ?? data?.error ?? undefined,
    };
  } catch (error) {
    console.error('Login request failed:', error);
    throw error;
  }
};

export const registerUser = (email: string, password: string, username: string, name: string) =>
  queryApi({ query: `Register new user with email: ${email}, username: ${username}, name: ${name}, password: ${password}` });

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

export const replyToChirp = (chirpId: string, content: string, userId: string) =>
  queryApi({ query: `Reply to chirp ${chirpId} with content: "${content}" by user ${userId}` });

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