"""AI service integrations (Claude + fal.ai) with graceful offline fallbacks.

Every function here degrades gracefully when API keys are not configured, so
the platform is fully runnable in local development without external services.
"""
import base64
import json
import logging

import requests
from django.conf import settings

logger = logging.getLogger(__name__)

# Detect Tamil script (Unicode block U+0B80–U+0BFF) to mirror the user's language.
_TAMIL_RANGE = range(0x0B80, 0x0BFF + 1)


def detect_language(text: str) -> str:
    if any(ord(ch) in _TAMIL_RANGE for ch in text or ""):
        return "ta"
    return "en"


def _anthropic_client():
    if not settings.ANTHROPIC_API_KEY:
        return None
    try:
        import anthropic

        return anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
    except Exception as exc:  # pragma: no cover - defensive
        logger.warning("Could not init Anthropic client: %s", exc)
        return None


# --------------------------------------------------------------------------- #
# Chatbot
# --------------------------------------------------------------------------- #
def chat_reply(message, page_context, language=None, conversation_history=None):
    language = language or detect_language(message)
    conversation_history = conversation_history or []
    page_name = (page_context or {}).get("page_name", "the site")
    page_desc = (page_context or {}).get("page_description", "")
    actions = (page_context or {}).get("available_actions", [])

    system_prompt = (
        "You are KraftWear's friendly shopping assistant for a South Indian "
        "ethnic wear platform (kurtis, sarees, blouses, frocks, churidars, "
        "lehengas). You are an expert in South Indian textile crafts.\n"
        f"The user is currently on: {page_name}.\n"
        f"Page description: {page_desc}\n"
        f"Available actions on this page: {', '.join(actions)}\n"
        "Detect the user's language (Tamil or English) and ALWAYS reply in the "
        "SAME language. Be warm, concise and helpful. Offer 1-3 short, "
        "context-aware suggested next actions relevant to this page."
    )

    client = _anthropic_client()
    if client is None:
        return _fallback_chat(message, page_name, actions, language)

    try:
        messages = []
        for turn in conversation_history[-8:]:
            role = turn.get("role", "user")
            content = turn.get("content", "")
            if content:
                messages.append({"role": role, "content": content})
        messages.append({"role": "user", "content": message})

        resp = client.messages.create(
            model=settings.CLAUDE_MODEL,
            max_tokens=600,
            system=system_prompt,
            messages=messages,
        )
        reply = "".join(
            block.text for block in resp.content if getattr(block, "type", "") == "text"
        ).strip()
        return {
            "reply": reply or _fallback_chat(message, page_name, actions, language)["reply"],
            "suggested_actions": _suggested_actions(page_name, actions),
        }
    except Exception as exc:  # pragma: no cover - network dependent
        logger.warning("Claude chat failed, using fallback: %s", exc)
        return _fallback_chat(message, page_name, actions, language)


def _suggested_actions(page_name, actions):
    return actions[:3] if actions else []


def _fallback_chat(message, page_name, actions, language):
    if language == "ta":
        reply = (
            f"வணக்கம்! நீங்கள் இப்போது '{page_name}' பக்கத்தில் இருக்கிறீர்கள். "
            "உங்களுக்கு எப்படி உதவலாம்? (AI விசை அமைக்கப்படவில்லை — இது மாதிரி பதில்.)"
        )
    else:
        reply = (
            f"Hi! You're on the '{page_name}' page. How can I help you explore "
            "South Indian ethnic wear and crafts today? "
            "(AI key not configured — this is a sample reply.)"
        )
    return {"reply": reply, "suggested_actions": _suggested_actions(page_name, actions)}


# --------------------------------------------------------------------------- #
# Craft recommendation (Customiser)
# --------------------------------------------------------------------------- #
def recommend_craft(occasion, fabric, budget):
    system_prompt = (
        "You are a South Indian textile craft expert. Given occasion, fabric, "
        "and budget, recommend the best embroidery craft type. Be specific, "
        "educational, and practical. Always explain why. Respond ONLY with a "
        "JSON object with keys: recommended_craft (string), reason (string), "
        "avoid (string), garment_examples (array of {name, description, "
        "image_url})."
    )
    user_prompt = (
        f"Occasion: {occasion}\nFabric: {fabric}\nBudget: INR {budget}\n"
        "Recommend the best craft."
    )

    client = _anthropic_client()
    if client is None:
        return _fallback_recommendation(occasion, fabric, budget)

    try:
        resp = client.messages.create(
            model=settings.CLAUDE_MODEL,
            max_tokens=900,
            system=system_prompt,
            messages=[{"role": "user", "content": user_prompt}],
        )
        text = "".join(
            b.text for b in resp.content if getattr(b, "type", "") == "text"
        ).strip()
        data = _extract_json(text)
        if data:
            data.setdefault("garment_examples", [])
            return data
    except Exception as exc:  # pragma: no cover
        logger.warning("Claude recommend failed, using fallback: %s", exc)
    return _fallback_recommendation(occasion, fabric, budget)


def _fallback_recommendation(occasion, fabric, budget):
    occasion_l = (occasion or "").lower()
    if occasion and occasion.lower() in ("wedding", "festival", "party"):
        craft = "Zari Work"
        reason = (
            f"For a {occasion} on {fabric}, Zari's gold/silver metallic thread "
            "adds the celebratory sheen that photographs beautifully and holds "
            "up under bright lighting."
        )
        avoid = "Avoid heavy stone work on lightweight fabrics — it drags the drape."
    elif occasion and occasion.lower() == "office":
        craft = "Thread Work"
        reason = (
            f"For office wear on {fabric}, subtle coloured thread work keeps the "
            "look refined and comfortable for long days."
        )
        avoid = "Avoid mirror or heavy stone work — too flashy for a workday."
    elif occasion and occasion.lower() == "kids":
        craft = "Smocking / Pintuck"
        reason = (
            "Smocking adds soft texture and stretch that is comfortable and "
            "durable for children's frocks."
        )
        avoid = "Avoid sharp stone/bead work near skin for kids."
    else:
        craft = "Aari Work"
        reason = (
            f"For {occasion or 'casual'} wear on {fabric}, Aari hook embroidery "
            "gives crisp floral detail at a friendly price point."
        )
        avoid = "Avoid dense zari — it can feel too formal for casual outings."

    return {
        "recommended_craft": craft,
        "reason": reason,
        "avoid": avoid,
        "garment_examples": [
            {
                "name": f"{craft} {fabric or 'Cotton'} Blouse",
                "description": f"Ideal for {occasion or 'everyday'} wear within your budget.",
                "image_url": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400",
            },
            {
                "name": f"{craft} Kurti",
                "description": "A versatile everyday piece with tasteful detailing.",
                "image_url": "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400",
            },
        ],
        "_fallback": True,
    }


# --------------------------------------------------------------------------- #
# Studio: Claude Vision reference-image analysis
# --------------------------------------------------------------------------- #
def analyse_ref_image(image_bytes, media_type="image/jpeg"):
    client = _anthropic_client()
    if client is None or not image_bytes:
        return {
            "description": (
                "Sample analysis: an intricate floral embroidery with medium "
                "density, gold and maroon threads, and a scalloped border motif. "
                "(AI key not configured — sample description.)"
            ),
            "_fallback": True,
        }
    try:
        b64 = base64.standard_b64encode(image_bytes).decode("utf-8")
        resp = client.messages.create(
            model=settings.CLAUDE_MODEL,
            max_tokens=500,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": media_type,
                                "data": b64,
                            },
                        },
                        {
                            "type": "text",
                            "text": (
                                "Describe the embroidery pattern, style, density, "
                                "and colours in this image. Be concise and produce "
                                "a description usable as an image-generation prompt."
                            ),
                        },
                    ],
                }
            ],
        )
        description = "".join(
            b.text for b in resp.content if getattr(b, "type", "") == "text"
        ).strip()
        return {"description": description}
    except Exception as exc:  # pragma: no cover
        logger.warning("Claude vision failed: %s", exc)
        return {
            "description": "Floral embroidery, medium density, gold threadwork.",
            "_fallback": True,
        }


# --------------------------------------------------------------------------- #
# Studio: fal.ai / Stable Diffusion pattern generation
# --------------------------------------------------------------------------- #
def generate_pattern(prompt, garment_type=None, zone=None):
    full_prompt = (
        f"Seamless South Indian embroidery texture. {prompt}. "
        f"Applied to a {garment_type or 'garment'} {zone or ''} zone, "
        "flat lay, high detail, fabric close-up."
    ).strip()

    if not settings.FAL_API_KEY:
        # Deterministic placeholder image so the canvas still renders something.
        seed = abs(hash(full_prompt)) % 1000
        return {
            "image_url": f"https://picsum.photos/seed/kw{seed}/512/512",
            "prompt": full_prompt,
            "_fallback": True,
        }

    try:
        resp = requests.post(
            f"https://fal.run/{settings.FAL_MODEL}",
            headers={
                "Authorization": f"Key {settings.FAL_API_KEY}",
                "Content-Type": "application/json",
            },
            json={"prompt": full_prompt, "image_size": "square"},
            timeout=90,
        )
        resp.raise_for_status()
        data = resp.json()
        images = data.get("images") or []
        image_url = images[0]["url"] if images else data.get("image", {}).get("url")
        return {"image_url": image_url, "prompt": full_prompt}
    except Exception as exc:  # pragma: no cover
        logger.warning("fal.ai generation failed: %s", exc)
        seed = abs(hash(full_prompt)) % 1000
        return {
            "image_url": f"https://picsum.photos/seed/kw{seed}/512/512",
            "prompt": full_prompt,
            "_fallback": True,
        }


# --------------------------------------------------------------------------- #
# Helpers
# --------------------------------------------------------------------------- #
def _extract_json(text):
    if not text:
        return None
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        start = text.find("{")
        end = text.rfind("}")
        if start != -1 and end != -1 and end > start:
            try:
                return json.loads(text[start : end + 1])
            except json.JSONDecodeError:
                return None
    return None
