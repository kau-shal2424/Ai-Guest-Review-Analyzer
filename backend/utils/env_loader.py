import os
import logging
from dotenv import load_dotenv

logger = logging.getLogger("uvicorn.error")

def load_env():
    """
    Loads environment variables robustly from the backend's .env file,
    even if the script is run from the project root directory.
    """
    # 1. First attempt: standard load_dotenv (searches CWD)
    load_dotenv(override=True)
    
    # 2. Check if critical variables are present. If not, try loading from
    # the backend folder relative to this file.
    if not os.getenv("MONGO_URI"):
        backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        env_path = os.path.join(backend_dir, ".env")
        if os.path.exists(env_path):
            load_dotenv(dotenv_path=env_path, override=True)
            logger.info(f"Loaded environment variables from relative fallback path: {env_path}")
        else:
            logger.warning(f"Could not find .env file at {env_path}")
