import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getChirps, 
  getTrendingTopics, 
  getUser, 
  createChirp, 
  authenticateUser, 
  registerUser,
  getWhoToFollow,
  searchUsers,
  searchChirps,
  likeChirp,
  unlikeChirp,
  rechirpChirp,
  unrechirpChirp,
  replyToChirp,
  deleteChirp,
  updateChirp,
  getUserProfile,
  updateUserProfile,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getUserChirps,
  getChirpDetail,
  getNotifications
} from '@/services/api';

// Chirps
export const useChirps = () => {
  return useQuery({
    queryKey: ['chirps'],
    queryFn: getChirps,
  });
};

export const useCreateChirp = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ content, userId }: { content: string; userId: string }) => 
      createChirp(content, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chirps'] });
    },
  });
};

// Trending
export const useTrending = () => {
  return useQuery({
    queryKey: ['trending'],
    queryFn: getTrendingTopics,
  });
};

// User
export const useUser = (username: string) => {
  return useQuery({
    queryKey: ['user', username],
    queryFn: () => getUser(username),
    enabled: !!username,
  });
};

// Auth
export const useLogin = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => 
      authenticateUser(email, password),
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: ({ email, password, username, name }: { 
      email: string; 
      password: string; 
      username: string; 
      name: string;
    }) => registerUser(email, password, username, name),
  });
};

// Who to follow
export const useWhoToFollow = () => {
  return useQuery({
    queryKey: ['whoToFollow'],
    queryFn: getWhoToFollow,
  });
};

// Search
export const useSearchUsers = (searchTerm: string) => {
  return useQuery({
    queryKey: ['searchUsers', searchTerm],
    queryFn: () => searchUsers(searchTerm),
    enabled: searchTerm.length > 2,
  });
};

export const useSearchChirps = (searchTerm: string) => {
  return useQuery({
    queryKey: ['searchChirps', searchTerm],
    queryFn: () => searchChirps(searchTerm),
    enabled: searchTerm.length > 2,
  });
};

// Chirp interactions
export const useLikeChirp = () => {
  return useMutation({
    mutationFn: ({ chirpId, userId }: { chirpId: string; userId: string }) => 
      likeChirp(chirpId, userId),
  });
};

export const useUnlikeChirp = () => {
  return useMutation({
    mutationFn: ({ chirpId, userId }: { chirpId: string; userId: string }) => 
      unlikeChirp(chirpId, userId),
  });
};

export const useRechirp = () => {
  return useMutation({
    mutationFn: ({ chirpId, userId }: { chirpId: string; userId: string }) => 
      rechirpChirp(chirpId, userId),
  });
};

export const useUnrechirp = () => {
  return useMutation({
    mutationFn: ({ chirpId, userId }: { chirpId: string; userId: string }) => 
      unrechirpChirp(chirpId, userId),
  });
};

export const useReplyToChirp = () => {
  return useMutation({
    mutationFn: ({ chirpId, content, userId }: { chirpId: string; content: string; userId: string }) => 
      replyToChirp(chirpId, content, userId),
  });
};

export const useDeleteChirp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ chirpId, userId }: { chirpId: string; userId: string }) => 
      deleteChirp(chirpId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chirps'] });
    },
  });
};

export const useUpdateChirp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ chirpId, content, userId }: { chirpId: string; content: string; userId: string }) => 
      updateChirp(chirpId, content, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chirps'] });
    },
  });
};

// User profile hooks
export const useUserProfile = (userId: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => getUserProfile(userId),
    enabled: options?.enabled !== undefined ? options.enabled : !!userId,
  });
};

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: ({ userId, profileData }: { userId: string; profileData: any }) => 
      updateUserProfile(userId, profileData),
  });
};

export const useFollowUser = () => {
  return useMutation({
    mutationFn: ({ followerId, followeeId }: { followerId: string; followeeId: string }) => 
      followUser(followerId, followeeId),
  });
};

export const useUnfollowUser = () => {
  return useMutation({
    mutationFn: ({ followerId, followeeId }: { followerId: string; followeeId: string }) => 
      unfollowUser(followerId, followeeId),
  });
};

export const useFollowers = (userId: string) => {
  return useQuery({
    queryKey: ['followers', userId],
    queryFn: () => getFollowers(userId),
    enabled: !!userId,
  });
};

export const useFollowing = (userId: string) => {
  return useQuery({
    queryKey: ['following', userId],
    queryFn: () => getFollowing(userId),
    enabled: !!userId,
  });
};

export const useUserChirps = (userId: string) => {
  return useQuery({
    queryKey: ['userChirps', userId],
    queryFn: () => getUserChirps(userId),
    enabled: !!userId,
  });
};

export const useChirpDetail = (chirpId: string) => {
  return useQuery({
    queryKey: ['chirpDetail', chirpId],
    queryFn: () => getChirpDetail(chirpId),
    enabled: !!chirpId,
  });
};

export const useNotifications = (userId: string) => {
  return useQuery({
    queryKey: ['notifications', userId],
    queryFn: () => getNotifications(userId),
    enabled: !!userId,
  });
};