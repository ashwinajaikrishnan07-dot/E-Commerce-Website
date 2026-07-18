from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.response import Response

from . import ai_services
from .mannequin_data import zone_coordinates_for
from .models import CraftType, GarmentType, SavedConfiguration
from .serializers import (
    CraftTypeSerializer,
    GarmentTypeListSerializer,
    GarmentTypeSerializer,
    SavedConfigurationSerializer,
)


# --------------------------------------------------------------------------- #
# Catalogue: garments
# --------------------------------------------------------------------------- #
class GarmentListView(ListAPIView):
    serializer_class = GarmentTypeListSerializer

    def get_queryset(self):
        qs = GarmentType.objects.all()
        params = self.request.query_params
        gtype = params.get("type")
        occasion = params.get("occasion")
        fabric = params.get("fabric")
        min_price = params.get("min_price")
        max_price = params.get("max_price")
        if gtype:
            qs = qs.filter(name__iexact=gtype)
        if occasion:
            qs = qs.filter(occasion__icontains=occasion)
        if fabric:
            qs = qs.filter(fabric__icontains=fabric)
        if min_price:
            qs = qs.filter(base_price__gte=min_price)
        if max_price:
            qs = qs.filter(base_price__lte=max_price)
        return qs


class GarmentDetailView(RetrieveAPIView):
    queryset = GarmentType.objects.all()
    serializer_class = GarmentTypeSerializer


# --------------------------------------------------------------------------- #
# Craft types
# --------------------------------------------------------------------------- #
class CraftListView(ListAPIView):
    queryset = CraftType.objects.all()
    serializer_class = CraftTypeSerializer


# --------------------------------------------------------------------------- #
# Chatbot
# --------------------------------------------------------------------------- #
@api_view(["POST"])
def chat(request):
    data = request.data or {}
    message = (data.get("message") or "").strip()
    if not message:
        return Response({"error": "message is required"}, status=status.HTTP_400_BAD_REQUEST)
    result = ai_services.chat_reply(
        message=message,
        page_context=data.get("page_context") or {},
        language=data.get("language"),
        conversation_history=data.get("conversation_history") or [],
    )
    return Response(result)


# --------------------------------------------------------------------------- #
# Customiser recommendation
# --------------------------------------------------------------------------- #
@api_view(["POST"])
def recommend(request):
    data = request.data or {}
    result = ai_services.recommend_craft(
        occasion=data.get("occasion"),
        fabric=data.get("fabric"),
        budget=data.get("budget"),
    )
    return Response(result)


# --------------------------------------------------------------------------- #
# Studio
# --------------------------------------------------------------------------- #
@api_view(["POST"])
def analyse_ref_image(request):
    upload = request.FILES.get("image")
    if upload is not None:
        image_bytes = upload.read()
        media_type = getattr(upload, "content_type", "image/jpeg") or "image/jpeg"
    else:
        image_bytes = None
        media_type = "image/jpeg"
    result = ai_services.analyse_ref_image(image_bytes, media_type=media_type)
    return Response(result)


@api_view(["POST"])
def generate_pattern(request):
    data = request.data or {}
    prompt = data.get("prompt") or data.get("description") or "floral embroidery"
    result = ai_services.generate_pattern(
        prompt=prompt,
        garment_type=data.get("garment_type"),
        zone=data.get("zone"),
    )
    return Response(result)


@api_view(["GET"])
def garment_zones(request, garment_type):
    return Response(zone_coordinates_for(garment_type))


# --------------------------------------------------------------------------- #
# Wishlist / saved configurations
# --------------------------------------------------------------------------- #
@api_view(["POST"])
def save_configuration(request):
    serializer = SavedConfigurationSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
def get_configurations(request, session_id):
    qs = SavedConfiguration.objects.filter(session_id=session_id)
    serializer = SavedConfigurationSerializer(qs, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def health(request):
    return Response({"status": "ok", "service": "kraftwear-api"})
