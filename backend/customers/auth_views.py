

"""
Authentication Views - Multi-Company Support
============================================
Updated login, register, and company switching endpoints
"""

from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .models import Company, UserCompany

User = get_user_model()


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """
    User login with multi-company support
    Returns: user info + list of companies + default company
    """
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response(
            {'error': 'Username and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Authenticate user
    user = authenticate(username=username, password=password)
    
    if user is None:
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    # Get user's companies with roles
    user_companies = UserCompany.objects.filter(
        user=user, 
        is_active=True
    ).select_related('company')
    
    companies_list = [
        {
            'id': uc.company.id,
            'name': uc.company.name,
            'role': uc.role,
            'subdomain': uc.company.subdomain,
        }
        for uc in user_companies
    ]
    
    # Get default company info
    default_company = None
    default_role = None
    
    if user.default_company:
        default_company = {
            'id': user.default_company.id,
            'name': user.default_company.name,
        }
        # Get role in default company
        try:
            uc = UserCompany.objects.get(user=user, company=user.default_company)
            default_role = uc.role
        except UserCompany.DoesNotExist:
            default_role = 'user'
    
    # Generate JWT tokens
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'message': 'Login successful',
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'phone': user.phone,
            'default_company': default_company,
            'role': default_role,  # Role in default company
            'companies': companies_list,  # All companies with roles
        },
        'tokens': {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """
    User registration
    Requires: username, password, email, company_id
    """
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    company_id = request.data.get('company_id')
    role = request.data.get('role', 'user')
    phone = request.data.get('phone', '')
    
    # Validation
    if not username or not password or not company_id:
        return Response(
            {'error': 'Username, password, and company_id are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if User.objects.filter(username=username).exists():
        return Response(
            {'error': 'Username already exists'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        company = Company.objects.get(id=company_id)
    except Company.DoesNotExist:
        return Response(
            {'error': 'Company not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Create user
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )
    
    user.phone = phone
    user.default_company = company
    user.save()
    
    # Create UserCompany relationship
    UserCompany.objects.create(
        user=user,
        company=company,
        role=role,
        is_active=True
    )
    
    # Generate tokens
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'message': 'User registered successfully',
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'phone': user.phone,
            'default_company': {
                'id': company.id,
                'name': company.name,
            },
            'role': role,
        },
        'tokens': {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
    }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    """
    Get current user info with multi-company data
    """
    user = request.user
    
    # Get user's companies
    user_companies = UserCompany.objects.filter(
        user=user, 
        is_active=True
    ).select_related('company')
    
    companies_list = [
        {
            'id': uc.company.id,
            'name': uc.company.name,
            'role': uc.role,
            'subdomain': uc.company.subdomain,
        }
        for uc in user_companies
    ]
    
    # Get role in default company
    default_role = None
    default_company = None
    
    if user.default_company:
        default_company = {
            'id': user.default_company.id,
            'name': user.default_company.name,
        }
        try:
            uc = UserCompany.objects.get(user=user, company=user.default_company)
            default_role = uc.role
        except UserCompany.DoesNotExist:
            default_role = 'user'
    
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'phone': user.phone,
        'default_company': default_company,
        'role': default_role,
        'companies': companies_list,
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def switch_company(request):
    """
    Switch user's current/default company
    POST body: { "company_id": 123 }
    """
    company_id = request.data.get('company_id')
    user = request.user
    
    if not company_id:
        return Response(
            {'error': 'company_id is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Check if user belongs to this company
    try:
        user_company = UserCompany.objects.get(
            user=user,
            company_id=company_id,
            is_active=True
        )
    except UserCompany.DoesNotExist:
        return Response(
            {'error': 'You do not have access to this company'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Update default company
    user.default_company = user_company.company
    user.save()
    
    return Response({
        'message': 'Company switched successfully',
        'company': {
            'id': user_company.company.id,
            'name': user_company.company.name,
        },
        'role': user_company.role,
    })