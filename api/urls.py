"""
URL configuration for API app
"""
from django.urls import path
from . import views

urlpatterns = [
    path('challenges/', views.list_challenges, name='list_challenges'),
    path('challenges/<str:challenge_id>/', views.get_challenge, name='get_challenge'),
    path('leaderboard/<str:challenge_id>/', views.get_leaderboard, name='get_leaderboard'),
    path('scores/', views.submit_score, name='submit_score'),
]

