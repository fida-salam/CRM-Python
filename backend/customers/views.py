# from django.contrib.auth import authenticate
# from rest_framework import viewsets, status, permissions
# from rest_framework.decorators import api_view, permission_classes, action
# from rest_framework.response import Response
# from rest_framework.permissions import IsAuthenticated, AllowAny
# from rest_framework_simplejwt.tokens import RefreshToken
# from django.contrib.auth import get_user_model
# from .models import Company, Customer, Interaction
# from .serializers import (
#     CompanySerializer, 
#     CustomerSerializer, 
#     InteractionSerializer,
#     UserListSerializer,
#     UserCreateUpdateSerializer
# )

# # Get the custom User model
# User = get_user_model()


# # ============================================
# # CUSTOM PERMISSION CLASSES
# # ============================================

# class IsSuperAdmin(permissions.BasePermission):
#     """Only Super Admin can perform certain actions"""
    
#     def has_permission(self, request, view):
#         if not request.user.is_authenticated:
#             return False
#         # Direct check on user.role field
#         return hasattr(request.user, 'role') and request.user.role == 'super_admin'


# class IsAdminOrSuperAdmin(permissions.BasePermission):
#     """Allow Company Admin or Super Admin"""
    
#     def has_permission(self, request, view):
#         if not request.user.is_authenticated:
#             return False
#         # Direct check on user.role field
#         return hasattr(request.user, 'role') and request.user.role in ['super_admin', 'admin']


# class CanDeleteCompany(permissions.BasePermission):
#     """Only Super Admin can delete companies, not default company"""
    
#     def has_object_permission(self, request, view, obj):
#         if not request.user.is_authenticated:
#             return False
        
#         # Direct check on user.role field
#         if not hasattr(request.user, 'role') or request.user.role != 'super_admin':
#             return False
            
#         # Cannot delete default system company
#         if obj.subdomain == 'system' and obj.name == 'System Administration':
#             return False
            
#         return True


# class CanDeleteUser(permissions.BasePermission):
#     """Check if user can delete another user"""
    
#     def has_object_permission(self, request, view, obj):
#         if not request.user.is_authenticated:
#             return False
        
#         current_user = request.user
#         target_user = obj
        
#         # Cannot delete yourself
#         if obj.id == request.user.id:
#             return False
            
#         # Super admin can delete anyone (except themselves)
#         if hasattr(current_user, 'role') and current_user.role == 'super_admin':
#             return True
            
#         # Company admin can delete users in same company
#         if hasattr(current_user, 'role') and current_user.role == 'admin':
#             return (
#                 current_user.company == target_user.company and
#                 current_user.company is not None and
#                 hasattr(target_user, 'role') and 
#                 target_user.role != 'super_admin'  # Cannot delete super admin
#             )
            
#         return False


# # ============================================
# # AUTH VIEWS (login, register, current_user)
# # ============================================

# @api_view(['POST'])
# @permission_classes([AllowAny])
# def login(request):
#     """User login"""
#     username = request.data.get('username')
#     password = request.data.get('password')
    
#     if not username or not password:
#         return Response(
#             {'error': 'Username and password are required'},
#             status=status.HTTP_400_BAD_REQUEST
#         )
    
#     # Authenticate user
#     user = authenticate(username=username, password=password)
    
#     if user is None:
#         return Response(
#             {'error': 'Invalid credentials'},
#             status=status.HTTP_401_UNAUTHORIZED
#         )
    
#     # Generate JWT tokens
#     refresh = RefreshToken.for_user(user)
    
#     return Response({
#         'message': 'Login successful',
#         'user': {
#             'id': user.id,
#             'username': user.username,
#             'email': user.email,
#             'company_id': user.company.id if hasattr(user, 'company') and user.company else None,
#             'company_name': user.company.name if hasattr(user, 'company') and user.company else None,
#             'role': user.role if hasattr(user, 'role') else 'user',
#             'phone': user.phone if hasattr(user, 'phone') else ''
#         },
#         'tokens': {
#             'refresh': str(refresh),
#             'access': str(refresh.access_token),
#         }
#     })


# @api_view(['POST'])
# @permission_classes([AllowAny])
# def register(request):
#     """User registration"""
#     username = request.data.get('username')
#     email = request.data.get('email')
#     password = request.data.get('password')
#     company_name = request.data.get('company_name')
#     role = request.data.get('role', 'user')
    
#     if not username or not password:
#         return Response(
#             {'error': 'Username and password are required'},
#             status=status.HTTP_400_BAD_REQUEST
#         )
    
#     # Check if username exists
#     if User.objects.filter(username=username).exists():
#         return Response(
#             {'error': 'Username already exists'},
#             status=status.HTTP_400_BAD_REQUEST
#         )
    
#     # Create company if provided
#     company = None
#     if company_name:
#         company = Company.objects.create(
#             name=company_name,
#             subdomain=company_name.lower().replace(' ', '-'),
#             email=email,
#             is_active=True
#         )
#         # First user of company becomes admin
#         if role == 'user':
#             role = 'admin'
    
#     # Create user with role and company
#     user = User.objects.create_user(
#         username=username,
#         email=email,
#         password=password
#     )
    
#     # Add our custom fields
#     user.role = role
#     user.company = company
#     user.phone = request.data.get('phone', '')
#     user.save()
    
#     # Generate JWT tokens
#     refresh = RefreshToken.for_user(user)
    
#     return Response({
#         'message': 'User registered successfully',
#         'user': {
#             'id': user.id,
#             'username': user.username,
#             'email': user.email,
#             'company_id': company.id if company else None,
#             'company_name': company.name if company else None,
#             'role': role,
#             'phone': user.phone
#         },
#         'tokens': {
#             'refresh': str(refresh),
#             'access': str(refresh.access_token),
#         }
#     }, status=status.HTTP_201_CREATED)


# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def current_user(request):
#     """Get current logged-in user info"""
#     user = request.user
    
#     return Response({
#         'id': user.id,
#         'username': user.username,
#         'email': user.email,
#         'company_id': user.company.id if hasattr(user, 'company') and user.company else None,
#         'company_name': user.company.name if hasattr(user, 'company') and user.company else None,
#         'role': user.role if hasattr(user, 'role') else 'user',
#         'phone': user.phone if hasattr(user, 'phone') else ''
#     })


# # ============================================
# # USER VIEWSET
# # ============================================

# class UserViewSet(viewsets.ModelViewSet):
#     """User CRUD operations"""
#     permission_classes = [IsAuthenticated]
#     queryset = User.objects.all()
    
#     def get_serializer_class(self):
#         if self.action == 'list' or self.action == 'retrieve':
#             return UserListSerializer
#         return UserCreateUpdateSerializer
    
#     def get_queryset(self):
#         """Return users based on role"""
#         user = self.request.user
        
#         if not user.is_authenticated:
#             return User.objects.none()
        
#         # Super admin sees all users
#         if hasattr(user, 'role') and user.role == 'super_admin':
#             return User.objects.filter(is_active=True).select_related('company')
        
#         # Company admin sees users in their company
#         elif hasattr(user, 'role') and user.role == 'admin':
#             if hasattr(user, 'company') and user.company:
#                 return User.objects.filter(
#                     company=user.company,
#                     is_active=True
#                 ).select_related('company')
        
#         # Regular users see only themselves
#         else:
#             return User.objects.filter(id=user.id).select_related('company')
        
#         return User.objects.none()
    
#     def list(self, request, *args, **kwargs):
#         """Override list - regular users cannot see user list"""
#         user = request.user
        
#         if hasattr(user, 'role') and user.role not in ['super_admin', 'admin']:
#             return Response(
#                 {'error': 'You do not have permission to view user list'},
#                 status=status.HTTP_403_FORBIDDEN
#             )
        
#         return super().list(request, *args, **kwargs)
    
#     def create(self, request, *args, **kwargs):
#         """Create user - only super_admin and admin"""
#         user = request.user
        
#         if not (hasattr(user, 'role') and user.role in ['super_admin', 'admin']):
#             return Response(
#                 {'error': 'Only super_admin and admin can create users'},
#                 status=status.HTTP_403_FORBIDDEN
#             )
        
#         # Company admin can only create users in their company
#         if hasattr(user, 'role') and user.role == 'admin':
#             if hasattr(user, 'company') and user.company:
#                 request.data['company_id'] = user.company.id
        
#         return super().create(request, *args, **kwargs)
    
#     def destroy(self, request, *args, **kwargs):
#         """Delete user with enhanced permissions"""
#         user = self.get_object()
        
#         # Check if current user can delete this user
#         if not CanDeleteUser().has_object_permission(request, self, user):
#             return Response(
#                 {'error': 'You do not have permission to delete this user'},
#                 status=status.HTTP_403_FORBIDDEN
#             )
        
#         # Soft delete
#         user.is_active = False
#         user.save()
        
#         return Response(
#             {'message': 'User deactivated successfully'},
#             status=status.HTTP_200_OK
#         )


# # ============================================
# # COMPANY VIEWSET
# # ============================================

# class CompanyViewSet(viewsets.ModelViewSet):
#     queryset = Company.objects.all()
#     serializer_class = CompanySerializer
    
#     def get_permissions(self):
#         if self.action == 'create':
#             # Only super admin can create companies
#             permission_classes = [IsSuperAdmin]
#         elif self.action == 'destroy':
#             # Custom permission for deletion
#             permission_classes = [CanDeleteCompany]
#         elif self.action in ['update', 'partial_update']:
#             # Super admin and company admin can update their company
#             permission_classes = [IsAdminOrSuperAdmin]
#         else:
#             # List/retrieve: authenticated users can view
#             permission_classes = [IsAuthenticated]
        
#         return [permission() for permission in permission_classes]
    
#     def get_queryset(self):
#         """Return companies based on user role"""
#         user = self.request.user
        
#         if not user.is_authenticated:
#             return Company.objects.none()
        
#         # Super admin sees all companies
#         if hasattr(user, 'role') and user.role == 'super_admin':
#             return Company.objects.all()
        
#         # Company admin sees only their company
#         elif hasattr(user, 'role') and user.role == 'admin':
#             if hasattr(user, 'company') and user.company:
#                 return Company.objects.filter(id=user.company.id)
        
#         # Regular users see only their company (for viewing details)
#         else:
#             if hasattr(user, 'company') and user.company:
#                 return Company.objects.filter(id=user.company.id)
        
#         return Company.objects.none()
    
#     def list(self, request, *args, **kwargs):
#         """Override list - regular users cannot see company list"""
#         user = request.user
        
#         if hasattr(user, 'role') and user.role not in ['super_admin', 'admin']:
#             return Response(
#                 {'error': 'You do not have permission to view company list'},
#                 status=status.HTTP_403_FORBIDDEN
#             )
        
#         return super().list(request, *args, **kwargs)


# # ============================================
# # CUSTOMER VIEWSET
# # ============================================

# class CustomerViewSet(viewsets.ModelViewSet):
#     queryset = Customer.objects.all()
#     serializer_class = CustomerSerializer
#     permission_classes = [IsAuthenticated]
    
#     def get_queryset(self):
#         user = self.request.user
#         # Get customers from user's company
#         if hasattr(user, 'company') and user.company:
#             return Customer.objects.filter(company=user.company)
#         return Customer.objects.none()
    
#     def perform_create(self, serializer):
#         user = self.request.user
#         # Save with user's company
#         if hasattr(user, 'company') and user.company:
#             serializer.save(company=user.company)


# # ============================================
# # INTERACTION VIEWSET
# # ============================================

# class InteractionViewSet(viewsets.ModelViewSet):
#     queryset = Interaction.objects.all()
#     serializer_class = InteractionSerializer
#     permission_classes = [IsAuthenticated]
    
#     def get_queryset(self):
#         user = self.request.user
#         queryset = Interaction.objects.none()
        
#         # Get interactions from user's company
#         if hasattr(user, 'company') and user.company:
#             queryset = Interaction.objects.filter(company=user.company)
        
#         customer_id = self.request.query_params.get('customer', None)
#         if customer_id:
#             queryset = queryset.filter(customer_id=customer_id)
        
#         return queryset
    
#     def perform_create(self, serializer):
#         user = self.request.user
#         # Save with user's company
#         if hasattr(user, 'company') and user.company:
#             serializer.save(company=user.company)


"""
Views - Multi-Company Support
==============================
Updated ViewSets with default_company filtering and role-based permissions
"""

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from .models import Company, Customer, Interaction, UserCompany
from .serializers import (
    CompanySerializer, 
    CustomerSerializer, 
    InteractionSerializer,
    UserListSerializer,
    UserCreateUpdateSerializer
)

User = get_user_model()


# ============================================
# CUSTOM PERMISSION CLASSES
# ============================================

class IsSuperAdmin(permissions.BasePermission):
    """Only Super Admin can perform certain actions"""
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        # Check if user is super_admin in their current company
        if request.user.default_company:
            try:
                uc = UserCompany.objects.get(
                    user=request.user,
                    company=request.user.default_company
                )
                return uc.role == 'super_admin'
            except UserCompany.DoesNotExist:
                return False
        return False


class IsAdminOrSuperAdmin(permissions.BasePermission):
    """Allow Company Admin or Super Admin"""
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        # Check role in current company
        if request.user.default_company:
            try:
                uc = UserCompany.objects.get(
                    user=request.user,
                    company=request.user.default_company
                )
                return uc.role in ['super_admin', 'admin']
            except UserCompany.DoesNotExist:
                return False
        return False


class CanManageUsers(permissions.BasePermission):
    """Check if user can manage other users"""
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        # Check role in current company
        if request.user.default_company:
            try:
                uc = UserCompany.objects.get(
                    user=request.user,
                    company=request.user.default_company
                )
                return uc.role in ['super_admin', 'admin', 'manager']
            except UserCompany.DoesNotExist:
                return False
        return False


# ============================================
# USER VIEWSET
# ============================================

# class UserViewSet(viewsets.ModelViewSet):
#     """User CRUD operations with multi-company support"""
#     permission_classes = [IsAuthenticated]
#     queryset = User.objects.all()
    
#     def get_serializer_class(self):
#         if self.action in ['list', 'retrieve']:
#             return UserListSerializer
#         return UserCreateUpdateSerializer
    
#     def get_queryset(self):
#         """Return users based on current company and role"""
#         user = self.request.user
        
#         if not user.is_authenticated or not user.default_company:
#             return User.objects.none()
        
#         # Get user's role in current company
#         try:
#             user_company = UserCompany.objects.get(
#                 user=user,
#                 company=user.default_company
#             )
#         except UserCompany.DoesNotExist:
#             return User.objects.none()
        
#         # Super admin sees all users in current company
#         if user_company.role == 'super_admin':
#             user_ids = UserCompany.objects.filter(
#                 company=user.default_company,
#                 is_active=True
#             ).values_list('user_id', flat=True)
#             return User.objects.filter(id__in=user_ids).select_related('default_company')
        
#         # Admin/Manager sees users in their company
#         elif user_company.role in ['admin', 'manager']:
#             user_ids = UserCompany.objects.filter(
#                 company=user.default_company,
#                 is_active=True
#             ).values_list('user_id', flat=True)
#             return User.objects.filter(id__in=user_ids).select_related('default_company')
        
#         # Regular users see only themselves
#         return User.objects.filter(id=user.id).select_related('default_company')
    
#     def list(self, request, *args, **kwargs):
#         """Override list - check permissions"""
#         if not CanManageUsers().has_permission(request, self):
#             return Response(
#                 {'error': 'You do not have permission to view user list'},
#                 status=status.HTTP_403_FORBIDDEN
#             )
#         return super().list(request, *args, **kwargs)
    
#     def create(self, request, *args, **kwargs):
#         """Create user in current company"""
#         if not IsAdminOrSuperAdmin().has_permission(request, self):
#             return Response(
#                 {'error': 'Only admins can create users'},
#                 status=status.HTTP_403_FORBIDDEN
#             )
        
#         # Force company to be current company
#         request.data['company_id'] = request.user.default_company.id
        
#         return super().create(request, *args, **kwargs)
class UserViewSet(viewsets.ModelViewSet):
    """User CRUD operations with multi-company support"""
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    
    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return UserListSerializer
        return UserCreateUpdateSerializer
    
    def get_queryset(self):
        """Return users based on current company and role"""
        user = self.request.user
        
        if not user.is_authenticated or not user.default_company:
            return User.objects.none()
        
        # Get user's role in current company
        try:
            user_company = UserCompany.objects.get(
                user=user,
                company=user.default_company
            )
        except UserCompany.DoesNotExist:
            return User.objects.none()
        
        # Super admin sees all users in current company
        if user_company.role == 'super_admin':
            user_ids = UserCompany.objects.filter(
                company=user.default_company,
                is_active=True
            ).values_list('user_id', flat=True)
            return User.objects.filter(id__in=user_ids).select_related('default_company')
        
        # Admin/Manager sees users in their company
        elif user_company.role in ['admin', 'manager']:
            user_ids = UserCompany.objects.filter(
                company=user.default_company,
                is_active=True
            ).values_list('user_id', flat=True)
            return User.objects.filter(id__in=user_ids).select_related('default_company')
        
        # Regular users see only themselves
        return User.objects.filter(id=user.id).select_related('default_company')
    
    def list(self, request, *args, **kwargs):
        """Override list - check permissions"""
        if not CanManageUsers().has_permission(request, self):
            return Response(
                {'error': 'You do not have permission to view user list'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().list(request, *args, **kwargs)
    
    def create(self, request, *args, **kwargs):
        """Create user - super_admin can add to multiple companies"""
        if not IsAdminOrSuperAdmin().has_permission(request, self):
            return Response(
                {'error': 'Only admins can create users'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # If not super_admin, force single company (current company)
        user_role = None
        if request.user.default_company:
            try:
                uc = UserCompany.objects.get(
                    user=request.user,
                    company=request.user.default_company
                )
                user_role = uc.role
            except UserCompany.DoesNotExist:
                pass
        
        if user_role != 'super_admin':
            # Non-super admins can only add to their current company
            if 'company_ids' in request.data:
                request.data['company_ids'] = [request.user.default_company.id]
            else:
                request.data['company_id'] = request.user.default_company.id
        
        return super().create(request, *args, **kwargs)

# ============================================
# COMPANY VIEWSET
# ============================================

class CompanyViewSet(viewsets.ModelViewSet):
    """Company CRUD operations"""
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Return companies based on user's access"""
        user = self.request.user
        
        if not user.is_authenticated:
            return Company.objects.none()
        
        # Get companies user belongs to
        company_ids = UserCompany.objects.filter(
            user=user,
            is_active=True
        ).values_list('company_id', flat=True)
        
        return Company.objects.filter(id__in=company_ids)
    
    def list(self, request, *args, **kwargs):
        """List companies user belongs to"""
        return super().list(request, *args, **kwargs)


# ============================================
# CUSTOMER VIEWSET
# ============================================

class CustomerViewSet(viewsets.ModelViewSet):
    """Customer CRUD operations - filtered by current company"""
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Return customers from current company only"""
        user = self.request.user
        
        if not user.default_company:
            return Customer.objects.none()
        
        return Customer.objects.filter(
            company=user.default_company
        ).select_related('company')
    
    def perform_create(self, serializer):
        """Save customer to current company"""
        user = self.request.user
        
        if not user.default_company:
            raise ValueError('User must have a default company')
        
        serializer.save(company=user.default_company)


# ============================================
# INTERACTION VIEWSET
# ============================================

class InteractionViewSet(viewsets.ModelViewSet):
    """Interaction CRUD operations - filtered by current company"""
    queryset = Interaction.objects.all()
    serializer_class = InteractionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Return interactions from current company only"""
        user = self.request.user
        
        if not user.default_company:
            return Interaction.objects.none()
        
        queryset = Interaction.objects.filter(
            company=user.default_company
        ).select_related('company', 'customer')
        
        # Filter by customer if specified
        customer_id = self.request.query_params.get('customer', None)
        if customer_id:
            queryset = queryset.filter(customer_id=customer_id)
        
        return queryset
    
    def perform_create(self, serializer):
        """Save interaction to current company"""
        user = self.request.user
        
        if not user.default_company:
            raise ValueError('User must have a default company')
        
        serializer.save(company=user.default_company)