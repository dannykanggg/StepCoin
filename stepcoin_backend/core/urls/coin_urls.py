from django.urls import path

from core.views import coin_views



urlpatterns = [
    path('initiate-wallet/', coin_views.initiateWallet, name='initiate-wallet'),
    path('get-wallet/', coin_views.getWallet, name='get-wallet'),
    path('get-guest-wallet/', coin_views.getGuestWallet, name='get-guest-wallet'),
    path('post-transaction/', coin_views.postTransaction, name='post-transaction'),
    path('post-guest-transaction/', coin_views.postGuestTransaction, name='post-guest-transaction'),
    path('get-user-transactions/', coin_views.getUserTransactions, name='get-user-transactions'),
    path('get-guest-transactions/', coin_views.getGuestTransactions, name='get-guest-transactions'),
    path('get-recent-transactions/', coin_views.getRecentTransactions, name='get-recent-transactions'),
]
    