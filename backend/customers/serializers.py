from rest_framework import serializers
from .models import Company, UserProfile, Customer, Interaction


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    company_name = serializers.CharField(source='company.name', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'username', 'email', 'company', 'company_name', 'role', 'phone']
        read_only_fields = ['user']


class CustomerSerializer(serializers.ModelSerializer):
    company_display = serializers.CharField(source='company.name', read_only=True)
    
    class Meta:
        model = Customer
        fields = [
            'id',
            'company',
            'company_display',
            'first_name',
            'last_name',
            'email',
            'phone',
            'company_name',
            'address',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class InteractionSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.__str__', read_only=True)
    company_display = serializers.CharField(source='company.name', read_only=True)
    
    class Meta:
        model = Interaction
        fields = [
            'id',
            'company',
            'company_display',
            'customer',
            'customer_name',
            'interaction_type',
            'subject',
            'notes',
            'interaction_date',
            'created_at'
        ]
        read_only_fields = ['created_at']