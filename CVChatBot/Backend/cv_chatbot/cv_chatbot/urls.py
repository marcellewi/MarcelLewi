from django.contrib import admin
from django.urls import path
from cv_chatbot.views import ChatBotViewSet

urlpatterns = [
    path("admin/", admin.site.urls),
    path('chatbot/', ChatBotViewSet.as_view(), name='chatbot'),
]
