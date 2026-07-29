import os
import logging
from dotenv import find_dotenv, dotenv_values

logger = logging.getLogger("uvicorn.error")

def load_env():
    """
    Loads environment variables robustly from the backend's .env file,
    even if the script is run from the project root directory.
    Only loads non-empty values to avoid masking existing shell/system variables.
    """
    # 1. Find the .env file path
    env_path = find_dotenv()
    if not env_path:
        backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        env_path = os.path.join(backend_dir, ".env")
    
    # 2. If the file exists, read and inject non-empty values
    if os.path.exists(env_path):
        config = dotenv_values(env_path)
        for key, val in config.items():
            if val is not None and val.strip() != "":
                # System environment variables take precedence
                if key not in os.environ or os.environ[key] == "":
                    os.environ[key] = val
            else:
                # Clean up empty values to prevent them from masking terminal/system keys
                if key in os.environ and (os.environ[key] == "" or os.environ[key] is None):
                    del os.environ[key]
        logger.info(f"Loaded non-empty environment variables from: {env_path}")
    else:
        logger.warning(f"Could not find .env file at {env_path}")
