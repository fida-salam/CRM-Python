import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboardApi';

export const useDashboard = () => {
  // Fetch dashboard stats
  const { 
    data: stats, 
    isLoading: isLoadingStats, 
    error: statsError,
    refetch: refetchStats 
  } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardApi.getStats,
  });

  // Fetch recent activities
  const { 
    data: activities = [], 
    isLoading: isLoadingActivities, 
    error: activitiesError,
    refetch: refetchActivities 
  } = useQuery({
    queryKey: ['dashboard-activities'],
    queryFn: dashboardApi.getActivities,
  });

  // Fetch ML insights
  const { 
    data: insights, 
    isLoading: isLoadingInsights, 
    error: insightsError,
    refetch: refetchInsights 
  } = useQuery({
    queryKey: ['dashboard-insights'],
    queryFn: dashboardApi.getInsights,
  });

  // Refetch all data
  const refetch = () => {
    refetchStats();
    refetchActivities();
    refetchInsights();
  };

  return {
    stats,
    activities,
    insights,
    isLoading: isLoadingStats || isLoadingActivities || isLoadingInsights,
    error: statsError || activitiesError || insightsError,
    refetch,
  };
};