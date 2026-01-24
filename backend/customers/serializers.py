from rest_framework import serializers
from .models import Customer, Interaction


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'


class InteractionSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.__str__', read_only=True)
    
    class Meta:
        model = Interaction
        fields = [
            'id',
            'customer',
            'customer_name',
            'interaction_type',
            'subject',
            'notes',
            'interaction_date',
            'created_at'
        ]
        read_only_fields = ['created_at']