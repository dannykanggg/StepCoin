from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.contrib.auth import (
    get_user_model, 
)
from core.models import *

#from django.contrib.auth.models import User



## post save -- on user creation, create wallet
#@receiver(post_save, sender=User)
#def create_wallet(sender, instance,created, **kwargs):
#    if created:
#        Wallet.objects.create(user=instance)
#

## minus transaction from wallet
@receiver(pre_save, sender=Transaction)
def validate_spending(sender, instance, **kwargs):
    ## validate there's enough in wallet for spending
    ## get wallet
    wallet = instance.wallet
    ## throw error is not enough balance
    if (instance.amount <0):
        ## prevent transaction if not enough in balance
        if (wallet.balance < abs(instance.amount)):
            raise Exception('not enough balance in wallet')
        else: 
            ## perform transaction on wallet
            wallet.balance = wallet.balance - abs(instance.amount)
            wallet.save()
    ## add transaction to wallet
    else:
        wallet.balance = wallet.balance + abs(instance.amount)
        wallet.save()

    