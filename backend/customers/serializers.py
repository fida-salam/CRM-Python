

from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Company, Customer, Interaction, UserCompany

# Get the custom User model
User = get_user_model()


# ============================================
# COMPANY SERIALIZER
# ============================================

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'


# ============================================
# CUSTOMER SERIALIZER
# ============================================

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
            'address',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'company']


# ============================================
# INTERACTION SERIALIZER
# ============================================

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
        read_only_fields = ['created_at', 'company']


# ============================================
# USER COMPANY SERIALIZER
# ============================================

class UserCompanySerializer(serializers.ModelSerializer):
    """Serializer for UserCompany relationship"""
    company_name = serializers.CharField(source='company.name', read_only=True)
    
    class Meta:
        model = UserCompany
        fields = ['id', 'company', 'company_name', 'role', 'is_active', 'joined_at']
        read_only_fields = ['joined_at']


# ============================================
# USER SERIALIZERS (Updated for Multi-Company)
# ============================================

class UserListSerializer(serializers.ModelSerializer):
    """User list serializer with default company and role"""
    default_company_name = serializers.CharField(source='default_company.name', read_only=True)
    companies = serializers.SerializerMethodField()
    current_role = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'is_active',
            'date_joined',
            'phone',
            'default_company',
            'default_company_name',
            'current_role',
            'companies'
        ]
    
    def get_companies(self, obj):
        """Get list of companies user belongs to"""
        user_companies = UserCompany.objects.filter(
            user=obj,
            is_active=True
        ).select_related('company')
        
        return [
            {
                'id': uc.company.id,
                'name': uc.company.name,
                'role': uc.role
            }
            for uc in user_companies
        ]
    
    def get_current_role(self, obj):
        """Get user's role in default company"""
        if obj.default_company:
            try:
                uc = UserCompany.objects.get(user=obj, company=obj.default_company)
                return uc.role
            except UserCompany.DoesNotExist:
                return None
        return None


# class UserCreateUpdateSerializer(serializers.ModelSerializer):
#     """Serializer for creating and updating users"""
#     password = serializers.CharField(write_only=True, required=False, min_length=6)
#     company_id = serializers.IntegerField(write_only=True, required=True)
#     role = serializers.ChoiceField(
#         choices=UserCompany.ROLE_CHOICES,
#         write_only=True,
#         default='user'
#     )
    
#     class Meta:
#         model = User
#         fields = [
#             'id',
#             'username',
#             'email',
#             'password',
#             'first_name',
#             'last_name',
#             'is_active',
#             'phone',
#             'company_id',
#             'role'
#         ]
#         read_only_fields = ['id']
#         extra_kwargs = {
#             'password': {'write_only': True},
#             'email': {'required': True}
#         }
    
#     def validate_username(self, value):
#         """Check if username already exists"""
#         if self.instance is None:  # Creating new user
#             if User.objects.filter(username=value).exists():
#                 raise serializers.ValidationError("Username already exists")
#         else:  # Updating existing user
#             if User.objects.filter(username=value).exclude(id=self.instance.id).exists():
#                 raise serializers.ValidationError("Username already exists")
#         return value
    
#     def validate_email(self, value):
#         """Check if email already exists"""
#         if self.instance is None:  # Creating new user
#             if User.objects.filter(email=value).exists():
#                 raise serializers.ValidationError("Email already exists")
#         else:  # Updating existing user
#             if User.objects.filter(email=value).exclude(id=self.instance.id).exists():
#                 raise serializers.ValidationError("Email already exists")
#         return value
    
#     def validate_company_id(self, value):
#         """Validate company exists"""
#         try:
#             Company.objects.get(id=value)
#         except Company.DoesNotExist:
#             raise serializers.ValidationError("Company does not exist")
#         return value
    
#     def create(self, validated_data):
#         """Create user with UserCompany relationship"""
#         # Extract data
#         company_id = validated_data.pop('company_id')
#         password = validated_data.pop('password')
#         role = validated_data.pop('role', 'user')
        
#         # Create user
#         user = User.objects.create_user(
#             username=validated_data['username'],
#             email=validated_data['email'],
#             password=password,
#             first_name=validated_data.get('first_name', ''),
#             last_name=validated_data.get('last_name', ''),
#             is_active=validated_data.get('is_active', True)
#         )
        
#         user.phone = validated_data.get('phone', '')
        
#         # Set default company
#         company = Company.objects.get(id=company_id)
#         user.default_company = company
#         user.save()
        
#         # Create UserCompany relationship
#         UserCompany.objects.create(
#             user=user,
#             company=company,
#             role=role,
#             is_active=True
#         )
        
#         return user
    
#     def update(self, instance, validated_data):
#         """Update user (but don't change company - use separate endpoint)"""
#         # Extract data
#         password = validated_data.pop('password', None)
#         company_id = validated_data.pop('company_id', None)
#         role = validated_data.pop('role', None)
        
#         # Update basic user fields
#         instance.username = validated_data.get('username', instance.username)
#         instance.email = validated_data.get('email', instance.email)
#         instance.first_name = validated_data.get('first_name', instance.first_name)
#         instance.last_name = validated_data.get('last_name', instance.last_name)
#         instance.is_active = validated_data.get('is_active', instance.is_active)
#         instance.phone = validated_data.get('phone', instance.phone)
        
#         # Update password if provided
#         if password:
#             instance.set_password(password)
        
#         # Update role in current company if provided
#         if role and instance.default_company:
#             try:
#                 uc = UserCompany.objects.get(user=instance, company=instance.default_company)
#                 uc.role = role
#                 uc.save()
#             except UserCompany.DoesNotExist:
#                 pass
        
#         instance.save()
#         return instance


# In serializers.py, replace UserCreateUpdateSerializer with this:

class UserCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating users with multi-company support"""
    password = serializers.CharField(write_only=True, required=False, min_length=6)
    company_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=True,
        help_text="List of company IDs to add user to"
    )
    role = serializers.ChoiceField(
        choices=UserCompany.ROLE_CHOICES,
        write_only=True,
        default='user'
    )
    
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'password',
            'first_name',
            'last_name',
            'is_active',
            'phone',
            'company_ids',
            'role'
        ]
        read_only_fields = ['id']
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True}
        }
    
    def validate_username(self, value):
        """Check if username already exists"""
        if self.instance is None:  # Creating new user
            if User.objects.filter(username=value).exists():
                raise serializers.ValidationError("Username already exists")
        else:  # Updating existing user
            if User.objects.filter(username=value).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError("Username already exists")
        return value
    
    def validate_email(self, value):
        """Check if email already exists"""
        if self.instance is None:  # Creating new user
            if User.objects.filter(email=value).exists():
                raise serializers.ValidationError("Email already exists")
        else:  # Updating existing user
            if User.objects.filter(email=value).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError("Email already exists")
        return value
    
    def validate_company_ids(self, value):
        """Validate all companies exist"""
        if not value:
            raise serializers.ValidationError("At least one company is required")
        
        # Check all company IDs exist
        existing_ids = Company.objects.filter(id__in=value).values_list('id', flat=True)
        if len(existing_ids) != len(value):
            missing = set(value) - set(existing_ids)
            raise serializers.ValidationError(f"Companies not found: {missing}")
        
        return value
    
    def create(self, validated_data):
        """Create user with UserCompany relationships for multiple companies"""
        # Extract data
        company_ids = validated_data.pop('company_ids')
        password = validated_data.pop('password')
        role = validated_data.pop('role', 'user')
        
        # Create user
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=password,
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            is_active=validated_data.get('is_active', True)
        )
        
        user.phone = validated_data.get('phone', '')
        
        # Get companies
        companies = Company.objects.filter(id__in=company_ids)
        
        # Set default company (first in list)
        if companies.exists():
            user.default_company = companies.first()
            user.save()
        
        # Create UserCompany relationships for all companies
        for company in companies:
            UserCompany.objects.create(
                user=user,
                company=company,
                role=role,
                is_active=True
            )
        
        return user
    
    def update(self, instance, validated_data):
        """Update user (handles updating role in current company)"""
        # Extract data
        password = validated_data.pop('password', None)
        company_ids = validated_data.pop('company_ids', None)
        role = validated_data.pop('role', None)
        
        # Update basic user fields
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.is_active = validated_data.get('is_active', instance.is_active)
        instance.phone = validated_data.get('phone', instance.phone)
        
        # Update password if provided
        if password:
            instance.set_password(password)
        
        # Handle company updates if provided
        if company_ids:
            # Remove existing UserCompany records
            UserCompany.objects.filter(user=instance).delete()
            
            # Create new UserCompany records
            companies = Company.objects.filter(id__in=company_ids)
            for company in companies:
                UserCompany.objects.create(
                    user=instance,
                    company=company,
                    role=role or 'user',
                    is_active=True
                )
            
            # Update default company if needed
            if companies.exists() and instance.default_company not in companies:
                instance.default_company = companies.first()
        
        # Update role in current company if role provided but no company_ids
        elif role and instance.default_company:
            try:
                uc = UserCompany.objects.get(user=instance, company=instance.default_company)
                uc.role = role
                uc.save()
            except UserCompany.DoesNotExist:
                pass
        
        instance.save()
        return instance
# ============================================
# SIMPLE USER INFO SERIALIZER (for login/me)
# ============================================

class UserInfoSerializer(serializers.ModelSerializer):
    """Simple serializer for login/current user info"""
    default_company_name = serializers.CharField(source='default_company.name', read_only=True)
    current_role = serializers.SerializerMethodField()
    companies = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'phone',
            'default_company',
            'default_company_name',
            'current_role',
            'companies'
        ]
    
    def get_current_role(self, obj):
        """Get user's role in default company"""
        if obj.default_company:
            try:
                uc = UserCompany.objects.get(user=obj, company=obj.default_company)
                return uc.role
            except UserCompany.DoesNotExist:
                return None
        return None
    
    def get_companies(self, obj):
        """Get list of companies user belongs to"""
        user_companies = UserCompany.objects.filter(
            user=obj,
            is_active=True
        ).select_related('company')
        
        return [
            {
                'id': uc.company.id,
                'name': uc.company.name,
                'role': uc.role,
                'subdomain': uc.company.subdomain
            }
            for uc in user_companies
        ]