# Copyright (C) 2025 HandShake
# Licensed under the Apache License, Version 2.0.
# See LICENSE file for details.

from django.forms import ValidationError
from django.test import TestCase
from django.contrib.auth.models import User
from .models import VIP, UserProfile, Organisation, PostEvent
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from rest_framework.test import APIClient
from .serializers import UserSerializer, PostEventSerializer, OrganisationSerializer, TokenCreator
from populate_handshake import create_organisations, create_users, create_post_events
from datetime import datetime, timedelta
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import AuthenticationFailed
from unittest.mock import patch
import json

class ModelsTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="password123")
        self.org = Organisation.objects.create(name="Test Organisation")
        self.profile = UserProfile.objects.create(
            user=self.user,
            first_name="John",
            last_name="Doe",
            #role="Staff",
            #position="Researcher",
            subject_area="Animal Physiology",
            area_of_expertise="Zoology",
            affiliation=self.org,
            user_type="Researcher"
        )

    def test_create_organisation(self):
        org = Organisation.objects.create(
            name="New Org",
            picture="https://example.com/logo.png",
            email="info@neworg.com",
            phone="123456789"
        )
        self.assertEqual(org.name, "New Org")
        self.assertEqual(org.picture, "https://example.com/logo.png")
        self.assertEqual(org.email, "info@neworg.com")
        self.assertEqual(org.phone, "123456789")
        self.assertEqual(str(org), "New Org")

    def test_create_user_profile(self):
        self.assertEqual(self.profile.first_name, "John")
        self.assertEqual(self.profile.last_name, "Doe")
        self.assertEqual(self.profile.subject_area, "Animal Physiology")
        self.assertEqual(self.profile.area_of_expertise, "Zoology")
        self.assertEqual(self.profile.affiliation, self.org)
        self.assertFalse(self.profile.is_verified)
        self.assertEqual(str(self.profile), "John Doe")

    def test_create_post_event(self):
        post = PostEvent.objects.create(
            title="Ecology Seminar",
            description="A seminar on Ecology",
            created_by=self.profile,
            created_by_username=self.profile.user.username,
            location="University Hall",
            event_type="Seminar",
            subject_area="Plant ecology",
            area_of_expertise="Plant Scientist",
            image="https://example.com/seminar.jpg",
            post_or_event="Event"
        )
        self.assertEqual(post.title, "Ecology Seminar")
        self.assertEqual(post.description, "A seminar on Ecology")
        self.assertEqual(post.created_by, self.profile)
        self.assertEqual(post.created_by_username, "testuser")
        self.assertEqual(post.location, "University Hall")
        self.assertEqual(post.event_type, "Seminar")
        self.assertEqual(post.subject_area, "Plant ecology")
        self.assertEqual(post.area_of_expertise, "Plant Scientist")
        self.assertEqual(post.post_or_event, "Event")
        self.assertEqual(str(post), "Ecology Seminar")

    def test_userprofile_affiliation_can_be_null(self):
        user = User.objects.create(username="noaffiliation", password="password123")
        profile = UserProfile.objects.create(
            user=user,
            first_name="Alice",
            last_name="Brown",
            subject_area="Taxonomy/Systematics",
            area_of_expertise="Microbiology",
            user_type="Undergraduate"
        )
        self.assertIsNone(profile.affiliation)

    def test_organisation_ambassador_can_be_null(self):
        org = Organisation.objects.create(name="No Ambassador Org")
        self.assertIsNone(org.ambassador)

    def test_post_event_event_date_can_be_null(self):
        post = PostEvent.objects.create(title="No Date Event", created_by=self.profile)
        self.assertIsNone(post.event_date)

    def test_invalid_email_format(self):
        org = Organisation(name="Invalid Email Org", email="invalid-email")
        with self.assertRaises(ValidationError):
            org.full_clean()

    def test_default_values_in_userprofile(self):
        user = User.objects.create(username="defaultuser", password="password123")
        profile = UserProfile.objects.create(
            user=user,
            first_name="Default",
            last_name="User",
            subject_area="Environmental change",
            area_of_expertise="Zoology",
            user_type="Researcher"
        )
        self.assertTrue(profile.is_active)
        self.assertFalse(profile.is_verified)
        self.assertFalse(profile.is_ambassador)


class EditViewTest(TestCase):
    
    def setUp(self):
        self.organisation = Organisation.objects.create(name='University X')
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.user_profile = UserProfile.objects.create(
            user=self.user,
            first_name='John',
            last_name='Doe',
            affiliation=self.organisation,
            biography='Experienced in web development',
            area_of_expertise='Computer Science',
            subject_area='Software Engineering',
            willing_peer_review=True,
            willing_allyship=True,
            willing_seminar=True,
            willing_PHDhelper=True,
        )
        self.url = reverse('edit_view')

    def test_update_profile_user_not_authenticated(self):
        self.client.logout()
        data = {
            'first_name': 'Unauthenticated',
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.json()['detail'], 'Authentication credentials were not provided.')

User = get_user_model()
class ViewsTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="password123"
        )
        self.user_profile = UserProfile.objects.create(user=self.user, first_name="John", last_name="Doe")
        self.token = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token.access_token}')

        self.user2 = User.objects.create_user(
            username="testuser2",
            email="test2@example.com",
            password="password123"
        )
        self.user_profile2 = UserProfile.objects.create(user=self.user2, first_name="Jane", last_name="Smith")

        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

    def test_register_user_invalid_password(self):
        url = reverse('register')
        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "123",
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Password', response.data)
    
    def test_verify_email_expired_token(self):
        user = User.objects.create_user(username="expireduser", email="expired@example.com", password="password123")
        profile = UserProfile.objects.create(
            user=user,
            email_verification_token="expiredtoken",
            email_verification_sent_at=timezone.now() - timedelta(days=2) )

        url = reverse('verify-email', args=["expiredtoken"])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Token expired')

    def test_check_verification_verified_user(self):
        user = User.objects.create_user(username="verifieduser", email="verified@example.com", password="password123")
        profile = UserProfile.objects.create(user=user, is_verified=True)

        url = reverse('check-verification', args=["verifieduser"])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['verified'])

    def test_check_verification_unverified_user(self):
        user = User.objects.create_user(username="unverifieduser", email="unverified@example.com", password="password123")
        profile = UserProfile.objects.create(user=user, is_verified=False)

        url = reverse('check-verification', args=["unverifieduser"])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data['verified'])

    def test_edit_profile(self):
        url = reverse('edit_view')
        data = {
            "first_name": "UpdatedFirstName",
            "last_name": "UpdatedLastName",
            "biography": "Updated bio",
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'Profile updated successfully')

    def test_get_user_profile_not_found(self):
        response = self.client.get('/handshake/profile/?u=9999')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_create_vip_valid(self):
        url = reverse('create_vip')
        data = {
            "title": "New VIP",
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['message'], 'VIP created successfully!')

    def test_create_vip_invalid_data(self):
        url = reverse('create_vip')
        data = {
            "title": "",
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_user_vips_empty(self):
        url = reverse('user_vips')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_get_all_vips(self):
        VIP.objects.create(title="VIP 1", lead_investigator=self.user_profile)
        VIP.objects.create(title="VIP 2", lead_investigator=self.user_profile)

        url = reverse('all_vips')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_get_user_posts_empty(self):
        url = reverse('user_posts')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_get_organisations_empty(self):
        url = reverse('organisation-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['Organisations']), 0)

    def test_get_organisations_multiple(self):
        Organisation.objects.create(name="Org 1")
        Organisation.objects.create(name="Org 2")

        url = reverse('organisation-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['Organisations']), 2)

    def test_delete_account_unauthorized(self):
        self.client.credentials()
        url = reverse('delete_account')
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_change_password_unauthorized(self):
        self.client.credentials()
        url = reverse('change-password')
        data = {
            "password": "password123",
            "new_password": "newpassword123",
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_register_user_invalid(self):
        url = reverse('register')
        data = {
            "username": "",
            "email": "invalidemail",
            "password": ""
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login(self):
        url = reverse('login')
        data = {"username": "testuser", "password": "password123"}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access_token', response.data)

    def test_invalid_login(self):
        url = reverse('login')
        data = {"username": "testuser", "password": "wrongpassword"}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_logout(self):
        url = reverse('logout')
        data = {"refresh_token": str(RefreshToken.for_user(self.user))}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_account(self):
        url = reverse('delete_account')
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(User.objects.filter(username="testuser").exists())

    def test_edit_profile_unauthorized(self):
        self.client.credentials()
        url = reverse('edit_view')
        data = {"first_name": "Unauthorized Edit"}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_authenticate_profile(self):
        url = reverse('authenticate-profile') + f"?u={self.user.id}"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data)
    
    def test_get_user_profile(self):
        response = self.client.get(f'/handshake/profile/?u={self.user.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authenticate_other_user(self):
        url = reverse('authenticate-profile') + f"?u={self.user2.id}"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data)

    def test_post_event_creation(self):
        url = reverse('post-event-list')
        data = {"title": "Django Meetup", "description": "Learn Django"}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_delete_post_event(self):
        post_event = PostEvent.objects.create(title='Delete Me', description='To be deleted')
        response = self.client.delete(f'/handshake/noticeboard/{post_event.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_organisation_creation(self):
        url = reverse('organisation-list')
        data = {"name": "Tech Org"}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_delete_account(self):
        url = reverse('delete_account')
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(User.objects.filter(username="testuser").exists())

    def test_change_password(self):
        response = self.client.put('/handshake/change-password/', {
            'password': 'password123',
            'new_password': 'newpassword123'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)


    def test_register_existing_user(self):
        url = reverse('register')
        data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "password123",
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_change_password_invalid_old_password(self):
        response = self.client.put('/handshake/change-password/', {
            'password': 'wrongpassword',
            'new_password': 'newpassword123'
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_nonexistent_post_event(self):
        response = self.client.delete('/handshake/noticeboard/9999/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_logout_with_invalid_token(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer invalidtoken')
        url = reverse('logout')
        response = self.client.post(url, {"refresh_token": "invalidtoken"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)



class SerializerTest(TestCase):
    def setUp(self):
        self.user_data = {
            "username": "testuser",
            "email": "testuser@example.com",
            "password": "testpassword123",
            "userprofile": {},
            "first_name": "Test",
            "last_name": "User",
            "skills": ["Python", "Django"]
        }
        self.event_data = {
            "title": "Test Event",
            "description": "This is a test event.",
            "event_date": "2025-02-25",
            "location": "Test Location"
        }
        self.organisation_data = {
            "name": "Test Organisation",
            "description": "This is a test organisation."
        }

    # def test_user_serializer_valid(self):
        
    #     user_data = {
    #         "username": "testuser",
    #         "password": "testpassword123",
    #         "email": "testuser@example.com",
    #         "first_name": "Test",
    #         "last_name": "User",
    #         "userprofile": {
    #         "subject_area": "Animal Physiology",
    #         "area_of_expertise": "Zoology",
    #         "user_type": "Professor",
    #         "skills": ["Python", "Django"],
    #         }
    #     }
    #     serializer = UserSerializer(data=user_data)
    #     self.assertTrue(serializer.is_valid())
    #     user = serializer.save()
    #     self.assertEqual(user.username, "testuser")
    #     self.assertEqual(user.email, "testuser@example.com")
    #     self.assertEqual(user.first_name, "Test")
    #     self.assertEqual(user.last_name, "User")
    #     self.assertEqual(user.userprofile.position, "Backend Developer")
    #     self.assertEqual(user.userprofile.subject_area, "Animal Physiology")
    #     self.assertEqual(user.userprofile.area_of_expertise, "Zoology")
    #     self.assertEqual(user.userprofile.user_type, "Professor")

    def test_user_serializer_invalid(self):
        invalid_data = self.user_data.copy()
        invalid_data["username"] = ""
        serializer = UserSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("username", serializer.errors)

    def test_post_event_serializer_valid(self):
        serializer = PostEventSerializer(data=self.event_data)
        self.assertTrue(serializer.is_valid())
        event = serializer.save()
        self.assertEqual(event.title, "Test Event")
        self.assertEqual(event.location, "Test Location")

    def test_post_event_serializer_invalid(self):
        invalid_data = self.event_data.copy()
        invalid_data["event_date"] = ""
        serializer = PostEventSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("event_date", serializer.errors)

    def test_organisation_serializer_valid(self):
        organisation_data = {
            "name": "Test Organisation",
            "picture": "https://example.com/pic.jpg",
            "email": "testorg@example.com",
            "phone": "123456789",
            "ambassador": None
        }
        serializer = OrganisationSerializer(data=organisation_data)
        self.assertTrue(serializer.is_valid())
        organisation = serializer.save()
        self.assertEqual(organisation.name, "Test Organisation")
        self.assertEqual(organisation.email, "testorg@example.com")
        self.assertEqual(organisation.phone, "123456789")
        self.assertIsNone(organisation.ambassador)

    def test_organisation_serializer_invalid(self):
        invalid_data = self.organisation_data.copy()
        invalid_data["name"] = ""
        serializer = OrganisationSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("name", serializer.errors)

    def test_token_creator_valid(self):
        user = User.objects.create_user(username="testuser", password="testpassword123")
        token_data = {
            "username": "testuser",
            "password": "testpassword123"
        }
        serializer = TokenCreator(data=token_data)
        self.assertTrue(serializer.is_valid())
        result = serializer.validated_data
        self.assertIn("access_token", result)
        self.assertIn("refresh_token", result)

    def test_token_creator_invalid(self):
        user = User.objects.create_user(username="testuser", password="testpassword123")
        token_data = {
        "username": "testuser",
        "password": "wrongpassword"
        }
        serializer = TokenCreator(data=token_data)
        try:
            serializer.is_valid(raise_exception=True)
            self.fail("Expected AuthenticationFailed exception, but none was raised.")
        except AuthenticationFailed as e:
            self.assertEqual(str(e), "No active account found with the given credentials")

# class PopulationScriptTest(TestCase):

#     def setUp(self):
#         Organisation.objects.all().delete()
#         User.objects.all().delete()
#         UserProfile.objects.all().delete()
#         PostEvent.objects.all().delete()

#     def test_create_organisations(self):
#         create_organisations()
#         organisations = Organisation.objects.all()

#         self.assertEqual(organisations.count(), 4)
#         self.assertTrue(Organisation.objects.filter(name="University of Edinburgh").exists())
#         self.assertTrue(Organisation.objects.filter(name="University of Glasgow").exists())
#         self.assertTrue(Organisation.objects.filter(name="University of Sterling").exists())

#     def test_create_users(self):
#         create_organisations()
#         create_users()
#         users = User.objects.all()
#         profiles = UserProfile.objects.all()

#         self.assertEqual(users.count(), 3)
#         self.assertEqual(profiles.count(), 3)

#         user = User.objects.get(username="john_doe")
#         profile = UserProfile.objects.get(user=user)

#         self.assertEqual(user.first_name, "John")
#         self.assertEqual(profile.first_name, "John")
#         self.assertTrue(profile.affiliation in Organisation.objects.all())

#     def test_create_post_events(self):
#         create_organisations()
#         create_users()
#         create_post_events()

#         events = PostEvent.objects.all()
#         self.assertEqual(events.count(), 5)

#         event = PostEvent.objects.get(title="Seminar on Ecology")
#         self.assertTrue(isinstance(event.event_date, datetime))
#         self.assertTrue(event.created_by in UserProfile.objects.all())
#         self.assertEqual(event.location, "University Seminar Room")

#     def test_event_date_future(self):
#         create_organisations()
#         create_users()
#         create_post_events()

#         for event in PostEvent.objects.all():
#             self.assertGreater(event.event_date, timezone.now())

#     def test_profile_contains_correct_data(self):
#         create_organisations()
#         create_users()

#         profile = UserProfile.objects.get(user__username="john_doe")
#         self.assertEqual(profile.biography, "Lorem ipsum dolor sit amet, consectetur adipiscing elit.")
#         self.assertEqual(profile.willing_travel_distance, 50)
#         self.assertTrue(profile.is_verified)

