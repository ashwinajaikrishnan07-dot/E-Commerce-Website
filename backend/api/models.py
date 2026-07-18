from django.db import models


class GarmentType(models.Model):
    """A wearable garment silhouette shown on the mannequin (Blouse, Kurti, ...)."""

    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True)
    description = models.TextField(blank=True, default="")
    base_price = models.DecimalField(max_digits=8, decimal_places=2)
    occasion = models.CharField(max_length=100, blank=True, default="")
    fabric = models.CharField(max_length=100, blank=True, default="")
    image_url = models.URLField(blank=True, default="")
    svg_template = models.TextField(blank=True, default="")  # base SVG for mannequin
    zone_coordinates = models.JSONField(default=dict, blank=True)  # zone path data

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class CraftType(models.Model):
    """An embroidery / craft style (Zari, Aari, Kasuti, ...)."""

    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True)
    description = models.TextField()
    occasion_tags = models.JSONField(default=list, blank=True)  # ['wedding', 'casual']
    fabric_compatibility = models.JSONField(default=list, blank=True)
    price_range_min = models.IntegerField(default=0)
    price_range_max = models.IntegerField(default=0)
    texture_image = models.URLField(blank=True, default="")  # Cloudinary URL

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class SavedConfiguration(models.Model):
    """A user-saved mannequin configuration (wishlist item)."""

    session_id = models.CharField(max_length=200, db_index=True)
    garment_type = models.ForeignKey(GarmentType, on_delete=models.CASCADE)
    neck_shape = models.CharField(max_length=50, blank=True, default="")
    craft_type = models.ForeignKey(CraftType, on_delete=models.CASCADE)
    ref_image_url = models.URLField(null=True, blank=True)
    generated_pattern_url = models.URLField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.session_id} — {self.garment_type} / {self.craft_type}"
