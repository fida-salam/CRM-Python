from django.contrib import admin
from .models import Company, UserProfile, Customer, Interaction


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['name', 'subdomain', 'email', 'is_active', 'created_at']
    search_fields = ['name', 'subdomain', 'email']
    list_filter = ['is_active', 'created_at']
    prepopulated_fields = {'subdomain': ('name',)}


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'company', 'role', 'phone']
    search_fields = ['user__username', 'company__name']
    list_filter = ['role', 'company']


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['first_name', 'last_name', 'email', 'company', 'company_name', 'created_at']
    search_fields = ['first_name', 'last_name', 'email', 'company__name']
    list_filter = ['company', 'created_at']


@admin.register(Interaction)
class InteractionAdmin(admin.ModelAdmin):
    list_display = ['customer', 'company', 'interaction_type', 'subject', 'interaction_date', 'created_at']
    search_fields = ['subject', 'notes', 'customer__first_name', 'customer__last_name']
    list_filter = ['company', 'interaction_type', 'interaction_date', 'created_at']
    date_hierarchy = 'interaction_date'