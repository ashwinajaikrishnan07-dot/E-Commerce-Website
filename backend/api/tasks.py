"""Celery tasks for long-running image generation jobs.

The synchronous views call ``ai_services`` directly for a snappy dev
experience. In production the pattern-generation call can be offloaded to this
task so the request returns immediately and the frontend polls for the result.
"""
from celery import shared_task

from . import ai_services


@shared_task(name="api.generate_pattern")
def generate_pattern_task(prompt, garment_type=None, zone=None):
    return ai_services.generate_pattern(prompt, garment_type=garment_type, zone=zone)


@shared_task(name="api.analyse_ref_image")
def analyse_ref_image_task(image_b64, media_type="image/jpeg"):
    import base64

    image_bytes = base64.b64decode(image_b64) if image_b64 else None
    return ai_services.analyse_ref_image(image_bytes, media_type=media_type)
