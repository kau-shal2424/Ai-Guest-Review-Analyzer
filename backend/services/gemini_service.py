# pyrefly: ignore [missing-import]

import os
import json
import logging

logger = logging.getLogger("uvicorn.error")


def analyze_with_gemini(review_text: str) -> dict:
    """
    Analyze a guest review using Google Gemini AI.

    Sends a structured prompt to gemini-1.5-flash and parses the JSON
    response to extract sentiment, theme, and a professional host reply.

    Returns:
        dict with keys: sentiment, theme, response

    Raises:
        Exception: if the API key is missing, the call fails, or the
                   response cannot be parsed — caller should fall back
                   to keyword analysis.
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

    prompt = f"""You are an expert hospitality AI assistant. Analyze the following guest review and respond with ONLY a valid JSON object — no markdown, no code fences, no extra text.

JSON format:
{{
  "sentiment": "Positive" or "Negative" or "Neutral",
  "theme": "Cleanliness" or "Food" or "Host" or "Location" or "Experience",
  "response": "<a warm, professional host reply addressing the guest's specific feedback, 2-3 sentences>"
}}

Rules:
- Choose the single most dominant theme from the review.
- The response must be polite, empathetic, and specific to what the guest mentioned.
- Do NOT include any text outside the JSON object.

Guest Review:
\"\"\"{review_text}\"\"\"
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

        result = json.loads(raw_text)

        # Validate required keys and allowed values
        allowed_sentiments = {"Positive", "Negative", "Neutral"}
        allowed_themes = {"Cleanliness", "Food", "Host", "Location", "Experience"}

        sentiment = result.get("sentiment", "Neutral")
        if sentiment not in allowed_sentiments:
            sentiment = "Neutral"

        theme = result.get("theme", "Experience")
        if theme not in allowed_themes:
            theme = "Experience"

        response_text = result.get("response", "").strip()
        if not response_text:
            raise ValueError("Gemini returned an empty response field.")

        logger.info(f"Gemini analysis complete — sentiment={sentiment}, theme={theme}")

        return {
            "sentiment": sentiment,
            "theme": theme,
            "response": response_text,
        }

    except json.JSONDecodeError as e:
        logger.error(f"Gemini returned non-JSON output: {e}. Raw: {raw_text[:200]}")
        raise ValueError(f"Gemini response was not valid JSON: {e}")
