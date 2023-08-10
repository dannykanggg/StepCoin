from django.contrib import admin

from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django_reverse_admin import ReverseModelAdmin

from django.utils.translation import gettext_lazy as _

from .models import *



class UserProfileInline(admin.StackedInline):
    model = UserProfile
    extra = 1

class UserAdmin(BaseUserAdmin):
    """Define the admin page for users"""
    ordering = ['id']
    inlines = [UserProfileInline,]
    list_display = ['email','id','is_active','is_staff']
    fieldsets = (
        (
            None, {'fields': ('email','password')},
        ),
        (
            _('Permissions'),
            {
                'fields':(
                    'is_active',
                    'is_staff',
                    'is_superuser'
                )
            }
        ),
        (_('Important dates'),{'fields':('last_login',)}),
    )
    readonly_fields= ['last_login']

    add_fieldsets = (
        (None, {
            'classes':('wide',),
            'fields': (
                'email',
                'password1',
                'password2',

                'is_active',
                'is_staff',
                'is_superuser',
            )
        }),
    )

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)


class UserProfileAdmin(ReverseModelAdmin):
    model = UserProfile
    inline_reverse = ['user']
    inline_type = 'stacked'
    list_display = ['email','u_id', 'birthday','gender']
    def email(self, obj):
        return obj.user.email
    def u_id(self, obj):
        return obj.user.id
    

admin.site.register(User, UserAdmin)
admin.site.register(UserProfile, UserProfileAdmin)



class WalletAdmin(admin.ModelAdmin):
    model = Wallet
    list_display = ['user','balance','updated_at']

class TransactionAdmin(admin.ModelAdmin):
    model = Transaction
    list_display = ['wallet_user','wallet','type','amount','timestamp']

    def wallet_user(self, obj):
        return obj.wallet.user


admin.site.register(Wallet, WalletAdmin)
admin.site.register(Transaction, TransactionAdmin)
