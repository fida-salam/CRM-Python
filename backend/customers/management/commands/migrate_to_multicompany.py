"""
Data Migration Script: Convert Single-Company to Multi-Company
================================================================

This script migrates existing data from the old single-company model
to the new multi-company model with UserCompany through table.

Run this AFTER creating migrations but BEFORE deploying to production.
"""

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from customers.models import Company, UserCompany

User = get_user_model()


class Command(BaseCommand):
    help = 'Migrate existing users from single-company to multi-company model'

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING('Starting data migration...'))
        
        migrated_count = 0
        skipped_count = 0
        error_count = 0
        
        # Get all users
        users = User.objects.all()
        total_users = users.count()
        
        self.stdout.write(f'Found {total_users} users to migrate')
        
        for user in users:
            try:
                # Check if user has old 'role' field (for backward compatibility)
                old_role = getattr(user, 'role', 'user')
                
                # Check if user has old single 'company' field
                old_company = getattr(user, 'company', None)
                
                if old_company:
                    # Check if UserCompany relationship already exists
                    user_company, created = UserCompany.objects.get_or_create(
                        user=user,
                        company=old_company,
                        defaults={
                            'role': old_role,
                            'is_active': True
                        }
                    )
                    
                    if created:
                        self.stdout.write(
                            self.style.SUCCESS(
                                f'✓ Created UserCompany: {user.username} → {old_company.name} ({old_role})'
                            )
                        )
                        migrated_count += 1
                    else:
                        self.stdout.write(
                            self.style.WARNING(
                                f'○ Already exists: {user.username} → {old_company.name}'
                            )
                        )
                        skipped_count += 1
                    
                    # Set default_company if not already set
                    if not user.default_company:
                        user.default_company = old_company
                        user.save(update_fields=['default_company'])
                        self.stdout.write(
                            self.style.SUCCESS(
                                f'✓ Set default company for {user.username}: {old_company.name}'
                            )
                        )
                
                else:
                    self.stdout.write(
                        self.style.WARNING(
                            f'○ No company for user: {user.username}'
                        )
                    )
                    skipped_count += 1
            
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(
                        f'✗ Error migrating {user.username}: {str(e)}'
                    )
                )
                error_count += 1
        
        # Summary
        self.stdout.write('\n' + '='*60)
        self.stdout.write(self.style.SUCCESS('MIGRATION COMPLETE'))
        self.stdout.write('='*60)
        self.stdout.write(f'Total users processed: {total_users}')
        self.stdout.write(self.style.SUCCESS(f'Successfully migrated: {migrated_count}'))
        self.stdout.write(self.style.WARNING(f'Skipped (already exists): {skipped_count}'))
        self.stdout.write(self.style.ERROR(f'Errors: {error_count}'))
        self.stdout.write('='*60 + '\n')
        
        if error_count > 0:
            self.stdout.write(
                self.style.ERROR('⚠️  Some users failed to migrate. Please check errors above.')
            )
        else:
            self.stdout.write(
                self.style.SUCCESS('✓ All users migrated successfully!')
            )