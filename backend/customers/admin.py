

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Company, User, UserCompany, Customer, Interaction


# ============================================
# USER COMPANY INLINE (shows companies in user admin)
# ============================================
class UserCompanyInline(admin.TabularInline):
    model = UserCompany
    extra = 1
    fields = ['company', 'role', 'is_active', 'joined_at']
    readonly_fields = ['joined_at']


# ============================================
# CUSTOM USER ADMIN
# ============================================
@admin.register(User)
class CustomUserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'default_company', 'phone', 'is_active', 'is_staff']
    search_fields = ['username', 'email', 'phone']
    list_filter = ['is_active', 'is_staff', 'default_company']
    ordering = ['username']
    
    # Fields shown when editing an existing user
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'email', 'phone')}),
        ('Company', {'fields': ('default_company',)}),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        ('Important Dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    # Fields shown when creating a new user
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'default_company', 'phone'),
        }),
    )
    
    # Show companies inline
    inlines = [UserCompanyInline]


# ============================================
# USER COMPANY ADMIN
# ============================================
@admin.register(UserCompany)
class UserCompanyAdmin(admin.ModelAdmin):
    list_display = ['user', 'company', 'role', 'is_active', 'joined_at']
    list_filter = ['role', 'is_active', 'company']
    search_fields = ['user__username', 'user__email', 'company__name']
    ordering = ['-joined_at']
    readonly_fields = ['joined_at']


# ============================================
# COMPANY ADMIN
# ============================================
@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['name', 'subdomain', 'email', 'phone', 'is_active', 'created_at']
    search_fields = ['name', 'subdomain', 'email', 'phone']
    list_filter = ['is_active', 'created_at']
    prepopulated_fields = {'subdomain': ('name',)}


# ============================================
# CUSTOMER ADMIN
# ============================================
@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['first_name', 'last_name', 'email', 'company', 'phone', 'created_at']
    search_fields = ['first_name', 'last_name', 'email', 'phone', 'company__name']
    list_filter = ['company', 'created_at']
    list_select_related = ['company']


# ============================================
# INTERACTION ADMIN
# ============================================
@admin.register(Interaction)
class InteractionAdmin(admin.ModelAdmin):
    list_display = ['customer', 'company', 'interaction_type', 'subject', 'interaction_date', 'created_at']
    search_fields = ['subject', 'notes', 'customer__first_name', 'customer__last_name', 'company__name']
    list_filter = ['company', 'interaction_type', 'interaction_date', 'created_at']
    date_hierarchy = 'interaction_date'
    list_select_related = ['customer', 'company']