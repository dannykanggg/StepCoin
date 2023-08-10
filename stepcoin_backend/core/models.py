from django.db import models
from annoying.fields import AutoOneToOneField

from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)



class UserManager(BaseUserManager):
    """Manager for users"""
    def create_user(self, email, password=None, **extra_fields):
        """Create, save, and return a new user"""
        if not email:
            raise ValueError("User must have an email address")
        user = self.model(email=self.normalize_email(email), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    def create_superuser(self, email, password):
        """Create and return a new superuser"""
        user = self.create_user(email, password)
        user.is_staff=True
        user.is_superuser=True
        user.save(using=self._db)
        return user
    
class User(AbstractBaseUser, PermissionsMixin):
    """User in the system"""
    email = models.EmailField(max_length=255, unique=True)
    ## boolean fields
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    def __str__(self):
        return str(self.email)
    #def save(self, *args, **kwargs):
    #    created = self.email is None
    #    super().save(*args, **kwargs)
    #    if created:
    #        print("l;kjsaljsdlf;j")
    #        Wallet.objects.create(user = self)

class UserProfile(models.Model):
    user = AutoOneToOneField(User, primary_key=True, on_delete=models.CASCADE)

    birthday = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return str(self.user.email)
    
    
class Wallet(models.Model):
    """ one for each user """
    user = models.OneToOneField(User, on_delete=models.CASCADE, blank=True, null=True)
    uuid = models.CharField(max_length=255, blank=True, null=True)
    balance = models.PositiveIntegerField(default=0, null=False, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.user)


TRANSACTION_TYPE_CHOICES = [
    ('watch_ad','watch_ad'), 
    ('use_points','use_points'), 
    ('no_ad','no_ad')
]
class Transaction(models.Model):
    """every transaction"""
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE)
    type = models.CharField(max_length=255, choices=TRANSACTION_TYPE_CHOICES, null=False, blank=False)
    amount = models.IntegerField(null=False, blank=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    ## signal: on_save > add amount to user wallet amount


## temporary wallet?
