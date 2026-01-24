from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Company, UserProfile, Customer, Interaction
from .serializers import CompanySerializer, UserProfileSerializer, CustomerSerializer, InteractionSerializer


class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [AllowAny]  # Anyone can view companies (for registration)


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Users can only see profiles from their own company
        user_profile = get_object_or_404(UserProfile, user=self.request.user)
        return UserProfile.objects.filter(company=user_profile.company)


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Users can only see customers from their own company
        user_profile = get_object_or_404(UserProfile, user=self.request.user)
        return Customer.objects.filter(company=user_profile.company)
    
    def perform_create(self, serializer):
        # Automatically assign user's company when creating customer
        user_profile = get_object_or_404(UserProfile, user=self.request.user)
        serializer.save(company=user_profile.company)


class InteractionViewSet(viewsets.ModelViewSet):
    queryset = Interaction.objects.all()
    serializer_class = InteractionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Users can only see interactions from their own company
        user_profile = get_object_or_404(UserProfile, user=self.request.user)
        queryset = Interaction.objects.filter(company=user_profile.company)
        
        # Optional: filter by customer
        customer_id = self.request.query_params.get('customer', None)
        if customer_id:
            queryset = queryset.filter(customer_id=customer_id)
        
        return queryset
    
    def perform_create(self, serializer):
        # Automatically assign user's company when creating interaction
        user_profile = get_object_or_404(UserProfile, user=self.request.user)
        serializer.save(company=user_profile.company)