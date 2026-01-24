import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { interactionApi } from '../api/interactionApi';

// Custom hook for all interaction operations
export const useInteractions = (customerId = null) => {
  const queryClient = useQueryClient();

  // GET all interactions (with optional customer filter)
  const { data: interactions = [], isLoading, error } = useQuery({
    queryKey: customerId ? ['interactions', customerId] : ['interactions'],
    queryFn: () => interactionApi.getAll(customerId)
  });

  // CREATE interaction
  const createMutation = useMutation({
    mutationFn: interactionApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['interactions']);
    }
  });

  // UPDATE interaction
  const updateMutation = useMutation({
    mutationFn: interactionApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries(['interactions']);
    }
  });

  // DELETE interaction
  const deleteMutation = useMutation({
    mutationFn: interactionApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['interactions']);
    }
  });

  return {
    interactions,
    isLoading,
    error,
    createInteraction: createMutation.mutate,
    updateInteraction: updateMutation.mutate,
    deleteInteraction: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
};