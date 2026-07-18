from django.contrib import admin

from .models import CraftType, GarmentType, SavedConfiguration


@admin.register(GarmentType)
class GarmentTypeAdmin(admin.ModelAdmin):
    list_display = ("name", "base_price", "occasion", "fabric")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(CraftType)
class CraftTypeAdmin(admin.ModelAdmin):
    list_display = ("name", "price_range_min", "price_range_max")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(SavedConfiguration)
class SavedConfigurationAdmin(admin.ModelAdmin):
    list_display = ("session_id", "garment_type", "neck_shape", "craft_type", "created_at")
    list_filter = ("neck_shape", "created_at")
