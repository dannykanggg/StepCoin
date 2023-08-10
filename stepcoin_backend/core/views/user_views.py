from django.shortcuts import render

from django.contrib.auth.hashers import make_password

from rest_framework.status import HTTP_200_OK,HTTP_400_BAD_REQUEST
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from core import serializers
from core import models



class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        ## add username & email to token to make login easier
        user_data = super().validate(attrs)
        serializer = serializers.UserSerializerWithToken(self.user).data
        for key, value in serializer.items():
            user_data[key] = value

        ## load user profile
        user_profile = models.UserProfile.objects.get(user=user_data['id'])
        user_profile_serializer = serializers.UserProfileSerializer(user_profile, many=False).data

        ## get wallet
        wallet = models.Wallet.objects.get(user=user_data['id'])
        wallet_serializer = serializers.WalletSerializer(wallet, many=False).data


        return {
            'user': user_data,
            'user_profile': user_profile_serializer,
            'wallet': wallet_serializer
        }

## login view
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['POST'])
def registerUser(request):
    ## create user
    data = request.data

    ## submit user object
    user = models.User.objects.create(
        email = data['email'],
        password = make_password(data['password']),
    )

    ## serializer user object
    user_serializer = serializers.UserSerializerWithToken(user, many=False)

    ## gather user_profile data
    user_profile_data = {}
    for col in ['birthday','gender']:
        if col in data.keys():
            user_profile_data[col] = data[col]

    ## submit user profile object
    user_profile = models.UserProfile.objects.create(
        user=user,
        **user_profile_data
    )
    user_profile_serializer = serializers.UserProfileSerializer(user_profile, many=False)

    ## create wallet here -- connect w/ uuid
    wallet = models.Wallet.objects.get(uuid=data['uuid'])
    wallet.user = user
    wallet.uuid = ''
    wallet.save()

    ## get wallet info
    wallet_serializer = serializers.WalletSerializer(wallet, many=False)

    return Response({
        'user': user_serializer.data,
        'user_profile': user_profile_serializer.data,
        'wallet':wallet_serializer.data
    })

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def updateUser(request):
    """udpate own user profile"""
    data = request.data
    user = request.user
    user_profile = models.UserProfile.objects.get(user = user.id)

    ## make patches then save
    if 'email' in data.keys():
        user.email = data['email']
    if ('password' in data.keys()) and (data['password'] != ''):
        user.password = make_password(data['password'])

    user.save()
    user_serializer = serializers.UserSerializerWithToken(user, many=False)

    for key, value in data.items():
        if key in ['birthday','gender']:
            setattr(user_profile, key, value)

    user_profile.save()
    user_profile_serializer = serializers.UserProfileSerializer(user_profile, many=False)

    wallet = models.Wallet.objects.get(user=user)
    wallet_serializer = serializers.WalletSerializer(wallet, many=False)

    return Response({
        'user': user_serializer.data,
        'user_profile': user_profile_serializer.data,
        'wallet': wallet_serializer.data
    })



@api_view(['GET'])
def checkUserExists(request, email):
    """check if email exists in DB"""

    user = models.User.objects.filter(email=email)
    if user.exists():
        ## return true
        return Response({'user-exists': 'true'}, status=HTTP_200_OK)
    else:
        return Response({'user-exists': 'false'}, status=HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getProfile(request):
    """get user related information (profile, wallet, etc.)"""
    user = request.user

    #user_serializer = serializers.UserSerializer(user, many=False)
    user_profile = models.UserProfile.objects.get(user=user)
    user_profile_serializer = serializers.UserProfileSerializer(user_profile, many=False)
    wallet = models.Wallet(user=user)
    wallet_serializer = serializers.WalletSerializer(wallet, many=False)

    return Response({
        'user_profile':user_profile_serializer.data,
        'wallet': wallet_serializer.data
    })


@api_view(['GET'])
def getUsers(request):
    """ Get list of users """
    users = models.User.objects.all()
    user_serializer = serializers.UserSerializer(users, many=True)

    user_profiles = models.UserProfile.objects.all()
    user_profile_serializer = serializers.UserProfileSerializer(user_profiles, many=True)
    return Response({
        'user': user_serializer.data,
        'user_profile': user_profile_serializer.data
    })

@api_view(['GET'])
def getUser(request, pk):
    """Get one user"""
    try: 
        user = models.User.objects.get(id=pk)
        user_serializer = serializers.UserSerializer(user, many=False)
        ## get user profile as try/except
        try:
            user_profile = models.UserProfile.objects.get(user=user.id)
            user_profile_serializer = serializers.UserProfileSerializer(user_profile, many=False)
            return Response({
                'user': user_serializer.data,
                'user_profile': user_profile_serializer.data
            })
        except: 
            return Response({
                'user': user_serializer.data,
                'user_profile': {}
            })
    except: 
        return Response('user does not exist')
    
@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteUser(request, pk):
    userForDeletion = models.User.objects.get(id=pk)
    userForDeletion.delete()
    return Response('User was deleted')
