# Copyright (C) 2025 HandShake
# Licensed under the Apache License, Version 2.0.
# See LICENSE file for details.

from django.contrib.auth.models import User
from django.forms import ValidationError
from rest_framework import serializers
from .models import VIP, UserProfile, PostEvent, Organisation
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    userprofile = UserProfileSerializer()

    class Meta:
        model = User
        fields = ['username', 'password', 'first_name', 'last_name', 'email', 'userprofile']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        profile_data = validated_data.pop('userprofile')
        # Normalize email and use as username
        email = validated_data['email'].lower()
        user = User.objects.create_user(
            username=email,  # Use normalized email as username
            password=validated_data['password'],
            email=email,
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
        )
        UserProfile.objects.create(user=user, **profile_data)
        return user


class PostEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostEvent
        fields = '__all__'
    
    def create(self, validated_data):
        return PostEvent.objects.create(**validated_data)
        
class OrganisationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organisation
        fields = '__all__'

class VIPSerializer(serializers.ModelSerializer):
    lead_investigator_email = serializers.EmailField(source='lead_investigator.user.email', read_only=True)
    file_url = serializers.FileField(source='file_upload', read_only=True)

    class Meta:
        model = VIP
        fields = '__all__'
        extra_kwargs = {
            'file_upload': {'required': False}  # Ensure the field is optional
        }

    def validate_file_upload(self, value):
        if value:  # Only validate if a file is provided
            if value.size > 10 * 1024 * 1024:  # 10MB limit
                raise ValidationError("File size cannot exceed 10MB.")
            allowed_types = ['application/pdf', 'image/jpeg', 'image/png']
            if value.content_type not in allowed_types:
                raise ValidationError("File type not supported. Please upload a PDF, JPEG, or PNG file.")
        return value
    
class TokenCreator(TokenObtainPairSerializer):
    def validate(self,data):
        token = super().validate(data)
        ## THERE NEEDS TO BE ERROR HANDLING HERE BEFORE BEING PUSHED TO TESTING..... nevermind.. no there still should be 
        return {"access_token":token["access"], "refresh_token":token["refresh"]}
    