import os
import secrets
from dotenv import load_dotenv

load_dotenv()

# gemini api key
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")

# database (mongodb)
DB_URL = os.environ.get("DB_URL")
DB_NAME = os.environ.get("DB_NAME", "career-assistant")

# course scraping limits
MIN_COURSE_LIMIT = int(os.environ.get("MIN_COURSE_LIMIT", 10))

# authentication (jwt)
SECRET_KEY = os.environ.get("SECRET_KEY", secrets.token_hex(32))
ALGORITHM = os.environ.get("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7

# admins
SUPER_ADMINS = {admin for admin in os.environ.get("SUPER_ADMINS", "").split(" ")}

# developer mode
DEV_MODE = bool(os.environ.get("DEV_MODE", False))
