from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomerViewSet, InteractionViewSet

router = DefaultRouter()
router.register(r'customers', CustomerViewSet)
router.register(r'interactions', InteractionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]