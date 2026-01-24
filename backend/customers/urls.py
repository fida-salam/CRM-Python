from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import CompanyViewSet, UserProfileViewSet, CustomerViewSet, InteractionViewSet
from .auth_views import register, login, current_user

router = DefaultRouter()
router.register(r'companies', CompanyViewSet)
router.register(r'userprofiles', UserProfileViewSet)
router.register(r'customers', CustomerViewSet)
router.register(r'interactions', InteractionViewSet)

urlpatterns = [
    # Authentication endpoints
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', current_user, name='current_user'),
    
    # API routes
    path('', include(router.urls)),
]