# Copyright (C) 2025 HandShake
# Licensed under the Apache License, Version 2.0.
# See LICENSE file for details.

from django import forms
from .models import VIP, PostEvent, Organisation

class PostEventForm(forms.ModelForm):
    class Meta:
        model = PostEvent
        fields = ['title', 'description', 'event_date']
        
class OrganisationForm(forms.ModelForm):
    class Meta:
        model = Organisation
        fields = ['name', 'picture', 'ambassador']
        
class VIPForm(forms.ModelForm):
    
    class Meta:
        model = VIP
        fields = '__all__'
