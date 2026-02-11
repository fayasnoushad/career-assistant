import os
import secrets
from dotenv import load_dotenv

load_dotenv()

# database (mongodb)
DB_URI = os.environ.get("DB_URI")
DB_NAME = os.environ.get("DB_NAME", "career-assistant")

# course scraping limits
MIN_COURSE_LIMIT = int(os.environ.get("MIN_COURSE_LIMIT", 20))

# job scraping limits
MIN_JOB_LIMIT = int(os.environ.get("MIN_JOB_LIMIT", 20))

# authentication (jwt)
SECRET_KEY = os.environ.get("SECRET_KEY", secrets.token_hex(32))
ALGORITHM = os.environ.get("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7

# email verification
EMAIL_USER = os.environ.get("EMAIL_USER")
EMAIL_PASS = os.environ.get("EMAIL_PASS")
OTP_EXPIRE_MINUTES = int(os.environ.get("OTP_EXPIRE_MINUTES", 10))

# admins
SUPER_ADMINS = {admin for admin in os.environ.get("SUPER_ADMINS", "").split(" ")}

# developer mode
DEV_MODE = bool(os.environ.get("DEV_MODE", False))
