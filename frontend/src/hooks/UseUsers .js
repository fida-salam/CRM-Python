import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../api/userApi';

// Custom hook for all user operations
export const useUsers = () => {
  const queryClient = useQueryClient();

  // GET all users
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: userApi.getAll
  });

  // CREATE user
  const createMutation = useMutation({
    mutationFn: userApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    }
  });

  // UPDATE user
  const updateMutation = useMutation({
    mutationFn: userApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    }
  });

  // DELETE user
  const deleteMutation = useMutation({
    mutationFn: userApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    }
  });

  // ACTIVATE user
  const activateMutation = useMutation({
    mutationFn: userApi.activate,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    }
  });

  return {
    users,
    isLoading,
    error,
    createUser: createMutation.mutate,
    updateUser: updateMutation.mutate,
    deleteUser: deleteMutation.mutate,
    activateUser: activateMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isActivating: activateMutation.isPending
  };
};