# Copyright (C) 2025 HandShake
# Licensed under the Apache License, Version 2.0.
# See LICENSE file for details.

from django.contrib import admin
from .models import Organisation, UserProfile, PostEvent

admin.site.register(Organisation)
admin.site.register(UserProfile)
admin.site.register(PostEvent)

