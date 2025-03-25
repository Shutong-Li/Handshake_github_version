# Copyright (C) 2025 HandShake
# Licensed under the Apache License, Version 2.0.
# See LICENSE file for details.

from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status, generics, viewsets, permissions, parsers
from django.middleware.csrf import get_token
from .serializers import UserSerializer, UserProfileSerializer, PostEventSerializer, OrganisationSerializer, TokenCreator, VIPSerializer
from .models import VIP, UserProfile, PostEvent, Organisation, User
from django.http import JsonResponse
from django.contrib.auth.models import AnonymousUser
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.password_validation import validate_password
from django.db.models import Q
from django.utils import timezone
from datetime import timedelta
from django.core.mail import send_mail
from django.db import transaction
from rest_framework_simplejwt.tokens import RefreshToken
from django.forms.models import model_to_dict
from django.core.exceptions import ValidationError
import logging
import uuid
from django.core.paginator import Paginator

logger = logging.getLogger(__name__)



class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        try:
            validate_password(request.data.get('password'))
        except Exception as e:
            return Response({'Password':e}, status=status.HTTP_400_BAD_REQUEST)
        if serializer.is_valid():
            user = serializer.save()
            profile = user.userprofile
            profile.email_verification_token = uuid.uuid4().hex
            profile.email_verification_sent_at = timezone.now()
            profile.save()
            
            # Point to FRONTEND verification route
            verification_link = f"http://localhost:5173/verify-email/{profile.email_verification_token}/"

            try:
                send_mail(
                    'Verify Your Email',
                    f'Click the link to verify your email: {verification_link}',
                    settings.DEFAULT_FROM_EMAIL,  # Use the configured email
                    [user.email],
                    fail_silently=False,
                )
            except Exception as e:
                logger.error(f"Email failed: {str(e)}")
                return Response({'error': 'Email service unavailable'}, status=502)
            return Response({'message': 'Registration successful! Check your email to verify.'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, token):
        try:
            # Use select_for_update to lock the database row
            profile = UserProfile.objects.select_for_update().get(
                email_verification_token=token
            )
            
            if profile.is_verified:
                return Response(
                    {'message': 'Email already verified'}, 
                    status=status.HTTP_208_ALREADY_REPORTED
                )

            if profile.email_verification_sent_at < timezone.now() - timedelta(hours=24):
                return Response(
                    {'error': 'Token expired'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            with transaction.atomic():
                profile.is_verified = True
                profile.email_verification_token = None
                profile.email_verification_sent_at = None
                profile.save()

            return Response(
                {'message': 'Email verified successfully!'}, 
                status=status.HTTP_200_OK
            )

        except UserProfile.DoesNotExist:
            return Response(
                {'error': 'Invalid token'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

class CheckVerificationView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, username):
        try:
            user = User.objects.get(username=username.lower())
            return Response({
                'verified': user.userprofile.is_verified,
                'is_complete': user.userprofile.is_complete
            })
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)

class EditView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        print("getting in")
        try:
            user_profile = request.user.userprofile
            data = request.data
            
            user_profile.first_name = data.get('first_name', user_profile.first_name)
            user_profile.last_name = data.get('last_name', user_profile.last_name)
            user_profile.profile_picture = data.get('profile_picture', user_profile.profile_picture)
            user_profile.affiliation = data.get('affiliation', user_profile.affiliation)
            user_profile.user_type = data.get('user_type', user_profile.user_type)
            user_profile.biography = data.get('biography', user_profile.biography)
            user_profile.ecological_area = data.get('ecological_area', user_profile.ecological_area)
            user_profile.subject_area = data.get('subject_area', user_profile.subject_area)
            user_profile.variant = data.get('variant', user_profile.variant)
            user_profile.area_of_expertise = data.get('area_of_expertise', user_profile.area_of_expertise)
            user_profile.willing_peer_review = data.get('willing_peer_review', user_profile.willing_peer_review)
            user_profile.willing_allyship = data.get('willing_allyship', user_profile.willing_allyship)
            user_profile.willing_seminar = data.get('willing_seminar', user_profile.willing_seminar)
            user_profile.willing_PHDhelper = data.get('willing_PHDhelper', user_profile.willing_PHDhelper)

            user_profile.save()

            return Response({"message": "Profile updated successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return Response({"error": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"error": "User does not exist."}, status=status.HTTP_404_NOT_FOUND)

        if not user.is_active:
            return Response({"error": "This account has been deactivated."}, status=status.HTTP_403_FORBIDDEN)

        user = authenticate(username=username, password=password)
        if not user:
            return Response({"error": "Invalid username or password."}, status=status.HTTP_401_UNAUTHORIZED)

        token_creator = TokenCreator(data=request.data)
        if token_creator.is_valid():
            token = token_creator.validated_data
            return Response({
                "message": "Login successful!",
                "access_token": token["access_token"],
                "refresh_token": token["refresh_token"],
            }, status=status.HTTP_200_OK)

        return Response({"error": "Token generation failed."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ChangePassword(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = authenticate(username=request.user.username, password=request.data.get("password"))
        new_password = request.data.get("new_password")

        if user:
            user.set_password(new_password)
            user.save()
            return Response({"message": "Password changed successfully."}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid password."}, status=status.HTTP_401_UNAUTHORIZED)

class AuthenticateProfile(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            profile_id = int(request.GET.get('u', '').strip())
        except ValueError:
            return Response({"error": "Invalid user ID"}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        if user.id == profile_id:
            return Response(True)
        else:
            return Response(False)

class GetUserName(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        userID = request.data.get("userID") 
        if userID == None:
            user = request.user
            return Response({"id": user.id, "username": user.username})
        user = User.objects.get(id=userID)
        return Response({"id": user.id, "username": user.username})

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh_token")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({'message': 'Logged out'})
        except:
            return Response({'message': 'error'})

def search_results(request):
    query = request.GET.get('q', '').strip()
    try:
        filters = int(request.GET.get('filters', '').strip())
    except ValueError:
        return JsonResponse({'error': 'Invalid filters value'}, status=status.HTTP_400_BAD_REQUEST)
    
    order_by = request.GET.get('orderby', '').strip()
    university = request.GET.get('university', '').strip()
    try:
        page_number = int(request.GET.get('p', '').strip())
    except ValueError:
        return JsonResponse({'error': 'Page not found.'}, status=status.HTTP_400_BAD_REQUEST)

    bitstring_filters = "{0:04b}".format(filters)
    users = UserProfile.objects.all()

    if university:
        users = users.filter(affiliation_id=int(university))

    if filters > 0:
        if int(bitstring_filters[-1]):
            users = users.filter(willing_seminar=True)
        if int(bitstring_filters[-2]):
            users = users.filter(willing_peer_review=True)
        if int(bitstring_filters[-3]):
            users = users.filter(willing_allyship=True)
        if int(bitstring_filters[-4]):
            users = users.filter(willing_PHDhelper=True)

    if query:
        q1 = Q(*[
            Q(('first_name__istartswith', term)) | Q(('last_name__istartswith', term))
            for term in query.split()
        ])
        q2 = Q(*[
            Q(('first_name__icontains', term)) | Q(('last_name__icontains', term))
            for term in query.split()
        ])


        users = users.select_related('user').select_related('affiliation')
        users = users.filter(q1).union(users.filter(q2))

    

    if order_by:
        if order_by == 'newest':
            users = users.order_by("-user__date_joined")
        elif order_by == "oldest":
            users = users.order_by("user__date_joined")

    user_list = list(users.values('first_name', 'last_name', 'user_id', 'affiliation__name', 'user__date_joined' ))

    users_paginator = Paginator(users, 36)


    if page_number not in users_paginator.page_range:
        return JsonResponse({
            'users': [],
            'page-range': list(users_paginator.page_range)

        })
    else:
        return JsonResponse({
            'users': list(users_paginator.page(page_number).object_list.values('first_name', 'last_name', 'user_id', 'affiliation__name', 'user__date_joined' )),
            'page-range': list(users_paginator.page_range)
            
        })
class PostEventList(generics.ListCreateAPIView):
    permission_classes = [AllowAny]
    queryset = PostEvent.objects.all()
    serializer_class = PostEventSerializer

    def get(self, request, *args, **kwargs):
        csrf_token = get_token(request)
        response = super().get(request, *args, **kwargs)
        response.set_cookie('csrftoken', csrf_token)
        return response

    def post(self, request, *args, **kwargs):
        serializer = PostEventSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UserPostsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        try:
            posts = PostEvent.objects.filter(created_by=user.userprofile, post_or_event='Post')
            serializer = PostEventSerializer(posts, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Fetching posts failed: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserEventsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        try:
            events = PostEvent.objects.filter(created_by=user.userprofile, post_or_event='Event')
            serializer = PostEventSerializer(events, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Fetching events failed: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    
@api_view(['DELETE'])
def delete_post_event(request, id):
    try:
        post_event = PostEvent.objects.get(pk=id)
    except PostEvent.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        post_event.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class OrganisationList(generics.ListCreateAPIView):
    queryset = Organisation.objects.all()
    serializer_class = OrganisationSerializer
    permission_classes = [AllowAny]

    def get(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({"Organisations": serializer.data})

    def post(self, request):
        serializer = OrganisationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            userid = int(request.GET.get('u', '').strip())
        except ValueError:
            return Response({"error": "Invalid user ID"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user_profile = UserProfile.objects.get(user=userid)
        except UserProfile.DoesNotExist:
            return Response({"error": "User profile not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserProfileSerializer(user_profile)
        return Response(serializer.data)

    def put(self, request):
        ## check this is handled by refresh tokens - 19/03
        user_profile = request.user.userprofile
        print(request.data)
        serializer = UserProfileSerializer(user_profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeleteAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user
        user.delete()
        return Response({'message': 'Account deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    
class CreateVIPView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]  # Ensure parsers are set for file uploads

    def post(self, request, *args, **kwargs):
        logger.info(f"Request data: {request.data}")
        logger.info(f"Request files: {request.FILES}")

        data = request.data.copy()
        data['lead_investigator'] = request.user.userprofile.id  # Set the lead investigator to the current user
        serializer = VIPSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'VIP created successfully!'}, status=status.HTTP_201_CREATED)
        logger.error(f"Serializer errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserVIPsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        try:
            vips = VIP.objects.filter(lead_investigator=user.userprofile)
            serializer = VIPSerializer(vips, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Fetching VIPs failed: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class AllVIPsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            vips = VIP.objects.all()
            serializer = VIPSerializer(vips, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Fetching VIPs failed: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
