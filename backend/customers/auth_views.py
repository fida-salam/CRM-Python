from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from .models import Company, UserProfile
from .serializers import UserProfileSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """
    Register a new user with company
    
    Expected data:
    {
        "username": "john_doe",
        "email": "john@example.com",
        "password": "SecurePass123",
        "company_id": 1,
        "role": "user",  # optional, defaults to 'user'
        "phone": "123-456-7890"  # optional
    }
    """
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    company_id = request.data.get('company_id')
    role = request.data.get('role', 'user')
    phone = request.data.get('phone', '')
    
    # Validate required fields
    if not username or not password or not company_id:
        return Response(
            {'error': 'Username, password, and company_id are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Check if username already exists
    if User.objects.filter(username=username).exists():
        return Response(
            {'error': 'Username already exists'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Check if company exists
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
    
    # Create user profile
    user_profile = UserProfile.objects.create(
        user=user,
        company=company,
        role=role,
        phone=phone
    )
    
    # Generate JWT tokens
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'message': 'User registered successfully',
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'company_id': company.id,
            'company_name': company.name,
            'role': user_profile.role
        },
        'tokens': {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """
    Login user and return JWT tokens
    
    Expected data:
    {
        "username": "john_doe",
        "password": "SecurePass123"
    }
    """
    from django.contrib.auth import authenticate
    
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
    
    # Get user profile
    try:
        user_profile = UserProfile.objects.get(user=user)
    except UserProfile.DoesNotExist:
        return Response(
            {'error': 'User profile not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Generate JWT tokens
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'message': 'Login successful',
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'company_id': user_profile.company.id,
            'company_name': user_profile.company.name,
            'role': user_profile.role
        },
        'tokens': {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
    })


@api_view(['GET'])
def current_user(request):
    """
    Get current logged-in user info
    Requires authentication (JWT token in header)
    """
    try:
        user_profile = UserProfile.objects.get(user=request.user)
    except UserProfile.DoesNotExist:
        return Response(
            {'error': 'User profile not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    return Response({
        'id': request.user.id,
        'username': request.user.username,
        'email': request.user.email,
        'company_id': user_profile.company.id,
        'company_name': user_profile.company.name,
        'role': user_profile.role,
        'phone': user_profile.phone
    })