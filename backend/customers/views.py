from rest_framework import viewsets
from .models import Customer, Interaction
from .serializers import CustomerSerializer, InteractionSerializer


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer


class InteractionViewSet(viewsets.ModelViewSet):
    queryset = Interaction.objects.all()
    serializer_class = InteractionSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        customer_id = self.request.query_params.get('customer', None)
        if customer_id:
            queryset = queryset.filter(customer_id=customer_id)
        return queryset