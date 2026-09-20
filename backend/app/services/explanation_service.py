import os
import logging
from app.models.schemas import DeviceAnalysis, ConditionAnswers, RecommendationResponse

logger = logging.getLogger("ecosort.explanation")

def generate_grounded_explanation(
    device: DeviceAnalysis,
    answers: ConditionAnswers,
    rec_type: str,
    base_why: str
) -> str:
    """
    Produces a crisp, 2-4 sentence explanation grounded strictly in the collected facts.
    Avoids fabricated facts, medical overclaims, or unsupported recycler directories.
    """
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    
    # If API key is available, we can optionally ask Gemini to refine the narrative cleanly
    if api_key:
        try:
            from google import genai
            client = genai.Client(api_key=api_key)
            prompt = f"""You are the explanation module for EcoSort AI.
Write a concise 2 to 4 sentence explanation for an electronic device disposition recommendation.
Strict Grounding Rules:
- Base the reasoning ONLY on these facts:
  - Device: {device.brand} {device.device_type} (condition: {device.visible_condition}, damage: {', '.join(device.visible_damage) or 'none'})
  - Turns on: {answers.turns_on}
  - Battery hazard: {answers.battery_hazard}
  - Age: {answers.approximate_age.replace('_', ' ')}
  - Problem reported: {answers.main_problem.replace('_', ' ')}
  - Recommendation: {rec_type}
- Do NOT invent specific recycler names, locations, certifications, or medical/safety overclaims.
- Keep tone objective, supportive, and eco-conscious. Return only plain text sentences.
"""
            for m in ["gemini-flash-latest", "gemini-3.5-flash", "gemini-3.6-flash", "gemini-2.5-flash-lite"]:
                try:
                    res = client.models.generate_content(
                        model=m,
                        contents=prompt
                    )
                    text = res.text.strip()
                    if text and len(text) > 20:
                        return text
                except Exception:
                    continue
        except Exception as e:
            logger.warning(f"Gemini explanation generator fallback: {e}")

    # Fallback / Default deterministic grounded generator
    return base_why
