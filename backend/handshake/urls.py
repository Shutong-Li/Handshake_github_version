# Copyright (C) 2025 HandShake
# Licensed under the Apache License, Version 2.0.
# See LICENSE file for details.

from django.urls import path
from django.shortcuts import redirect
from .views import AllVIPsView, CreateVIPView, RegisterView, LoginView, PostEventList, UserVIPsView, delete_post_event, OrganisationList, LogoutView, UserProfileView, search_results, EditView, DeleteAccountView, AuthenticateProfile, GetUserName, ChangePassword, UserPostsView, UserEventsView, CheckVerificationView, VerifyEmailView
from rest_framework_simplejwt.views import TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('api/verify-email/<str:token>/', VerifyEmailView.as_view(), name='verify-email'),
    path('api/check-verification/<str:username>/', CheckVerificationView.as_view(), name='check-verification'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('', lambda request: redirect('login/')),
    path('login/', LoginView.as_view(), name='login'),
    path('user_vips/', UserVIPsView.as_view(), name='user_vips'),
    path('all_vips/', AllVIPsView.as_view(), name='all_vips'),
    path('create_vip/', CreateVIPView.as_view(), name='create_vip'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('noticeboard/', PostEventList.as_view(), name='post-event-list'),
    path('user_posts/', UserPostsView.as_view(), name='user_posts'),
    path('user_events/', UserEventsView.as_view(), name='user_events'),
    path('noticeboard/<int:id>/', delete_post_event, name='delete_post_event'),
    path('organisations/', OrganisationList.as_view(), name='organisation-list'),
    path('search/results/', search_results, name='search_results'),
    path('token/refresh/', TokenRefreshView.as_view(), name="token_refresh"),
    path('saveEdits/', EditView.as_view(), name="edit_view"),
    path('deleteAccount/', DeleteAccountView.as_view(), name='delete_account'),
    path('authenticate-profile/', AuthenticateProfile.as_view(), name='authenticate-profile'),
    path('get-username/', GetUserName.as_view(), name='get-username'),
    path('change-password/', ChangePassword.as_view(), name='change-password'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)