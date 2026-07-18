from django.core.management.base import BaseCommand
from django.utils.text import slugify

from api.mannequin_data import BASE_MANNEQUIN_SVG, GARMENTS, zone_coordinates_for
from api.models import CraftType, GarmentType

GARMENT_SEED = [
    ("Blouse", 799, "Wedding", "Silk", "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600"),
    ("Kurti", 649, "Casual", "Cotton", "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600"),
    ("Saree", 2499, "Festival", "Silk", "https://images.unsplash.com/photo-1610189000823-3d0d02b3a6ff?w=600"),
    ("Frock", 499, "Kids", "Cotton", "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600"),
    ("Churidar", 899, "Office", "Georgette", "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600"),
    ("Lehenga", 3499, "Wedding", "Georgette", "https://images.unsplash.com/photo-1594612173561-ffd3a1c2c1b5?w=600"),
]

CRAFT_SEED = [
    {
        "name": "Zari Work",
        "description": "Gold/silver metallic thread embroidery. The hallmark of Kanjivaram sarees and wedding blouses — rich, reflective, and ceremonial.",
        "occasion_tags": ["wedding", "festival", "party"],
        "fabric_compatibility": ["Silk", "Georgette"],
        "price_range_min": 800,
        "price_range_max": 5000,
        "texture_image": "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=300",
    },
    {
        "name": "Aari Work",
        "description": "Hook-needle embroidery from Tamil Nadu producing fine floral and geometric motifs. Popular on blouses and dupattas.",
        "occasion_tags": ["festival", "party", "casual"],
        "fabric_compatibility": ["Silk", "Cotton", "Georgette", "Crepe"],
        "price_range_min": 500,
        "price_range_max": 3000,
        "texture_image": "https://images.unsplash.com/photo-1591622180787-1bd7a5b0d5b8?w=300",
    },
    {
        "name": "Kasuti / Kantha",
        "description": "Running-stitch embroidery. Kantha hails from Bengal, Kasuti from Karnataka. Understated charm for cotton sarees and casual wear.",
        "occasion_tags": ["casual", "office"],
        "fabric_compatibility": ["Cotton", "Linen"],
        "price_range_min": 300,
        "price_range_max": 1500,
        "texture_image": "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=300",
    },
    {
        "name": "Thread Work / Stone Work",
        "description": "Coloured thread for everyday elegance; stones and beads for party and bridal sparkle.",
        "occasion_tags": ["casual", "office", "party", "wedding"],
        "fabric_compatibility": ["Cotton", "Silk", "Georgette", "Chiffon", "Crepe"],
        "price_range_min": 400,
        "price_range_max": 4000,
        "texture_image": "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=300",
    },
    {
        "name": "Cutwork / Mirror Work",
        "description": "Lace-like cutwork or stitched-in mirrors that catch the light. Great on frocks and kurtis.",
        "occasion_tags": ["festival", "party", "casual"],
        "fabric_compatibility": ["Cotton", "Georgette", "Chiffon"],
        "price_range_min": 500,
        "price_range_max": 3500,
        "texture_image": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300",
    },
    {
        "name": "Smocking / Pintuck",
        "description": "Fabric gathered into elastic, textured folds. Perfect for frocks, kids wear and kurti sleeves.",
        "occasion_tags": ["kids", "casual"],
        "fabric_compatibility": ["Cotton", "Chiffon", "Crepe"],
        "price_range_min": 300,
        "price_range_max": 1800,
        "texture_image": "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=300",
    },
]


class Command(BaseCommand):
    help = "Seed the database with garment types and craft types."

    def handle(self, *args, **options):
        for name, price, occasion, fabric, image in GARMENT_SEED:
            obj, created = GarmentType.objects.update_or_create(
                slug=slugify(name),
                defaults={
                    "name": name,
                    "base_price": price,
                    "occasion": occasion,
                    "fabric": fabric,
                    "image_url": image,
                    "description": f"A beautiful {occasion.lower()} {name.lower()} in {fabric.lower()}.",
                    "svg_template": BASE_MANNEQUIN_SVG,
                    "zone_coordinates": zone_coordinates_for(name),
                },
            )
            self.stdout.write(("Created " if created else "Updated ") + f"garment: {name}")

        for craft in CRAFT_SEED:
            obj, created = CraftType.objects.update_or_create(
                slug=slugify(craft["name"]),
                defaults={**craft},
            )
            self.stdout.write(("Created " if created else "Updated ") + f"craft: {craft['name']}")

        self.stdout.write(self.style.SUCCESS("Seed complete."))
