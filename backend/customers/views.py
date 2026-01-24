from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Company, UserProfile, Customer, Interaction
from .serializers import CompanySerializer, UserProfileSerializer, CustomerSerializer, InteractionSerializer


class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        company_id = self.request.query_params.get('company', None)
        if company_id:
            queryset = queryset.filter(company_id=company_id)
        return queryset


class InteractionViewSet(viewsets.ModelViewSet):
    queryset = Interaction.objects.all()
    serializer_class = InteractionSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        company_id = self.request.query_params.get('company', None)
        customer_id = self.request.query_params.get('customer', None)
        
        if company_id:
            queryset = queryset.filter(company_id=company_id)
        if customer_id:
            queryset = queryset.filter(customer_id=customer_id)
        
        return queryset