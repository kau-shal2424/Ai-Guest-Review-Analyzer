# pyrefly: ignore [missing-import]

import os
import json
import logging

logger = logging.getLogger("uvicorn.error")


def analyze_with_gemini(review_text: str) -> dict:
    """
    Analyze a guest review using Google Gemini AI.

    Sends a detailed hospital reputation management prompt to Gemini
    and returns a structured analysis dict matching the user's schema.
    """
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key:
        raise ValueError("GEMINI_API_KEY is not set in environment variables.")

    # Import here so the module loads fine even without the package installed
    import google.generativeai as genai  # type: ignore

    genai.configure(api_key=api_key)

    model = genai.GenerativeModel(
        model_name="gemini-3.5-flash"
    )

    prompt = f"""You are an expert hospitality analyst working for a hotel reputation management platform.

Analyze the following hotel review in detail.

Return ONLY valid JSON.

Schema:
{{
  "overall_score": number,
  "sentiment": "Positive" or "Negative" or "Neutral",
  "confidence": number,
  "emotion": string,
  "detected_rating": number,
  "core_theme": "Cleanliness" or "Food" or "Host" or "Location" or "Experience",
  "summary": string,
  "pros": [string],
  "cons": [string],
  "pain_points": [string],
  "business_impact": string,
  "priority_level": "Low" or "Medium" or "High",
  "expectations": [string],
  "action_items": [string],
  "keywords": [string],
  "departments": [string],
  "reply": string
}}

Analysis Rules
1. Identify all positive aspects.
2. Identify every complaint.
3. Detect hidden expectations.
4. Identify affected hotel departments.
5. Predict star rating (1 to 5).
6. Generate a professional management summary.
7. Generate at least 5 action items ordered by priority.
8. Extract all important keywords.
9. Produce a professional hotel response (under "reply").
10. Do not hallucinate.
11. Base every conclusion only on the review.

Review:
\"\"\"
{review_text}
\"\"\"
"""

    try:
        gemini_response = model.generate_content(prompt)
        raw_text = gemini_response.text.strip()

        # Strip markdown code fences if Gemini wraps the JSON anyway
        if raw_text.startswith("```"):
            raw_text = raw_text.split("```")[1]
            if raw_text.startswith("json"):
                raw_text = raw_text[4:]
            raw_text = raw_text.strip()
            if raw_text.endswith("```"):
                raw_text = raw_text[:-3].strip()

        result = json.loads(raw_text)

        # Validate required fields or assign defaults
        sentiment = result.get("sentiment", "Neutral")
        if sentiment not in {"Positive", "Negative", "Neutral"}:
            sentiment = "Neutral"

        theme = result.get("core_theme", result.get("theme", "Experience"))
        if theme not in {"Cleanliness", "Food", "Host", "Location", "Experience"}:
            theme = "Experience"

        reply = result.get("reply", result.get("response", "Thank you for your feedback.")).strip()

        return {
            "sentiment": sentiment,
            "theme": theme,
            "response": reply,
            "overall_score": result.get("overall_score", 75),
            "confidence": result.get("confidence", 80),
            "emotion": result.get("emotion", "Neutral"),
            "detected_rating": result.get("detected_rating", 3),
            "summary": result.get("summary", ""),
            "pros": result.get("pros", []),
            "cons": result.get("cons", []),
            "pain_points": result.get("pain_points", []),
            "business_impact": result.get("business_impact", ""),
            "priority_level": result.get("priority_level", "Medium"),
            "expectations": result.get("expectations", []),
            "action_items": result.get("action_items", []),
            "keywords": result.get("keywords", []),
            "departments": result.get("departments", []),
            "reply": reply
        }

    except Exception as e:
        logger.error(f"Gemini analysis failed or JSON parse error: {e}")
        raise
