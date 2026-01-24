from django.contrib import admin
from .models import Customer, Interaction


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['first_name', 'last_name', 'email', 'company', 'created_at']
    search_fields = ['first_name', 'last_name', 'email', 'company']
    list_filter = ['created_at']


@admin.register(Interaction)
class InteractionAdmin(admin.ModelAdmin):
    list_display = ['customer', 'interaction_type', 'subject', 'interaction_date', 'created_at']
    search_fields = ['subject', 'notes', 'customer__first_name', 'customer__last_name']
    list_filter = ['interaction_type', 'interaction_date', 'created_at']
    date_hierarchy = 'interaction_date'