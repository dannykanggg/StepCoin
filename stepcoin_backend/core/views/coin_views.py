from django.shortcuts import render

from rest_framework.status import HTTP_400_BAD_REQUEST
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination



from core.models import Wallet, Transaction

from core.serializers import WalletSerializer, TransactionSerializer


@api_view(['POST'])
def initiateWallet(request):
    """initiate wallet for new device"""
    data = request.data
    wallet = Wallet.objects.create(uuid=data['uuid'])
    wallet_serializer = WalletSerializer(wallet, many=False)
    return Response(wallet_serializer.data)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getWallet(request):
    """get user's coin amount"""
    user = request.user

    wallet = Wallet.objects.get(user=user)
    wallet_serializer = WalletSerializer(wallet, many=False)
    return Response(wallet_serializer.data)

@api_view(['POST'])
def getGuestWallet(request):
    """get user's coin amount"""
    data = request.data
    print('this is uuid')
    print(data)
    wallet = Wallet.objects.get(uuid=data['uuid'])
    wallet_serializer = WalletSerializer(wallet, many=False)
    return Response(wallet_serializer.data)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def postTransaction(request):
    """create transaction"""
    user = request.user
    data = request.data
    wallet = Wallet.objects.get(user=user)
    wallet_balance = wallet.balance
    transaction_amount = data['amount']
    if (transaction_amount<0 & wallet_balance < transaction_amount):
        ## check value of wallet before posting transactione
        return Response(status=HTTP_400_BAD_REQUEST, data={'message': 'not enough coins for purchase'})
    
    transaction = Transaction.objects.create(
        wallet=wallet,
        **data
    )
    transaction_serializer = TransactionSerializer(transaction, many=False)

    return Response(transaction_serializer.data)

@api_view(['POST'])
def postGuestTransaction(request):
    """create transaction"""
    data = request.data
    uuid = data.pop('uuid')
    wallet = Wallet.objects.get(uuid=uuid)
    wallet_balance = wallet.balance
    transaction_amount = data['amount']
    if (transaction_amount<0 & wallet_balance < transaction_amount):
        ## check value of wallet before posting transactione
        return Response(status=HTTP_400_BAD_REQUEST, data={'message': 'not enough coins for purchase'})
    
    transaction = Transaction.objects.create(
        wallet=wallet,
        **data
    )
    transaction_serializer = TransactionSerializer(transaction, many=False)

    return Response(transaction_serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserTransactions(request):
    """Pagination view of user's transactions"""
    ## paginator object & settings
    paginator = PageNumberPagination()
    paginator.page_size = 10

    ## user and request data
    user = request.user
    wallet = Wallet.objects.get(user=user)

    transactions = Transaction.objects.filter(wallet=wallet).order_by('timestamp')
    ## paginate
    transaction_page = paginator.paginate_queryset(transactions, request)
    transaction_serializer = TransactionSerializer(transaction_page, many=True)

    return paginator.get_paginated_response(transaction_serializer.data)


@api_view(['POST'])
def getGuestTransactions(request):
    """Pagination view of guest's transactions"""
    ## paginator object & settings
    paginator = PageNumberPagination()
    paginator.page_size = 10

    ## user and request data
    data = request.data    
    wallet = Wallet.objects.get(uuid=data['uuid'])

    transactions = Transaction.objects.filter(wallet=wallet).order_by('timestamp')
    ## paginate
    transaction_page = paginator.paginate_queryset(transactions, request)
    transaction_serializer = TransactionSerializer(transaction_page, many=True)

    return paginator.get_paginated_response(transaction_serializer.data)






@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getRecentTransactions(request):
    """get last 10 transactions"""
    user = request.user
    ## get user wallet
    wallet = Wallet.objects.get(user=user)
    
    recent_transactions = Transaction.objects.filter(wallet=wallet).order_by("timestamp")[:10]

    transaction_serializer = TransactionSerializer(recent_transactions, many=True)
    return Response(transaction_serializer.data)