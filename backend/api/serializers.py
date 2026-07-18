from rest_framework import serializers

from .models import CraftType, GarmentType, SavedConfiguration


class GarmentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = GarmentType
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "base_price",
            "occasion",
            "fabric",
            "image_url",
            "svg_template",
            "zone_coordinates",
        ]


class GarmentTypeListSerializer(serializers.ModelSerializer):
    """Lighter payload for catalogue listing (omits heavy SVG/zone data)."""

    class Meta:
        model = GarmentType
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "base_price",
            "occasion",
            "fabric",
            "image_url",
        ]


class CraftTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CraftType
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "occasion_tags",
            "fabric_compatibility",
            "price_range_min",
            "price_range_max",
            "texture_image",
        ]


class SavedConfigurationSerializer(serializers.ModelSerializer):
    garment_detail = GarmentTypeListSerializer(source="garment_type", read_only=True)
    craft_detail = CraftTypeSerializer(source="craft_type", read_only=True)

    class Meta:
        model = SavedConfiguration
        fields = [
            "id",
            "session_id",
            "garment_type",
            "garment_detail",
            "neck_shape",
            "craft_type",
            "craft_detail",
            "ref_image_url",
            "generated_pattern_url",
            "created_at",
        ]
        read_only_fields = ["created_at"]
