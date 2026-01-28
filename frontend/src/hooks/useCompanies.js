import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companyApi } from '../api/companyApi';

export const useCompanies = () => {
  const queryClient = useQueryClient();

  // Fetch all companies
  const { data: companies = [], isLoading, error } = useQuery({
    queryKey: ['companies'],
    queryFn: companyApi.getAll,
  });

  // Create company mutation
  const { mutate: createCompany, isPending: isCreating } = useMutation({
    mutationFn: companyApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });

  // Update company mutation
  const { mutate: updateCompany, isPending: isUpdating } = useMutation({
    mutationFn: companyApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });

  // Delete company mutation
  const { mutate: deleteCompany, isPending: isDeleting } = useMutation({
    mutationFn: companyApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });

  return {
    companies,
    isLoading,
    error,
    createCompany,
    updateCompany,
    deleteCompany,
    isCreating,
    isUpdating,
    isDeleting,
  };
};