# Copyright (C) 2025 HandShake
# Licensed under the Apache License, Version 2.0.
# See LICENSE file for details.

from django.db import models
from django.contrib.auth.models import User

class Organisation(models.Model):
    name = models.CharField(max_length=255)
    picture = models.CharField(blank=True, null=True, max_length=255)
    ambassador = models.ForeignKey('UserProfile', on_delete=models.SET_NULL, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    phone = models.CharField(max_length=15, null=True, blank=True)


    def __str__(self):
        return self.name

class UserProfile(models.Model): 
    USER_TYPES = [
        ('Professor', 'Professor'),
        ('Researcher', 'Researcher'),
        ('NatureScot Staff', 'NatureScot Staff'),
        ('Undergraduate', 'Undergraduate'),
        ('Postgraduate', 'Postgraduate'),
        ('Ambassador', 'Ambassador'),
    ]

    USER_ROLES = [
        ('Staff', 'Staff'),
        ('Admin', 'Admin'),
        ('Student', 'Student'),
    ]
    
    SUBJECT_AREA = [
        ('Animal Physiology', 'Animal Physiology'),
        ('Behavioural ecology', 'Behavioural ecology'),
        ('Movement ecology', 'Movement ecology'),
        ('Population ecology', 'Population ecology'),
        ('Community ecology', 'Community ecology'),
        ('Plant ecology', 'Plant ecology'),
        ('Freshwater ecology', 'Freshwater ecology'),
        ('Vector ecology', 'Vector ecology'),
        ('Aquaculture', 'Aquaculture'),
        ('Agroecology', 'Agroecology'),
        ('Statistical ecology', 'Statistical ecology'),
        ('Theoretical ecology', 'Theoretical ecology'),
        ('Environmental change', 'Environmental change'),
        ('Population genetics', 'Population genetics'),
        ('Evolutionary ecology', 'Evolutionary ecology'),
        ('Disease ecology', 'Disease ecology'),
        ('Animal welfare', 'Animal welfare'),
        ('One Health', 'One Health'),
        ('Conservation biology', 'Conservation biology'),
        ('Pollution biology/Toxicology', 'Pollution biology/Toxicology'),
        ('Environment economics', 'Environment economics'),
        ('Biogeography', 'Biogeography'),
        ('Taxonomy/Systematics', 'Taxonomy/Systematics'),
        ('Genetics', 'Genetics'),
        ('Carbon cycling', 'Carbon cycling'),
        ('Social/Human Behavioural Scientist', 'Social/Human Behavioural Scientist'),
        ('Environmental Education', 'Environmental Education'),
        ('Geologist', 'Geologist'),
        ('Geomorphologist', 'Geomorphologist'),
        ('Data Scientist', 'Data Scientist'),
        ('Geographer', 'Geographer'),
        ('Geographical Information Systems expert', 'Geographical Information Systems expert'),
        ('Marine (offshore)', 'Marine (offshore)'),
        ('Marine (intertidal)', 'Marine (intertidal)'),
        ('Coastal', 'Coastal'),
        ('Upland', 'Upland'),
        ('Lowland', 'Lowland'),
        ('Forest/Woodland', 'Forest/Woodland'),
        ('Limnology', 'Limnology'),
        ('Soils', 'Soils'),
        ('Peatland', 'Peatland'),
        ('Estuarine', 'Estuarine'),
        ('Tundra', 'Tundra'),
        ('Wetland', 'Wetland'),
        ('Urban', 'Urban'),
    ]
    
    AREA_OF_EXPERTISE = [
        ('Zoology', 'Zoology'),
        ('Plant Scientist', 'Plant Scientist'),
        ('Microbiology', 'Microbiology'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, blank=True, null=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    profile_picture = models.URLField(blank=True, null=True)
    affiliation = models.ForeignKey(Organisation, on_delete=models.SET_NULL, null=True, blank=True) ## doesnt work
    user_type = models.CharField(max_length=50, choices=USER_TYPES, blank=True, null=True)
    biography = models.TextField(blank=True, null=True)
    ecological_area = models.JSONField(blank=True, null=True)
    subject_area = models.JSONField(default=list, blank=True, null=True)
    variant = models.JSONField(blank=True, null=True)
    area_of_expertise = models.JSONField(default=list, blank=True, null=True)
    willing_peer_review = models.BooleanField(default=False)
    willing_allyship = models.BooleanField(default=False)
    willing_seminar = models.BooleanField(default=False)
    willing_PHDhelper = models.BooleanField(default=False)
    is_ambassador = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    user_type = models.CharField(max_length=50, choices=USER_TYPES, blank=True, null=True)
    email_verification_token = models.CharField(max_length=64, blank=True, null=True)
    email_verification_sent_at = models.DateTimeField(blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    is_complete = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class PostEvent(models.Model):
    EVENT_TYPES = [
        ('Seminar', 'Seminar'),
        ('Collaboration Meeting', 'Collaboration Meeting'),
        ('Research Presentation', 'Research Presentation'),
        ('Conference', 'Conference'),
    ]
    
    POST_OR_EVENT = [
        ('Post', 'Post'),
        ('Event', 'Event'),
    ]
    
    SUBJECT_AREA = [
        ('Animal Physiology', 'Animal Physiology'),
        ('Behavioural ecology', 'Behavioural ecology'),
        ('Movement ecology', 'Movement ecology'),
        ('Population ecology', 'Population ecology'),
        ('Community ecology', 'Community ecology'),
        ('Plant ecology', 'Plant ecology'),
        ('Freshwater ecology', 'Freshwater ecology'),
        ('Vector ecology', 'Vector ecology'),
        ('Aquaculture', 'Aquaculture'),
        ('Agroecology', 'Agroecology'),
        ('Statistical ecology', 'Statistical ecology'),
        ('Theoretical ecology', 'Theoretical ecology'),
        ('Environmental change', 'Environmental change'),
        ('Population genetics', 'Population genetics'),
        ('Evolutionary ecology', 'Evolutionary ecology'),
        ('Disease ecology', 'Disease ecology'),
        ('Animal welfare', 'Animal welfare'),
        ('One Health', 'One Health'),
        ('Conservation biology', 'Conservation biology'),
        ('Pollution biology/Toxicology', 'Pollution biology/Toxicology'),
        ('Environment economics', 'Environment economics'),
        ('Biogeography', 'Biogeography'),
        ('Taxonomy/Systematics', 'Taxonomy/Systematics'),
        ('Genetics', 'Genetics'),
        ('Carbon cycling', 'Carbon cycling'),
        ('Social/Human Behavioural Scientist', 'Social/Human Behavioural Scientist'),
        ('Environmental Education', 'Environmental Education'),
        ('Geologist', 'Geologist'),
        ('Geomorphologist', 'Geomorphologist'),
        ('Data Scientist', 'Data Scientist'),
        ('Geographer', 'Geographer'),
        ('Geographical Information Systems expert', 'Geographical Information Systems expert'),
        ('Marine (offshore)', 'Marine (offshore)'),
        ('Marine (intertidal)', 'Marine (intertidal)'),
        ('Coastal', 'Coastal'),
        ('Upland', 'Upland'),
        ('Lowland', 'Lowland'),
        ('Forest/Woodland', 'Forest/Woodland'),
        ('Limnology', 'Limnology'),
        ('Soils', 'Soils'),
        ('Peatland', 'Peatland'),
        ('Estuarine', 'Estuarine'),
        ('Tundra', 'Tundra'),
        ('Wetland', 'Wetland'),
        ('Urban', 'Urban'),
    ]
    
    AREA_OF_EXPERTISE = [
        ('Zoology', 'Zoology'),
        ('Plant Scientist', 'Plant Scientist'),
        ('Microbiology', 'Microbiology'),
    ]


    title = models.CharField(max_length=255)
    description = models.TextField()
    event_date = models.DateTimeField(blank=True, null=True)
    created_by = models.ForeignKey(UserProfile, on_delete=models.CASCADE, blank=True, null=True)
    created_by_username = models.CharField(max_length=255, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    event_type = models.CharField(max_length=50, choices=EVENT_TYPES, blank=True, null=True)
    subject_area = models.CharField(max_length=255, choices=SUBJECT_AREA, null=True, blank=True)
    area_of_expertise = models.CharField(max_length=255, choices=AREA_OF_EXPERTISE, null=True, blank=True)
    image = models.URLField(blank=True, null=True)
    post_or_event = models.CharField(max_length=50,choices=POST_OR_EVENT,default='Post')

    def __str__(self):
        return self.title
    
class VIP(models.Model):
    title = models.CharField(max_length=255)
    theme = models.CharField(max_length=255, blank=True, null=True)
    subject_area = models.CharField(max_length=255, blank=True, null=True)
    area_of_expertise = models.CharField(max_length=255, blank=True, null=True)
    preferred_interests_and_skills = models.CharField(max_length=255, blank=True, null=True)
    preparation = models.CharField(max_length=255, blank=True, null=True)
    goals = models.CharField(max_length=255, blank=True, null=True)
    specific_issues_addressed = models.CharField(max_length=255, blank=True, null=True)
    methods = models.CharField(max_length=255, blank=True, null=True)
    data_available = models.CharField(max_length=255, blank=True, null=True)
    field_lab_work = models.CharField(max_length=255, blank=True, null=True)
    meeting_schedule = models.CharField(max_length=255, blank=True, null=True)
    meeting_location = models.CharField(max_length=255, blank=True, null=True)
    partner_sponsor = models.CharField(max_length=255, blank=True, null=True)
    lead_investigator = models.ForeignKey(UserProfile, on_delete=models.CASCADE, blank=True, null=True)
    file_upload = models.FileField(upload_to='vip_uploads/', blank=True, null=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title