"""
ML Dashboard for CRM - Analytics and Insights (Multi-Company Support)
"""

from django.db.models import Count
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from .models import Customer, Interaction, User, UserCompany


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """Basic dashboard statistics - filtered by default_company"""
    user = request.user
    company = user.default_company  # CHANGED: Use default_company
    
    if not company:
        return Response({
            'status': 'error',
            'message': 'No default company set for user'
        }, status=400)
    
    total_customers = Customer.objects.filter(company=company).count()
    total_interactions = Interaction.objects.filter(company=company).count()
    
    # Count active users in this company
    user_ids = UserCompany.objects.filter(
        company=company,
        is_active=True
    ).values_list('user_id', flat=True)
    active_users = User.objects.filter(id__in=user_ids, is_active=True).count()
    
    last_week = timezone.now() - timedelta(days=7)
    recent_interactions = Interaction.objects.filter(
        company=company, 
        interaction_date__gte=last_week
    ).count()
    
    last_month = timezone.now() - timedelta(days=30)
    recent_customers = Customer.objects.filter(
        company=company,
        created_at__gte=last_month
    ).count()
    
    interaction_types = Interaction.objects.filter(
        company=company
    ).values('interaction_type').annotate(count=Count('interaction_type')).order_by('-count')
    
    return Response({
        'status': 'success',
        'data': {
            'total_customers': total_customers,
            'total_interactions': total_interactions,
            'active_users': active_users,
            'recent_interactions': recent_interactions,
            'recent_customers': recent_customers,
            'interaction_types': list(interaction_types),
            'company_name': company.name,
            'company_id': company.id,
        }
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recent_activities(request):
    """Get recent activities feed - filtered by default_company"""
    company = request.user.default_company  # CHANGED: Use default_company
    
    if not company:
        return Response({
            'status': 'error',
            'message': 'No default company set for user'
        }, status=400)
    
    recent = Interaction.objects.filter(
        company=company
    ).select_related('customer').order_by('-interaction_date')[:15]
    
    activities = []
    for interaction in recent:
        customer_name = "Unknown"
        if interaction.customer:
            customer_name = f"{interaction.customer.first_name} {interaction.customer.last_name}"
        
        activities.append({
            'id': interaction.id,
            'type': interaction.interaction_type,
            'type_display': interaction.get_interaction_type_display(),
            'subject': interaction.subject,
            'customer_name': customer_name,
            'customer_id': interaction.customer.id if interaction.customer else None,
            'notes': interaction.notes[:120] + '...' if len(interaction.notes) > 120 else interaction.notes,
            'date': interaction.interaction_date,
        })
    
    return Response({
        'status': 'success',
        'count': len(activities),
        'activities': activities
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ml_insights(request):
    """ML-powered insights and analytics - filtered by default_company"""
    company = request.user.default_company  # CHANGED: Use default_company
    
    if not company:
        return Response({
            'status': 'error',
            'message': 'No default company set for user'
        }, status=400)
    
    customers = Customer.objects.filter(company=company)
    interactions = Interaction.objects.filter(company=company)
    
    total_customers = customers.count()
    total_interactions = interactions.count()
    avg_interactions = total_interactions / max(total_customers, 1)
    
    return Response({
        'status': 'success',
        'company': company.name,
        'insights': {
            'total_customers': total_customers,
            'total_interactions': total_interactions,
            'avg_interactions_per_customer': round(avg_interactions, 2),
            'message': 'Basic analytics available'
        }
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def customer_analytics(request, customer_id=None):
    """Analytics for specific customer or all customers - filtered by default_company"""
    company = request.user.default_company  # CHANGED: Use default_company
    
    if not company:
        return Response({
            'status': 'error',
            'message': 'No default company set for user'
        }, status=400)
    
    if customer_id:
        try:
            customer = Customer.objects.get(id=customer_id, company=company)
            customer_interactions = Interaction.objects.filter(
                customer=customer, 
                company=company
            )
            
            return Response({
                'status': 'success',
                'analytics': {
                    'customer_id': customer_id,
                    'name': f"{customer.first_name} {customer.last_name}",
                    'email': customer.email,
                    'phone': customer.phone,
                    'interaction_count': customer_interactions.count(),
                    'last_interaction': customer_interactions.order_by('-interaction_date').first().interaction_date if customer_interactions.exists() else None,
                }
            })
        except Customer.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'Customer not found'
            }, status=404)
    
    # All customers analytics
    customers = Customer.objects.filter(company=company)
    interactions = Interaction.objects.filter(company=company)
    
    return Response({
        'status': 'success',
        'total_customers': customers.count(),
        'total_interactions': interactions.count(),
        'average_interactions_per_customer': interactions.count() / max(customers.count(), 1),
    })