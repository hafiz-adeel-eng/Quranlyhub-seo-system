import os

from dotenv import load_dotenv

load_dotenv()

GOOGLE_APPLICATION_CREDENTIALS = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS", "credentials/service-account.json")
GSC_SITE_URL = os.environ.get("GSC_SITE_URL", "")
GA4_PROPERTY_ID = os.environ.get("GA4_PROPERTY_ID", "")


def require_config():
    missing = [
        name
        for name, value in [
            ("GSC_SITE_URL", GSC_SITE_URL),
            ("GA4_PROPERTY_ID", GA4_PROPERTY_ID),
        ]
        if not value
    ]
    if missing:
        raise RuntimeError(
            f"Missing required .env values: {', '.join(missing)}. Copy .env.example to .env and fill them in."
        )
    if not os.path.exists(GOOGLE_APPLICATION_CREDENTIALS):
        raise RuntimeError(
            f"Service account key not found at '{GOOGLE_APPLICATION_CREDENTIALS}'. "
            "See README.md for how to create and place it."
        )
