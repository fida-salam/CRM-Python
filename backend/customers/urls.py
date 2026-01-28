# # customers/urls.py - CORRECTED VERSION
# from django.urls import path, include
# from rest_framework.routers import DefaultRouter
# from .views import (
#     register,
#     login,
#     current_user,
#     CompanyViewSet,
#     CustomerViewSet,
#     InteractionViewSet,
#     UserViewSet
# )
# from . import ml_dashboard  # ← IMPORT THE DASHBOARD MODULE

# router = DefaultRouter()
# router.register(r'companies', CompanyViewSet)
# router.register(r'customers', CustomerViewSet)
# router.register(r'interactions', InteractionViewSet)
# router.register(r'users', UserViewSet)

# urlpatterns = [
#     path('', include(router.urls)),
#     path('register/', register, name='register'),
#     path('login/', login, name='login'),
#     path('me/', current_user, name='current_user'),
    
#     # ==================== DASHBOARD ENDPOINTS ====================
#     # Basic Stats
#     path('dashboard/stats/', ml_dashboard.dashboard_stats, name='dashboard-stats'),
    
#     # Recent Activities
#     path('dashboard/recent-activities/', ml_dashboard.recent_activities, name='recent-activities'),
    
#     # ML Insights
#     path('dashboard/ml-insights/', ml_dashboard.ml_insights, name='ml-insights'),
    
#     # Customer Analytics
#     path('dashboard/customer-analytics/', ml_dashboard.customer_analytics, name='customer-analytics'),
#     path('dashboard/customer-analytics/<int:customer_id>/', ml_dashboard.customer_analytics, name='customer-analytics-detail'),
# ]


# # customers/urls.py - Updated with switch-company endpoint
# from django.urls import path, include
# from rest_framework.routers import DefaultRouter
# from .views import (
#     CompanyViewSet,
#     CustomerViewSet,
#     InteractionViewSet,
#     UserViewSet
# )
# from .auth_views import (
#     register,
#     login,
#     current_user,
#     switch_company  # NEW!
# )

# router = DefaultRouter()
# router.register(r'companies', CompanyViewSet)
# router.register(r'customers', CustomerViewSet)
# router.register(r'interactions', InteractionViewSet)
# router.register(r'users', UserViewSet)

# urlpatterns = [
#     path('', include(router.urls)),
    
#     # Auth endpoints
#     path('register/', register, name='register'),
#     path('login/', login, name='login'),
#     path('me/', current_user, name='current_user'),
    
#     # NEW: Company switching endpoint
#     path('switch-company/', switch_company, name='switch-company'),
    
#     # Dashboard endpoints (if you have them)
#     path('dashboard/stats/', ml_dashboard.dashboard_stats, name='dashboard-stats'),
#     path('dashboard/recent-activities/', ml_dashboard.recent_activities, name='recent-activities'),
#     path('dashboard/ml-insights/', ml_dashboard.ml_insights, name='ml-insights'),
#     path('dashboard/customer-analytics/', ml_dashboard.customer_analytics, name='customer-analytics'),
# ]

# customers/urls.py - Updated with switch-company endpoint
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CompanyViewSet,
    CustomerViewSet,
    InteractionViewSet,
    UserViewSet
)
from .auth_views import (
    register,
    login,
    current_user,
    switch_company  # NEW!
)
from . import ml_dashboard  # Import the ml_dashboard module

router = DefaultRouter()
router.register(r'companies', CompanyViewSet)
router.register(r'customers', CustomerViewSet)
router.register(r'interactions', InteractionViewSet)
router.register(r'users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    
    # Auth endpoints
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('me/', current_user, name='current_user'),
    
    # NEW: Company switching endpoint
    path('switch-company/', switch_company, name='switch-company'),
    
    # Dashboard endpoints (if you have them)
    path('dashboard/stats/', ml_dashboard.dashboard_stats, name='dashboard-stats'),
    path('dashboard/recent-activities/', ml_dashboard.recent_activities, name='recent-activities'),
    path('dashboard/ml-insights/', ml_dashboard.ml_insights, name='ml-insights'),
    path('dashboard/customer-analytics/', ml_dashboard.customer_analytics, name='customer-analytics'),
]