

from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractUser


class Company(models.Model):
    """Company/Organization model"""
    name = models.CharField(max_length=200)
    subdomain = models.SlugField(max_length=50, unique=True)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = 'Companies'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class User(AbstractUser):
    """Custom User model with multi-company support"""
    
    # Multi-company relationship (Many-to-Many through UserCompany)
    companies = models.ManyToManyField(
        'Company',
        through='UserCompany',
        related_name='users',
        blank=True
    )
    
    # Default/Current company for this user session
    default_company = models.ForeignKey(
        'Company',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='default_users',
        help_text='Currently active company for this user'
    )
    
    phone = models.CharField(max_length=20, blank=True)
    
    class Meta:
        ordering = ['username']
    
    def __str__(self):
        if self.default_company:
            return f"{self.username} - {self.default_company.name}"
        return f"{self.username} - No Company"
    
    def get_role_in_company(self, company):
        """Get user's role in a specific company"""
        try:
            user_company = self.usercompany_set.get(company=company)
            return user_company.role
        except UserCompany.DoesNotExist:
            return None
    
    def get_companies_list(self):
        """Get list of companies with roles"""
        return self.usercompany_set.select_related('company').filter(is_active=True)


class UserCompany(models.Model):
    """Through model for User-Company relationship with role per company"""
    
    ROLE_CHOICES = [
        ('super_admin', 'Super Admin'),
        ('admin', 'Admin'),
        ('manager', 'Manager'),
        ('user', 'User'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')
    is_active = models.BooleanField(default=True)
    joined_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'company']
        ordering = ['-joined_at']
        verbose_name = 'User Company Membership'
        verbose_name_plural = 'User Company Memberships'
    
    def __str__(self):
        return f"{self.user.username} - {self.company.name} ({self.role})"


class Customer(models.Model):
    """Customer model - belongs to one company"""
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='customers')
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ['company', 'email']
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Interaction(models.Model):
    """Interaction model - belongs to one company"""
    
    INTERACTION_TYPES = [
        ('call', 'Phone Call'),
        ('email', 'Email'),
        ('meeting', 'Meeting'),
        ('note', 'Note'),
    ]
    
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='interactions')
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='interactions')
    interaction_type = models.CharField(max_length=20, choices=INTERACTION_TYPES, default='note')
    subject = models.CharField(max_length=200)
    notes = models.TextField(blank=True)
    interaction_date = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-interaction_date']
    
    def __str__(self):
        return f"{self.interaction_type} - {self.customer.first_name} {self.customer.last_name} - {self.subject}"