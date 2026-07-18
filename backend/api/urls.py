from django.urls import path

from . import views

urlpatterns = [
    path("health/", views.health),
    # Chatbot
    path("chat/", views.chat),
    # Catalogue
    path("garments/", views.GarmentListView.as_view()),
    path("garments/<int:pk>/", views.GarmentDetailView.as_view()),
    # Crafts
    path("crafts/", views.CraftListView.as_view()),
    # Customiser
    path("customiser/recommend/", views.recommend),
    # Studio
    path("studio/analyse-ref-image/", views.analyse_ref_image),
    path("studio/generate-pattern/", views.generate_pattern),
    path("studio/garment-zones/<str:garment_type>/", views.garment_zones),
    # Wishlist
    path("wishlist/save/", views.save_configuration),
    path("wishlist/<str:session_id>/", views.get_configurations),
]
