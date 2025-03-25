# Copyright (C) 2025 HandShake
# Licensed under the Apache License, Version 2.0.
# See LICENSE file for details.

import os
import django
import random
from datetime import datetime, timedelta

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from handshake.models import Organisation, UserProfile, PostEvent, VIP
from django.contrib.auth.models import User

def get_image_path(image_name):
    return os.path.join('..', 'frontend', 'src', 'assets', image_name)

def create_organisations():
    organisations = [
        {'name': 'University of Glasgow', 'picture': get_image_path('AU.jpg'), 'email': '2861571h@gla.ac.uk', 'phone': '0141 330 2000'},
        {'name': 'University of Edinburgh', 'picture': 'http://example.com/university.png', 'email': '2861571h@edi.ac.uk', 'phone': '0141 330 2000'},
        {'name': 'University of Aberdeen', 'picture': 'http://example.com/university.png', 'email': '2861571h@abd.ac.uk', 'phone': '0141 330 2000'},
        {'name': 'University of Sterling', 'picture': 'http://example.com/university.png', 'email': '2861571h@str.ac.uk', 'phone': '0141 330 2000'},
    ]
    for org in organisations:
        Organisation.objects.create(**org)

def create_users():
    users = [
        {'username': 'john_doe', 'first_name': 'John', 'last_name': 'Doe', 'email': 'john@example.com', 'password': 'password123', 'subject_area': 'Animal Physiology', 'area_of_expertise': 'Zoology', 'variant': 'Zoology'},
        {'username': 'jane_smith', 'first_name': 'Jane', 'last_name': 'Smith', 'email': 'jane@example.com', 'password': 'password123', 'subject_area': 'Behavioural ecology', 'area_of_expertise': 'Plant Scientist', 'variant': 'Zoology'},
        {'username': 'alice_jones', 'first_name': 'Alice', 'last_name': 'Jones', 'email': 'alice@example.com', 'password': 'password123', 'subject_area': 'Movement ecology', 'area_of_expertise': 'Microbiology', 'variant': 'Zoology'},
        {'username': 'bob_brown', 'first_name': 'Bob', 'last_name': 'Brown', 'email': 'bob@example.com', 'password': 'password123', 'subject_area': 'Population ecology', 'area_of_expertise': 'Zoology', 'variant': 'Zoology'},
        {'username': 'charlie_clark', 'first_name': 'Charlie', 'last_name': 'Clark', 'email': 'charlie@example.com', 'password': 'password123', 'subject_area': 'Community ecology', 'area_of_expertise': 'Plant Scientist', 'variant': 'Zoology'},
        {'username': 'david_evans', 'first_name': 'David', 'last_name': 'Evans', 'email': 'david@example.com', 'password': 'password123', 'subject_area': 'Plant ecology', 'area_of_expertise': 'Microbiology', 'variant': 'Zoology'},
        {'username': 'emma_green', 'first_name': 'Emma', 'last_name': 'Green', 'email': 'emma@example.com', 'password': 'password123', 'subject_area': 'Freshwater ecology', 'area_of_expertise': 'Zoology', 'variant': 'Zoology'},
        {'username': 'frank_harris', 'first_name': 'Frank', 'last_name': 'Harris', 'email': 'frank@example.com', 'password': 'password123', 'subject_area': 'Vector ecology', 'area_of_expertise': 'Plant Scientist', 'variant': 'Zoology'},
        {'username': 'grace_king', 'first_name': 'Grace', 'last_name': 'King', 'email': 'grace@example.com', 'password': 'password123', 'subject_area': 'Aquaculture', 'area_of_expertise': 'Microbiology', 'variant': 'Zoology'},
        {'username': 'henry_lee', 'first_name': 'Henry', 'last_name': 'Lee', 'email': 'henry@example.com', 'password': 'password123', 'subject_area': 'Agroecology', 'area_of_expertise': 'Zoology', 'variant': 'Zoology'},
        {'username': 'daniel.haydon@glasgow.ac.uk', 'first_name': 'Daniel', 'last_name': 'Haydon', 'email': 'daniel.haydon@example.com', 'password': 'password123', 'subject_area': 'Animal Physiology', 'area_of_expertise': 'Zoology', 'variant': 'Zoology'},
        {'username': 'hn_lee', 'first_name': 'Henry', 'last_name': 'Lee', 'email': 'henry1@example.com', 'password': 'password123', 'subject_area': 'Agroecology', 'area_of_expertise': 'Zoology', 'variant': 'Zoology'},
        {"username": "job_jim", "first_name": "Henry", "last_name": "Lee", "email": "henry2@example.com", "password": "password123", "subject_area": "Agroecology", "area_of_expertise": "Zoology", "variant": "Zoology"},
        {"username": "jolly_jim", "first_name": "Henry", "last_name": "Lee", "email": "henry3@example.com", "password": "password123", "subject_area": "Agroecology", "area_of_expertise": "Zoology", "variant": "Zoology"},
        {"username": "bob_henry", "first_name": "Henry", "last_name": "Lee", "email": "henry4@example.com", "password": "password123", "subject_area": "Agroecology", "area_of_expertise": "Zoology", "variant": "Zoology"},
        {"username": "Lisn", "first_name": "Henry", "last_name": "Lee", "email": "henry5@example.com", "password": "password123", "subject_area": "Agroecology", "area_of_expertise": "Zoology", "variant": "Zoology"},
        {"username": "asd", "first_name": "Henry", "last_name": "Lee", "email": "henry6@example.com", "password": "password123", "subject_area": "Agroecology", "area_of_expertise": "Zoology", "variant": "Zoology"},
        {"username": "gdfgdfg", "first_name": "Henry", "last_name": "Lee", "email": "henry7@example.com", "password": "password123", "subject_area": "Agroecology", "area_of_expertise": "Zoology", "variant": "Zoology"},
        {"username": "dfhhhdfgdf", "first_name": "Henry", "last_name": "Lee", "email": "henry8@example.com", "password": "password123", "subject_area": "Agroecology", "area_of_expertise": "Zoology", "variant": "Zoology"},
        {"username": "fjijdsfp;", "first_name": "Henry", "last_name": "Lee", "email": "henry9@example.com", "password": "password123", "subject_area": "Agroecology", "area_of_expertise": "Zoology", "variant": "Zoology"},
        {"username": "asda;", "first_name": "Henry", "last_name": "Lee", "email": "henry9@example.com", "password": "password123", "subject_area": "Agroecology", "area_of_expertise": "Zoology", "variant": "Zoology"},
        {"username": "hello;", "first_name": "Henry", "last_name": "Lee", "email": "henry9@example.com", "password": "password123", "subject_area": "Agroecology", "area_of_expertise": "Zoology", "variant": "Zoology"},
        {'username': 'myname;', 'first_name': 'Henry', 'last_name': 'Lee', 'email': 'henry9@example.com', 'password': 'password123', 'subject_area': 'Agroecology', 'area_of_expertise': 'Zoology', 'variant': 'Zoology'},
        {'username': 'isjoe;', 'first_name': 'Henry', 'last_name': 'Lee', 'email': 'henry9@example.com', 'password': 'password123', 'subject_area': 'Agroecology', 'area_of_expertise': 'Zoology', 'variant': 'Zoology'},
        {'username': 'whatis;', 'first_name': 'Henry', 'last_name': 'Lee', 'email': 'henry9@example.com', 'password': 'password123', 'subject_area': 'Agroecology', 'area_of_expertise': 'Zoology', 'variant': 'Zoology'},
        {'username': 'yourname;', 'first_name': 'Henry', 'last_name': 'Lee', 'email': 'henry9@example.com', 'password': 'password123', 'subject_area': 'Agroecology', 'area_of_expertise': 'Zoology', 'variant': 'Zoology'},
        {'username': 'thisis;', 'first_name': 'Henry', 'last_name': 'Lee', 'email': 'henry9@example.com', 'password': 'password123', 'subject_area': 'Agroecology', 'area_of_expertise': 'Zoology', 'variant': 'Zoology'},
        {'username': 'fake;', 'first_name': 'Henry', 'last_name': 'Lee', 'email': 'henry9@example.com', 'password': 'password123', 'subject_area': 'Agroecology', 'area_of_expertise': 'Zoology', 'variant': 'Zoology'},
        {'username': 'usersfortesting', 'first_name': 'Henry', 'last_name': 'Lee', 'email': 'henry9@example.com', 'password': 'password123', 'subject_area': 'Agroecology', 'area_of_expertise': 'Zoology', 'variant': 'Zoology'},
        {'username': 'blahblahblah;', 'first_name': 'Henry', 'last_name': 'Lee', 'email': 'henry9@example.com', 'password': 'password123', 'subject_area': 'Agroecology', 'area_of_expertise': 'Zoology', 'variant': 'Zoology'},
        {'username': 'asidhasd;', 'first_name': 'Henry', 'last_name': 'Lee', 'email': 'henry9@example.com', 'password': 'password123', 'subject_area': 'Agroecology', 'area_of_expertise': 'Zoology', 'variant': 'Zoology'},
        {'username': 'secondlastone;', 'first_name': 'Henry', 'last_name': 'Lee', 'email': 'henry9@example.com', 'password': 'password123', 'subject_area': 'Agroecology', 'area_of_expertise': 'Zoology', 'variant': 'Zoology'},
        {'username': 'lastone;', 'first_name': 'Henry', 'last_name': 'Lee', 'email': 'henry9@example.com', 'password': 'password123', 'subject_area': 'Agroecology', 'area_of_expertise': 'Zoology', 'variant': 'Zoology'},
    ]
    for user_data in users:
        user = User.objects.create_user(
            username=user_data['username'],
            first_name=user_data['first_name'],
            last_name=user_data['last_name'],
            email=user_data['email'],
            password=user_data['password'],
        )
        UserProfile.objects.create(
            user=user,
            first_name=user_data['first_name'],
            last_name=user_data['last_name'],
            profile_picture='http://example.com/profile.png',
            affiliation=Organisation.objects.order_by('?').first(),
            user_type=random.choice(UserProfile.USER_TYPES)[0],
            biography='Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            ecological_area="Wetlands",
            subject_area=user_data['subject_area'],
            variant=user_data['variant'],
            area_of_expertise=user_data['area_of_expertise'],
            willing_seminar=True,
            willing_peer_review=True,
            willing_allyship=False,
            willing_PHDhelper=False,
            is_ambassador=False,
        )

def create_post_events():
    events = [
        {'title': 'Seminar on Ecology', 'description': 'A seminar on the latest research in ecology.', 'event_type': 'Seminar', 'location': 'University Seminar Room', 'post_or_event': 'Event'},
        {'title': 'Collaboration Meeting', 'description': 'A meeting to discuss collaboration opportunities.', 'event_type': 'Collaboration Meeting', 'location': 'Conference Center', 'post_or_event': 'Event'},
        {'title': 'Research Presentation', 'description': 'Presentation of recent research findings.', 'event_type': 'Research Presentation', 'location': 'Research Institute Auditorium', 'post_or_event': 'Event'},
        {'title': 'Annual Conference', 'description': 'The annual conference on environmental science.', 'event_type': 'Conference', 'location': 'NatureScot Headquarters', 'post_or_event': 'Event'},
        {'title': 'Workshop on Plant Ecology', 'description': 'A workshop on plant ecology techniques.', 'event_type': 'Workshop', 'location': 'Botanical Gardens', 'post_or_event': 'Event'},
        {'title': 'Field Trip to Highlands', 'description': 'A field trip to study highland ecosystems.', 'event_type': 'Field Trip', 'location': 'Scottish Highlands', 'post_or_event': 'Event'},
        {'title': 'Lecture on Marine Biology', 'description': 'A lecture on marine biology research.', 'event_type': 'Lecture', 'location': 'Marine Research Center', 'post_or_event': 'Event'},
    ]
    for event in events:
        created_by = UserProfile.objects.order_by('?').first()
        PostEvent.objects.create(
            title=event['title'],
            description=event['description'],
            event_date=datetime.now() + timedelta(days=random.randint(1, 30)),
            created_by=created_by,
            created_by_username=created_by.user.username,
            location=event['location'],
            event_type=event['event_type'],
            subject_area=random.choice(['Geographer', 'Ecologist', 'Biologist']),
            area_of_expertise=random.choice(['Zoology', 'Plant Scientist', 'Microbiology']),
            post_or_event=event['post_or_event'],
            image='',
        )

    posts = [
        {'title': 'NEW POST: Research Assistant', 'description': 'A new job opportunity for a research assistant.', 'event_type': 'Job Post', 'location': 'University of Example', 'post_or_event': 'Post'},
        {'title': 'NEW POST: Lab Technician', 'description': 'A new job opportunity for a lab technician.', 'event_type': 'Job Post', 'location': 'Research Lab', 'post_or_event': 'Post'},
        {'title': 'NEW POST: Field Researcher', 'description': 'A new job opportunity for a field researcher.', 'event_type': 'Job Post', 'location': 'Field Station', 'post_or_event': 'Post'},
        {'title': 'NEW POST: Data Analyst', 'description': 'A new job opportunity for a data analyst.', 'event_type': 'Job Post', 'location': 'Data Center', 'post_or_event': 'Post'},
        {'title': 'NEW POST: Project Manager', 'description': 'A new job opportunity for a project manager.', 'event_type': 'Job Post', 'location': 'Project Office', 'post_or_event': 'Post'},
        {'title': 'NEW POST: Environmental Consultant', 'description': 'A new job opportunity for an environmental consultant.', 'event_type': 'Job Post', 'location': 'Consulting Firm', 'post_or_event': 'Post'},
        {'title': 'NEW POST: Wildlife Biologist', 'description': 'A new job opportunity for a wildlife biologist.', 'event_type': 'Job Post', 'location': 'Wildlife Reserve', 'post_or_event': 'Post'},
        {'title': 'NEW POST: Conservation Officer', 'description': 'A new job opportunity for a conservation officer.', 'event_type': 'Job Post', 'location': 'Conservation Area', 'post_or_event': 'Post'},
    ]
    for post in posts:
        created_by = UserProfile.objects.order_by('?').first()
        PostEvent.objects.create(
            title=post['title'],
            description=post['description'],
            event_date=datetime.now() + timedelta(days=random.randint(1, 30)),
            created_by=created_by,
            created_by_username=created_by.user.username,
            location=post['location'],
            event_type=post['event_type'],
            subject_area=random.choice(['Geographer', 'Ecologist', 'Biologist']),
            area_of_expertise=random.choice(['Zoology', 'Plant Scientist', 'Microbiology']),
            post_or_event=post['post_or_event'],
            image='',
        )

def create_vips():
    users = UserProfile.objects.all()
    john_doe = UserProfile.objects.get(user__username='john_doe')
    vip_titles = [
        'VIP Project 1', 'VIP Project 2', 'VIP Project 3', 'VIP Project 4', 'VIP Project 5',
        'VIP Project 6', 'VIP Project 7', 'VIP Project 8', 'VIP Project 9', 'VIP Project 10'
    ]
    for title in vip_titles[:2]:
        VIP.objects.create(
            title=title,
            theme='Theme for ' + title,
            subject_area=random.choice(['Animal Physiology', 'Behavioural ecology', 'Movement ecology']),
            area_of_expertise=random.choice(['Zoology', 'Plant Scientist', 'Microbiology']),
            preferred_interests_and_skills='Preferred interests and skills for ' + title,
            preparation='Preparation for ' + title,
            goals='Goals for ' + title,
            specific_issues_addressed='Specific issues addressed for ' + title,
            methods='Methods for ' + title,
            data_available='Data available for ' + title,
            field_lab_work='Field/Lab work for ' + title,
            meeting_schedule='Meeting schedule for ' + title,
            meeting_location='Meeting location for ' + title,
            partner_sponsor='Partner/Sponsor for ' + title,
            lead_investigator=john_doe,
        )
    for title in vip_titles[2:]:
        lead_investigator = random.choice(users.exclude(user__username='john_doe'))
        VIP.objects.create(
            title=title,
            theme='Theme for ' + title,
            subject_area=random.choice(['Animal Physiology', 'Behavioural ecology', 'Movement ecology']),
            area_of_expertise=random.choice(['Zoology', 'Plant Scientist', 'Microbiology']),
            preferred_interests_and_skills='Preferred interests and skills for ' + title,
            preparation='Preparation for ' + title,
            goals='Goals for ' + title,
            specific_issues_addressed='Specific issues addressed for ' + title,
            methods='Methods for ' + title,
            data_available='Data available for ' + title,
            field_lab_work='Field/Lab work for ' + title,
            meeting_schedule='Meeting schedule for ' + title,
            meeting_location='Meeting location for ' + title,
            partner_sponsor='Partner/Sponsor for ' + title,
            lead_investigator=lead_investigator,
        )

if __name__ == '__main__':
    create_organisations()
    create_users()
    create_post_events()
    create_vips()
    print("Database populated successfully.")