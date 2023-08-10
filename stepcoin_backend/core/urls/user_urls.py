from django.urls import path

from core.views import user_views


urlpatterns = [
    path('', user_views.getUsers, name='users'),
    path('<str:pk>', user_views.getUser, name='user'),
    path('check-user-exists/<str:email>', user_views.checkUserExists, name='check-user-exists'),


    path('register/', user_views.registerUser, name='register'),
    path('login/', user_views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('get-profile/', user_views.getProfile, name='get-profile'),

    path('update/', user_views.updateUser, name='user-update'),

    path('delete/<str:pk>', user_views.deleteUser, name='user-delete')   

]