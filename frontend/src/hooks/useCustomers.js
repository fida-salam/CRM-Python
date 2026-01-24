import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerApi } from '../api/customerApi';

// Custom hook for all customer operations
export const useCustomers = () => {
  const queryClient = useQueryClient();

  // GET all customers
  const { data: customers = [], isLoading, error } = useQuery({
    queryKey: ['customers'],
    queryFn: customerApi.getAll
  });

  // CREATE customer
  const createMutation = useMutation({
    mutationFn: customerApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['customers']);
    }
  });

  // UPDATE customer
  const updateMutation = useMutation({
    mutationFn: customerApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries(['customers']);
    }
  });

  // DELETE customer
  const deleteMutation = useMutation({
    mutationFn: customerApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['customers']);
    }
  });

  return {
    customers,
    isLoading,
    error,
    createCustomer: createMutation.mutate,
    updateCustomer: updateMutation.mutate,
    deleteCustomer: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
};