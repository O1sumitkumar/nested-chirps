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
  searchChirps
} from '@/services/api';

// Chirps
export const useChirps = () => {
  return useQuery({
    queryKey: ['chirps'],
    queryFn: getChirps,
    refetchInterval: 30000, // Refetch every 30 seconds
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
    refetchInterval: 60000, // Refetch every minute
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
    refetchInterval: 300000, // Refetch every 5 minutes
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