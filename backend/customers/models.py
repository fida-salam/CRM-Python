from django.db import models
from django.utils import timezone

class Customer(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    company = models.CharField(max_length=200, blank=True)
    address = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    
    class Meta:
        ordering = ['-created_at']


class Interaction(models.Model):
    INTERACTION_TYPES = [
        ('call', 'Phone Call'),
        ('email', 'Email'),
        ('meeting', 'Meeting'),
        ('note', 'Note'),
    ]
    
    customer = models.ForeignKey(
        Customer, 
        on_delete=models.CASCADE, 
        related_name='interactions'
    )
    interaction_type = models.CharField(
        max_length=20, 
        choices=INTERACTION_TYPES,
        default='note'
    )
    subject = models.CharField(max_length=200)
    notes = models.TextField(blank=True)
    interaction_date = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-interaction_date']
    
    def __str__(self):
        return f"{self.interaction_type} - {self.customer.first_name} {self.customer.last_name} - {self.subject}"